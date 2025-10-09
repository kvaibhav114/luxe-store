"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { Heart, ShoppingCart, X, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatPriceINR } from "@/lib/utils"
import useSWR from "swr"
import { useEffect } from "react"

// fetch products from backend
const fetcher = (url: string) => fetch(url).then((r) => r.json())

function hashStringToInt(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export default function WishlistPage() {
  const { user } = useAuth()
  const { addItem, openCart } = useCart()
  const { wishlist, toggleWishlist } = useWishlist()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.replace("/")
  }, [user, router])

  const { data, error, isLoading } = useSWR<{ items: any[] }>("/api/products", fetcher)
  const allProducts = data?.items ?? []

  // filter products that are in wishlist
  const wishlistItems = allProducts.filter((p) => {
    const numericId = hashStringToInt(p._id || p.slug)
    return wishlist.includes(numericId)
  })

  const handleAddToCart = (item: any) => {
    const numericId = hashStringToInt(item._id || item.slug)
    addItem({
      id: numericId,
      name: item.title,
      price: item.price,
      image: item.images?.[0] || "/placeholder.svg",
      category: item.category || "General",
    })
    openCart()
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link href="/account">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Account
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length === 0 ? "Your wishlist is empty" : `${wishlistItems.length} items saved for later`}
            </p>
          </div>

          {isLoading ? (
            <p>Loading wishlist...</p>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-foreground mb-4">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Save items you love to your wishlist and come back to them later.
              </p>
              <Link href="/">
                <Button size="lg">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => {
                const numericId = hashStringToInt(item._id || item.slug)
                return (
                  <Card
                    key={item._id || item.slug}
                    className="group overflow-hidden border-border hover:shadow-lg transition-shadow"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.images?.[0] || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      <div className="absolute top-3 right-3 z-20">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-background/80 backdrop-blur-sm hover:bg-background"
                          onClick={() => toggleWishlist(numericId)}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="sm" onClick={() => handleAddToCart(item)}>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">
                            {item.category || "General"}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">★</span>
                            <span className="text-xs text-muted-foreground">{(item.rating ?? 0).toFixed(1)}</span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-foreground text-pretty">{item.title}</h3>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-foreground">{formatPriceINR(item.price)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
