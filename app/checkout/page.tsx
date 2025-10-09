"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { PaymentForm } from "@/components/checkout/payment-form"
import { OrderReview } from "@/components/checkout/order-review"
import { OrderSummary } from "@/components/checkout/order-summary"
import { ArrowLeft, ArrowRight, Lock } from "lucide-react"
import { redirect } from "next/navigation"
import Link from "next/link"

const steps = [
  { id: 1, name: "Shipping", description: "Delivery information" },
  { id: 2, name: "Payment", description: "Payment method" },
  { id: 3, name: "Review", description: "Review your order" },
]

export interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  saveAddress: boolean
}

export interface PaymentInfo {
  method: "card" | "paypal" | "apple-pay"
  cardNumber: string
  expiryDate: string
  cvv: string
  cardName: string
  billingAddress: {
    sameAsShipping: boolean
    address?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null)
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const { state, getTotalItems, getTotalPrice, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()

  // Redirect if cart is empty
  useEffect(() => {
    if (state.items.length === 0) {
      redirect("/")
    }
  }, [state.items.length])

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleShippingSubmit = (data: ShippingInfo) => {
    setShippingInfo(data)
    handleNext()
  }

  const handlePaymentSubmit = (data: PaymentInfo) => {
    setPaymentInfo(data)
    handleNext()
  }

const handlePlaceOrder = async () => {
  if (!user) {
    alert("Please log in to place an order")
    return
  }

  setIsProcessing(true)

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id, // from auth-context
        items: state.items.map((item) => ({
          productId: item.productId, // Mongo _id captured from product documents
          title: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingInfo,  // optional (we can extend schema later)
        paymentInfo,   // optional
        total: getTotalPrice(),
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to place order")
    }

    const order = await res.json()
    console.log("✅ Order placed:", order)

    clearCart()

    window.location.href = "/checkout/success"
  } catch (err) {
    console.error("Error placing order:", err)
    alert("Error placing order. Please try again.")
  } finally {
    setIsProcessing(false)
  }
}

  if (state.items.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase securely</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.id}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p
                      className={`text-sm font-medium ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && <div className="flex-1 mx-4 h-px bg-border hidden sm:block" />}
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    {steps[currentStep - 1].name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentStep === 1 && (
                    <ShippingForm onSubmit={handleShippingSubmit} initialData={shippingInfo} userInfo={user} />
                  )}
                  {currentStep === 2 && (
                    <PaymentForm onSubmit={handlePaymentSubmit} initialData={paymentInfo} shippingInfo={shippingInfo} />
                  )}
                  {currentStep === 3 && (
                    <OrderReview
                      shippingInfo={shippingInfo!}
                      paymentInfo={paymentInfo!}
                      onPlaceOrder={handlePlaceOrder}
                      isProcessing={isProcessing}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Navigation */}
              {currentStep < 3 && (
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={(currentStep === 1 && !shippingInfo) || (currentStep === 2 && !paymentInfo)}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
