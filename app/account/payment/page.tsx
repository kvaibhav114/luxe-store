"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { CreditCard, Plus, Edit, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

// Mock payment methods data
const mockPaymentMethods = [
  {
    id: "pm_1",
    type: "card",
    brand: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    holderName: "John Doe",
  },
  {
    id: "pm_2",
    type: "card",
    brand: "mastercard",
    last4: "5555",
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
    holderName: "John Doe",
  },
]

export default function PaymentMethodsPage() {
  const { user } = useAuth()
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)
  const [isAddingCard, setIsAddingCard] = useState(false)

  if (!user) {
    redirect("/")
  }

  const getBrandIcon = (brand: string) => {
    // In a real app, you'd use actual brand icons
    return <CreditCard className="h-6 w-6" />
  }

  const getBrandName = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1)
  }

  const setAsDefault = (methodId: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      })),
    )
  }

  const removePaymentMethod = (methodId: string) => {
    setPaymentMethods((methods) => methods.filter((method) => method.id !== methodId))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/account">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Account
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">Payment Methods</h1>
            <p className="text-muted-foreground">Manage your saved payment methods</p>
          </div>

          <div className="space-y-6">
            {/* Add New Payment Method */}
            <Card>
              <CardContent className="pt-6">
                <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Payment Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Payment Method</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input id="expiryDate" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => setIsAddingCard(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="flex-1" onClick={() => setIsAddingCard(false)}>
                          Add Card
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Payment Methods List */}
            <div className="space-y-4">
              {paymentMethods.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No payment methods</h3>
                      <p className="text-muted-foreground mb-4">
                        Add a payment method to make checkout faster and easier.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                paymentMethods.map((method) => (
                  <Card key={method.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {getBrandIcon(method.brand)}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {getBrandName(method.brand)} •••• {method.last4}
                              </h3>
                              {method.isDefault && <Badge variant="secondary">Default</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Expires {method.expiryMonth.toString().padStart(2, "0")}/{method.expiryYear}
                            </p>
                            <p className="text-sm text-muted-foreground">{method.holderName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!method.isDefault && (
                            <Button variant="outline" size="sm" onClick={() => setAsDefault(method.id)}>
                              Set as Default
                            </Button>
                          )}
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removePaymentMethod(method.id)}
                            disabled={method.isDefault}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Security Notice */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Your payment information is encrypted and stored securely. We never store your full card number or
                    CVV.
                  </p>
                  <p>
                    All transactions are processed through our secure payment partners and are protected by
                    industry-standard security measures.
                  </p>
                  <p>You can remove or update your payment methods at any time from this page.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
