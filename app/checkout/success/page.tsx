"use client"

"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()

  const [orderNumber, setOrderNumber] = useState("")
  const [orderDate, setOrderDate] = useState("")
  const [estimatedDelivery, setEstimatedDelivery] = useState("")

  useEffect(() => {
    // Clear cart once and compute client-only dynamic values to avoid SSR/CSR mismatch
    clearCart()
    const now = new Date()
    setOrderDate(now.toLocaleDateString())
    setEstimatedDelivery(new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString())
    setOrderNumber(`ORD-${Date.now().toString().slice(-6)}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground text-lg">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Order Number</span>
                <span className="font-semibold">{orderNumber || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Order Date</span>
                <span className="font-semibold">{orderDate || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estimated Delivery</span>
                <span className="font-semibold">{estimatedDelivery || "-"}</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Confirmation Email</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  We've sent a confirmation email with your order details and tracking information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Order Tracking</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  You'll receive tracking information once your order ships.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Link href="/account/orders">
              <Button size="lg" className="w-full sm:w-auto">
                View Order Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Continue Shopping
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Need help with your order? Contact our customer support team at{" "}
              <a href="mailto:support@luxe.com" className="text-primary hover:underline">
                support@luxe.com
              </a>{" "}
              or call us at{" "}
              <a href="tel:+1-555-0123" className="text-primary hover:underline">
                (555) 012-3456
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
