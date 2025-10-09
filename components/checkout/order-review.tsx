"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import type { ShippingInfo, PaymentInfo } from "@/app/checkout/page"
import { Loader2, MapPin, CreditCard, Package } from "lucide-react"
import { formatPriceINR } from "@/lib/utils"

interface OrderReviewProps {
  shippingInfo: ShippingInfo
  paymentInfo: PaymentInfo
  onPlaceOrder: () => void
  isProcessing: boolean
}

export function OrderReview({ shippingInfo, paymentInfo, onPlaceOrder, isProcessing }: OrderReviewProps) {
  const { state, getTotalPrice } = useCart()

  const tax = getTotalPrice() * 0.08 // 8% tax
  const shipping = 0 // Free shipping
  const total = getTotalPrice() + tax + shipping

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items ({state.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {state.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <p className="text-sm">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPriceINR(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="font-medium">{`${shippingInfo.firstName} ${shippingInfo.lastName}`}</p>
            <p>{shippingInfo.address}</p>
            <p>{`${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`}</p>
            <p>{shippingInfo.country}</p>
            <p className="text-sm text-muted-foreground">{shippingInfo.phone}</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {paymentInfo.method === "card" && (
              <>
                <p className="font-medium">Credit Card</p>
                <p className="text-sm text-muted-foreground">**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                <p className="text-sm text-muted-foreground">{paymentInfo.cardName}</p>
              </>
            )}
            {paymentInfo.method === "paypal" && <p className="font-medium">PayPal</p>}
            {paymentInfo.method === "apple-pay" && <p className="font-medium">Apple Pay</p>}
          </div>
        </CardContent>
      </Card>

      {/* Order Total */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPriceINR(getTotalPrice())}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between">
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

      <Button onClick={onPlaceOrder} disabled={isProcessing} className="w-full" size="lg">
        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isProcessing ? "Processing Order..." : "Place Order"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By placing your order, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  )
}
