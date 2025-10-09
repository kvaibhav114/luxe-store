"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Truck, Shield, RotateCcw } from "lucide-react"
import { formatPriceINR } from "@/lib/utils"
import { useCart } from "@/hooks/useCart" // Declare the useCart hook

export function OrderSummary() {
  const { state, getTotalItems, getTotalPrice } = useCart()

  const tax = getTotalPrice() * 0.08 // 8% tax
  const shipping = 0 // Free shipping
  const total = getTotalPrice() + tax + shipping

  return (
    <div className="space-y-6">
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {state.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {item.quantity}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <p className="text-sm font-semibold">{formatPriceINR(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({getTotalItems()} items)</span>
              <span>{formatPriceINR(getTotalPrice())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>{formatPriceINR(tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPriceINR(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over {formatPriceINR(4000)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">SSL encrypted checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day return policy</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
