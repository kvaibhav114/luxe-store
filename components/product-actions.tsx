"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"

export default function ProductActions({
  productId,
  slug,
  title,
  price,
  image,
  category,
}: {
  productId?: string
  slug: string
  title: string
  price: number
  image: string
  category: string
}) {
  const { addItem, openCart } = useCart()
  const { user, openAuthModal } = useAuth()

  const handleAdd = () => {
    if (!user) {
      openAuthModal()
      return
    }
    // Use a stable numeric id for cart UI while preserving Mongo id separately
    const id = Math.abs(
      Math.imul(
        31,
        slug.split("").reduce((a, c) => (Math.imul(31, a) + c.charCodeAt(0)) | 0, 0),
      ),
    )
    addItem({ id, name: title, price, image, category, productId })
    openCart()
  }

  return (
    <div className="flex items-center gap-3 pt-2">
      <Button onClick={handleAdd}>Add to Cart</Button>
    </div>
  )
}
