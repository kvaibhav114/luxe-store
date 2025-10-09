import type { NextRequest } from "next/server"
import { productsCollection, toProduct, type Product } from "@/lib/products"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q")?.trim()
    const categoryParam = searchParams.get("category")?.trim()
    const col = await productsCollection()

    // Auto-seed on first run if collection is empty
    try {
      if ((await col.estimatedDocumentCount()) === 0) {
        const { sampleProducts } = await import("@/lib/seed-data")
        const seed = sampleProducts()
        if (seed.length) await col.insertMany(seed, { ordered: false })
      }
    } catch {}

    const filter: any = {}
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ]
    }
    if (categoryParam) {
      const parts = categoryParam.split(",").map((s) => s.trim()).filter(Boolean)
      filter.category = parts.length > 1 ? { $in: parts } : parts[0]
    }

    const priceRange = searchParams.get("priceRange")?.trim()
    const priceMin = searchParams.get("priceMin")
    const priceMax = searchParams.get("priceMax")
    if (priceMin || priceMax) {
      filter.price = {
        ...(priceMin ? { $gte: Number(priceMin) } : {}),
        ...(priceMax ? { $lt: Number(priceMax) } : {}),
      }
    } else if (priceRange) {
      const ranges: Record<string, { min?: number; max?: number }> = {
        "under-50": { max: 50 },
        "50-100": { min: 50, max: 100 },
        "100-200": { min: 100, max: 200 },
        "200-500": { min: 200, max: 500 },
        "over-500": { min: 500 },
      }
      const r = ranges[priceRange]
      if (r) {
        filter.price = {
          ...(r.min !== undefined ? { $gte: r.min } : {}),
          ...(r.max !== undefined ? { $lt: r.max } : {}),
        }
      }
    }

    const sortParam = searchParams.get("sort") || "newest"
    const sortMap: Record<string, any> = {
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      "newest": { createdAt: -1 },
      "rating-desc": { rating: -1 },
      "featured": { createdAt: -1 },
    }
    const sort = sortMap[sortParam] ?? { createdAt: -1 }

    const docs = await col.find(filter).sort(sort).limit(60).toArray()
    return Response.json({ items: docs.map(toProduct) })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Failed to fetch products" }), { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Product>
    if (!body.title || !body.price || !body.slug) {
      return new Response(JSON.stringify({ error: "Missing required fields: title, price, slug" }), { status: 400 })
    }
    const now = new Date().toISOString()
    const doc: Product = {
      slug: body.slug!,
      title: body.title!,
      description: body.description ?? "",
      price: Number(body.price),
      currency: (body.currency as any) ?? "USD",
      images: body.images ?? [],
      category: body.category,
      brand: body.brand,
      rating: body.rating ?? 0,
      inStock: body.inStock ?? true,
      variants: body.variants ?? [],
      createdAt: now,
      updatedAt: now,
    }
    const col = await productsCollection()
    await col.createIndex({ slug: 1 }, { unique: true })
    await col.createIndex({ title: "text", description: "text", brand: "text", category: "text" })
    const res = await col.insertOne(doc)
    return Response.json({ insertedId: String(res.insertedId) }, { status: 201 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Failed to create product" }), { status: 500 })
  }
}
