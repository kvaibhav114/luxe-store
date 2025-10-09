"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState("")
  const initialized = useRef(false)

  useEffect(() => {
    const currentQ = searchParams.get("q") || ""
    setSearchQuery(currentQ)
    initialized.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()])

  // Debounce search
  useEffect(() => {
    if (!initialized.current) return
    const handle = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchQuery.trim()) params.set("q", searchQuery.trim())
      else params.delete("q")
      router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`)
    }, 300)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("q")
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim())
    } else {
      params.delete("q")
    }
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`)
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-foreground">Search Products</h3>
      <form className="relative" onSubmit={onSubmit}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            aria-label="Clear search"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>
    </div>
  )
}

export default SearchBar
