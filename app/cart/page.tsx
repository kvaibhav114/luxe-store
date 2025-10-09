"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "@/components/cart-item"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatPriceINR } from "@/lib/utils"

export default function CartPage() {
  const { state, getTotalItems, getTotalPrice, clearCart } = useCart()

  return (
    <div className="min-h-screen bg-background">
      {/* Header removed - rendered globally by AppShell */}

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {getTotalItems() === 0 ? "Your cart is empty" : `${getTotalItems()} items in your cart`}
          </p>
        </div>

        {state.items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link href="/">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Cart Items ({getTotalItems()})</CardTitle>
                    <Button variant="ghost" size="sm" onClick={clearCart}>
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0">
                    {state.items.map((item, index) => (
                      <div key={item.id}>
                        <CartItem item={item} />
                        {index < state.items.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({getTotalItems()} items)</span>
                      <span className="text-foreground">{formatPriceINR(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground">Calculated at checkout</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPriceINR(getTotalPrice())}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link href="/checkout">
                      <Button className="w-full" size="lg">
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full bg-transparent">
                      Save for Later
                    </Button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-xs text-muted-foreground">
                      Free shipping on orders over {formatPriceINR(4000)}. Secure checkout with SSL encryption.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
