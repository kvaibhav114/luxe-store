"use client"

import { createContext, useContext, useEffect, useState } from "react"

type WishlistContextType = {
  wishlist: number[]
  toggleWishlist: (id: number) => void
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("wishlist")
      if (stored) setWishlist(JSON.parse(stored))
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }
  }, [wishlist])

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return ctx
}
