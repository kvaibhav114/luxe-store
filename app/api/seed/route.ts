import { NextResponse } from "next/server"
import { productsCollection } from "@/lib/products"
import { sampleProducts } from "@/lib/seed-data"

export async function POST() {
  try {
    const col = await productsCollection()
    const docs = sampleProducts()
    for (const p of docs) {
      await col.updateOne({ slug: p.slug }, { $set: p }, { upsert: true })
    }
    const count = await col.countDocuments()
    return NextResponse.json({ ok: true, upserted: docs.length, total: count })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Seeding failed" }, { status: 500 })
  }
}

export async function GET() {
  // Convenience GET to trigger seeding from browser
  return POST()
}
