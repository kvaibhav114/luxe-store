"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useAuth } from "@/contexts/auth-context"
import { formatPriceINR } from "@/lib/utils"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import React from "react"

export type ProductCardProps = {
  product: {
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
}

function hashStringToInt(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { addItem, openCart } = useCart()
  const { wishlist, toggleWishlist } = useWishlist()
  const { user, openAuthModal } = useAuth()

  const numericId = hashStringToInt(product._id || product.slug)
  const rating = product.rating ?? 0
  const image = product.images?.[0] || "/diverse-products-still-life.png"

  const handleAddToCart = () => {
    if (!user) {
      openAuthModal()
      return
    }
    addItem({
      id: numericId,
      name: product.title,
      price: product.price,
      image,
      category: product.category || "General",
      productId: product._id,
    })
    openCart()
  }

  return (
    <Card key={product._id || product.slug} className="group overflow-hidden border-border hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden">
        <ImageWithFallback
          src={image || "/placeholder.svg"}
          alt={product.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute top-3 left-3 flex gap-2">
          {product.inStock === false ? <Badge variant="destructive">Sold out</Badge> : null}
        </div>

        <div className="absolute top-3 right-3 z-20">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={() => toggleWishlist(numericId)}
          >
            <Heart className={`h-4 w-4 ${wishlist.includes(numericId) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </Button>
        </div>

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => router.push(`/products/${product.slug}`)}>
            <Eye className="h-4 w-4 mr-2" />
            Quick View
          </Button>
          <Button size="sm" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">{product.category || "General"}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">★</span>
              <span className="text-xs text-muted-foreground">{rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="font-semibold text-foreground text-pretty">{product.title}</h3>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">{formatPriceINR(product.price)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard
