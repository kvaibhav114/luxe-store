"use client"

import useSWR from "swr"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function CategoriesOverviewPage() {
  const { data, error, isLoading } = useSWR<{ items: any[] }>("/api/products", fetcher)
  const items = data?.items ?? []

  const byCategory: Record<string, any[]> = {}
  for (const p of items) {
    const c = p.category || "Other"
    if (!byCategory[c]) byCategory[c] = []
    byCategory[c].push(p)
  }
  const categories = Object.keys(byCategory).sort((a, b) => a.localeCompare(b))

  return (
    <main className="min-h-[70vh] px-4 md:px-6 lg:px-8 py-8 mx-auto">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">Shop by Category</h1>
          <Link href="/shop" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
            Back to Shop
          </Link>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Browse curated collections organized by category.</p>
      </header>

      {error && (
        <div className="rounded-md border border-border p-6 text-center">Failed to load categories</div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-border">
              <div className="w-full h-40 bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="h-6 w-1/3 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {categories.map((cat) => {
            const prods = byCategory[cat]
            return (
              <section key={cat} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">{cat}</h2>
                  <Link href={`/shop?category=${encodeURIComponent(cat)}`} className="text-sm text-muted-foreground hover:text-foreground">
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {prods.slice(0, 6).map((p: any) => (
                    <ProductCard key={p._id || p.slug} product={p} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}

      {!isLoading && categories.length === 0 && (
        <div className="rounded-md border border-border p-10 text-center">
          <p className="text-foreground font-medium">No categories found</p>
          <p className="text-muted-foreground text-sm mt-1">Add products to populate categories.</p>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Button variant="outline" size="lg" disabled>
          Load More
        </Button>
      </div>
    </main>
  )
}
