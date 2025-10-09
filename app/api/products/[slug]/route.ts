import { NextResponse } from "next/server"
import { productsCollection, toProduct } from "@/lib/products"

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const col = await productsCollection()
    const doc = await col.findOne({ slug: params.slug })
    if (!doc) return NextResponse.json({ error: "Product not found" }, { status: 404 })
    return NextResponse.json(toProduct(doc))
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch product" }, { status: 500 })
  }
}
