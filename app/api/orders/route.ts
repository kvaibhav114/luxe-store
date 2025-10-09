import { NextResponse } from "next/server"
import { Order } from "@/lib/models/Order"
import "@/lib/db"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Create a new order
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const order = await Order.create(body)
    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: "Error creating order" }, { status: 500 })
  }
}

// Fetch orders (optionally filter by userId)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId") || undefined
    const filter: any = userId ? { userId } : {}

    // Fetch orders without populate to avoid MissingSchemaError for Product
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean()

    // Enrich items with product snapshots (image/title) from native products collection
    const productIds = Array.from(
      new Set(
        (orders || [])
          .flatMap((o: any) => (o.items || []).map((it: any) => it.productId))
          .filter(Boolean)
          .map((id: any) => String(id))
      )
    )

    let productMap: Record<string, any> = {}
    if (productIds.length) {
      const db = await getDb()
      const docs = await db
        .collection("products")
        .find({ _id: { $in: productIds.map((s) => new ObjectId(s)) } })
        .project({ images: 1, title: 1 })
        .toArray()
      productMap = Object.fromEntries(docs.map((d: any) => [String(d._id), d]))
    }

    const normalized = (orders || []).map((o: any) => ({
      ...o,
      items: (o.items || []).map((it: any) => {
        const p = it.productId ? productMap[String(it.productId)] : undefined
        return {
          ...it,
          image: it.image ?? p?.images?.[0] ?? null,
          title: it.title ?? p?.title ?? "",
        }
      }),
    }))

    return NextResponse.json(normalized)
  } catch (err) {
    return NextResponse.json({ error: "Error fetching orders" }, { status: 500 })
  }
}
