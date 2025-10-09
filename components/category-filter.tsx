"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import useSWR from "swr"
import { usePathname, useRouter, useSearchParams } from "next/navigation"



export function CategoryFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])

  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const { data } = useSWR<{ items: { name: string; count: number }[] }>("/api/products/categories", fetcher)
  const { data: priceData } = useSWR<{ items: { id: string; name: string; count: number; min?: number; max?: number }[] }>("/api/products/price-ranges", fetcher)
  const categories = data?.items ?? []
  const priceRanges = priceData?.items ?? []

  // Sync selection from URL (single selection for now)
  useEffect(() => {
    const c = searchParams.get("category")
    setSelectedCategories(c ? [c] : [])
    const priceMin = searchParams.get("priceMin")
    const priceMax = searchParams.get("priceMax")
    if (priceMin || priceMax) {
      // Find the bin that matches these bounds if available
      const bin = (priceRanges || []).find((b: any) => String(b.min ?? "") === String(priceMin ?? "") && String(b.max ?? "") === String(priceMax ?? ""))
      setSelectedPriceRanges(bin ? [bin.id] : [])
    } else {
      setSelectedPriceRanges([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString(), JSON.stringify(priceRanges)])

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) => (prev.includes(name) ? [] : [name]))
  }

  // Reflect local state to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedCategories.length === 0) params.delete("category")
    else params.set("category", selectedCategories[0])

    if (selectedPriceRanges.length === 0) {
      params.delete("priceMin")
      params.delete("priceMax")
    } else {
      const sel = (priceRanges || []).find((b: any) => b.id === selectedPriceRanges[0])
      if (sel) {
        if (sel.min != null) params.set("priceMin", String(sel.min))
        else params.delete("priceMin")
        if (sel.max != null) params.set("priceMax", String(sel.max))
        else params.delete("priceMax")
      }
    }

    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, selectedPriceRanges, JSON.stringify(priceRanges)])

  const togglePriceRange = (id: string) => {
    setSelectedPriceRanges((prev) => (prev.includes(id) ? [] : [id]))
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedPriceRanges([])
    const params = new URLSearchParams(searchParams.toString())
    params.delete("category")
    params.delete("priceRange")
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-foreground mb-3">Categories</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={category.name}
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => toggleCategory(category.name)}
                  />
                  <label htmlFor={category.name} className="text-sm text-foreground cursor-pointer">
                    {category.name}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground">({category.count})</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium text-foreground mb-3">Price Range</h4>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <div key={range.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={range.id}
                    checked={selectedPriceRanges.includes(range.id)}
                    onCheckedChange={() => togglePriceRange(range.id)}
                  />
                  <label htmlFor={range.id} className="text-sm text-foreground cursor-pointer">
                    {range.name}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground">({range.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryFilter
