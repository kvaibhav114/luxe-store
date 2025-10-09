import { NextResponse } from "next/server"
import { productsCollection } from "@/lib/products"

export async function GET() {
  try {
    const col = await productsCollection()
    const agg = await col
      .aggregate([
        { $match: { category: { $exists: true, $ne: null, $ne: "" } } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $project: { _id: 0, name: "$_id", count: 1 } },
        { $sort: { count: -1, name: 1 } },
      ])
      .toArray()
    return NextResponse.json({ items: agg })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load categories" }, { status: 500 })
  }
}
