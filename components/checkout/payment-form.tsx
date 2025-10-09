"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { PaymentInfo, ShippingInfo } from "@/app/checkout/page"
import { CreditCard, Smartphone, DollarSign } from "lucide-react"

interface PaymentFormProps {
  onSubmit: (data: PaymentInfo) => void
  initialData: PaymentInfo | null
  shippingInfo: ShippingInfo | null
}

export function PaymentForm({ onSubmit, initialData, shippingInfo }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentInfo>({
    method: initialData?.method || "card",
    cardNumber: initialData?.cardNumber || "",
    expiryDate: initialData?.expiryDate || "",
    cvv: initialData?.cvv || "",
    cardName: initialData?.cardName || "",
    billingAddress: {
      sameAsShipping: initialData?.billingAddress.sameAsShipping ?? true,
      address: initialData?.billingAddress.address || "",
      city: initialData?.billingAddress.city || "",
      state: initialData?.billingAddress.state || "",
      zipCode: initialData?.billingAddress.zipCode || "",
      country: initialData?.billingAddress.country || "",
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: keyof PaymentInfo, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleBillingAddressChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, [field]: value },
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base font-semibold">Payment Method</Label>
        <RadioGroup
          value={formData.method}
          onValueChange={(value) => handleInputChange("method", value as PaymentInfo["method"])}
        >
          <Card
            className={`cursor-pointer transition-colors ${formData.method === "card" ? "ring-2 ring-primary" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="h-5 w-5" />
                <Label htmlFor="card" className="cursor-pointer">
                  Credit or Debit Card
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${formData.method === "paypal" ? "ring-2 ring-primary" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="paypal" id="paypal" />
                <DollarSign className="h-5 w-5" />
                <Label htmlFor="paypal" className="cursor-pointer">
                  PayPal
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${formData.method === "apple-pay" ? "ring-2 ring-primary" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="apple-pay" id="apple-pay" />
                <Smartphone className="h-5 w-5" />
                <Label htmlFor="apple-pay" className="cursor-pointer">
                  Apple Pay
                </Label>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>
      </div>

      {formData.method === "card" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              value={formData.cardName}
              onChange={(e) => handleInputChange("cardName", e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={formData.cvv}
                onChange={(e) => handleInputChange("cvv", e.target.value)}
                placeholder="123"
                required
              />
            </div>
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-4">
        <Label className="text-base font-semibold">Billing Address</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sameAsShipping"
            checked={formData.billingAddress.sameAsShipping}
            onCheckedChange={(checked) => handleBillingAddressChange("sameAsShipping", checked as boolean)}
          />
          <Label htmlFor="sameAsShipping" className="text-sm">
            Same as shipping address
          </Label>
        </div>

        {!formData.billingAddress.sameAsShipping && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="billingAddress">Street Address</Label>
              <Input
                id="billingAddress"
                value={formData.billingAddress.address}
                onChange={(e) => handleBillingAddressChange("address", e.target.value)}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingCity">City</Label>
                <Input
                  id="billingCity"
                  value={formData.billingAddress.city}
                  onChange={(e) => handleBillingAddressChange("city", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingState">State</Label>
                <Input
                  id="billingState"
                  value={formData.billingAddress.state}
                  onChange={(e) => handleBillingAddressChange("state", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingZip">ZIP Code</Label>
                <Input
                  id="billingZip"
                  value={formData.billingAddress.zipCode}
                  onChange={(e) => handleBillingAddressChange("zipCode", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">
        Continue to Review
      </Button>
    </form>
  )
}
