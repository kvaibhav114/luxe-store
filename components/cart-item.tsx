"use client"

import { useCart, type CartItem as CartItemType } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Trash2 } from "lucide-react"
import { formatPriceINR } from "@/lib/utils"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.id)
    } else {
      updateQuantity(item.id, newQuantity)
    }
  }

  return (
    <div className="flex gap-4 py-4">
      <div className="flex-shrink-0">
        <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-medium text-foreground text-sm leading-tight">{item.name}</h4>
            <p className="text-xs text-muted-foreground">{item.category}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(item.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => handleQuantityChange(item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <p className="font-semibold text-foreground">{formatPriceINR(item.price * item.quantity)}</p>
            {item.quantity > 1 && <p className="text-xs text-muted-foreground">{formatPriceINR(item.price)} each</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
