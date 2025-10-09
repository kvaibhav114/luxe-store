"use client"

import Link from "next/link"
import { useMemo } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import ProductCard from "@/components/product-card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function hashStringToInt(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export default function RecommendationsPage() {
  const { state } = useCart()

  const cartCategories = useMemo(() => {
    const set = new Set<string>()
    for (const item of state.items) {
      if (item.category) set.add(item.category)
    }
    return Array.from(set)
  }, [state.items])

  const cartIds = useMemo(() => new Set(state.items.map((i) => i.id)), [state.items])

  const categoryParam = useMemo(() => (cartCategories.length ? encodeURIComponent(cartCategories.join(",")) : null), [
    cartCategories,
  ])

  const { data, error, isLoading } = useSWR<{ items: any[] }>(
    categoryParam ? `/api/products?category=${categoryParam}` : null,
    fetcher,
  )

  const recommended = useMemo(() => {
    const all = data?.items ?? []
    // Exclude items already in cart
    return all.filter((p) => !cartIds.has(hashStringToInt(p._id || p.slug)))
  }, [data?.items, cartIds])

  return (
    <main className="min-h-[70vh] px-4 md:px-6 lg:px-8 py-8 mx-auto">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">🤖 Recommendations</h1>
          <Link href="/" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
            Back to Home
          </Link>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Personalized picks based on items in your cart.</p>
      </header>

      {cartCategories.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No recommendations yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Add items to your cart to see category-based recommendations.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {cartCategories.map((c) => (
              <Badge key={c} variant="secondary">{c}</Badge>
            ))}
          </div>

          {isLoading ? (
            <p>Loading recommendations...</p>
          ) : error ? (
            <Card>
              <CardHeader>
                <CardTitle>Could not load recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Please try again later.</p>
              </CardContent>
            </Card>
          ) : recommended.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No recommendations found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">We couldn't find more items in these categories right now.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((product) => (
                <ProductCard key={product._id || product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
