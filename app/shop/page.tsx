"use client"

import Link from "next/link"
import { Suspense } from "react"

// If your project exports these with an alias (@/components/*), you can switch to that import.
// Keeping relative-free imports to avoid path issues.
import ProductGrid from "@/components/product-grid"
import SearchBar from "@/components/search-bar"
import CategoryFilter from "@/components/category-filter"

export default function ShopPage() {
  return (
    <main className="min-h-[70vh] px-4 md:px-6 lg:px-8 py-8 mx-auto">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground text-balance">Shop</h1>
          <Link href="/" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
            Back to Home
          </Link>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Discover curated products with a refined, minimal aesthetic.
        </p>
      </header>

      <section className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
        <div className="w-full md:w-72 shrink-0 space-y-4">
          <CategoryFilter />
        </div>
        <div className="flex-1 space-y-4">
          <SearchBar />
          <Suspense fallback={<div className="text-sm text-muted-foreground">Loading products…</div>}>
            <ProductGrid />
          </Suspense>
        </div>
      </section>
    </main>
  )
}
