"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart } from "lucide-react"
import { CartItem } from "./cart-item"
import Link from "next/link"
import { formatPriceINR } from "@/lib/utils"

export function CartDrawer() {
  const { state, getTotalItems, getTotalPrice, toggleCart, clearCart } = useCart()

  return (
<Sheet open={state.isOpen} onOpenChange={toggleCart}>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="relative">
      <ShoppingCart className="h-5 w-5" />
      {getTotalItems() > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {getTotalItems()}
        </Badge>
      )}
    </Button>
  </SheetTrigger>
  <SheetContent className="w-full sm:max-w-lg">
    <SheetHeader>
      <div className="flex items-center justify-between mr-6">
        <SheetTitle>Shopping Cart ({getTotalItems()})</SheetTitle>
        {state.items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearCart}>
            Clear All
          </Button>
        )}
      </div>
    </SheetHeader>
        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">Add some products to get started</p>
              <Button onClick={toggleCart}>Continue Shopping</Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4 px-4">
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-4 px-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPriceINR(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPriceINR(getTotalPrice())}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href="/checkout">
                    <Button className="w-full" size="lg" onClick={toggleCart}>
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full bg-transparent" onClick={toggleCart}>
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
