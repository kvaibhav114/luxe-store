import { NextResponse } from "next/server"
import { productsCollection } from "@/lib/products"

function inr(n: number) {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)
  } catch {
    return `₹${Math.round(n).toLocaleString("en-IN")}`
  }
}

function toNum(v: any): number | undefined {
  if (v == null) return undefined
  if (typeof v === "number") return v
  if (typeof v === "string") {
    const p = parseFloat(v)
    return Number.isFinite(p) ? p : undefined
  }
  try {
    const s = typeof v.toString === "function" ? v.toString() : String(v)
    const p = parseFloat(s)
    return Number.isFinite(p) ? p : undefined
  } catch {
    return undefined
  }
}

export async function GET() {
  try {
    const col = await productsCollection()
    const agg = await col
      .aggregate([
        { $match: { price: { $type: "number" } } },
        { $bucketAuto: { groupBy: "$price", buckets: 5, output: { count: { $sum: 1 } } } },
        { $project: { min: "$_id.min", max: "$_id.max", count: 1, _id: 0 } },
        { $sort: { min: 1 } },
      ])
      .toArray()

    const items = (agg as any[]).map((b, i, arr) => {
      const min = toNum(b.min)
      const max = toNum(b.max)
      const safeMin = min ?? 0
      const safeMax = max ?? safeMin
      const label = i === 0
        ? `Under ${inr(safeMax)}`
        : i === arr.length - 1
        ? `Over ${inr(safeMin)}`
        : `${inr(safeMin)} - ${inr(safeMax)}`
      return { id: `bin-${i}`, min: min ?? undefined, max: max ?? undefined, count: b.count ?? 0, name: label }
    })

    return NextResponse.json({ items })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load price ranges" }, { status: 500 })
  }
}
