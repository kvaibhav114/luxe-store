"use client"

import { useMemo } from "react"
import useSWR from "swr"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ProductCard from "@/components/product-card"

type ApiProduct = {
  _id?: string
  slug: string
  title: string
  description?: string
  price: number
  currency?: string
  images: string[]
  category?: string
  brand?: string
  rating?: number
  inStock?: boolean
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())


export function ProductGrid() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  // build query string
  const key = useMemo(() => {
    const qs = new URLSearchParams()
    const q = searchParams.get("q")
    const category = searchParams.get("category")
    const sort = searchParams.get("sort")
    const priceMin = searchParams.get("priceMin")
    const priceMax = searchParams.get("priceMax")
    if (q) qs.set("q", q)
    if (category) qs.set("category", category)
    if (sort) qs.set("sort", sort)
    if (priceMin) qs.set("priceMin", priceMin)
    if (priceMax) qs.set("priceMax", priceMax)
    return `/api/products${qs.toString() ? `?${qs.toString()}` : ""}`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()])

  const { data, error, isLoading } = useSWR<{ items: ApiProduct[] }>(key, fetcher)
  const items = data?.items ?? []

  if (error) {
    return (
      <div className="rounded-md border border-border p-6 text-center">
        <p className="text-foreground font-medium">Failed to load products</p>
        <p className="text-muted-foreground text-sm mt-1">{String(error)}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {isLoading ? "Loading products..." : `Showing ${items.length} product${items.length === 1 ? "" : "s"}`}
        </p>
        <select
          className="bg-background border border-border rounded-md px-3 py-2 text-sm"
          value={searchParams.get("sort") ?? "featured"}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams.toString())
            const v = e.target.value
            if (v === "featured") params.delete("sort")
            else params.set("sort", v)
            router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`)
          }}
        >
          <option value="featured">Sort by: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="rating-desc">Best Rating</option>
        </select>
      </div>

      {isLoading ? (
        // skeletons
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-border">
              <div className="w-full h-64 bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="h-4 w-1/3 bg-muted animate-pulse rounded mb-2" />
                <div className="h-6 w-2/3 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-md border border-border p-10 text-center">
          <p className="text-foreground font-medium">No products found</p>
          <p className="text-muted-foreground text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => (
            <ProductCard key={product._id || product.slug} product={product as any} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Button variant="outline" size="lg" disabled>
          Load More Products
        </Button>
      </div>
    </div>
  )
}

export default ProductGrid
