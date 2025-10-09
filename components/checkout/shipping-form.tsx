"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ShippingInfo } from "@/app/checkout/page"
import type { User } from "@/contexts/auth-context"

interface ShippingFormProps {
  onSubmit: (data: ShippingInfo) => void
  initialData: ShippingInfo | null
  userInfo: User | null
}

export function ShippingForm({ onSubmit, initialData, userInfo }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingInfo>({
    firstName: initialData?.firstName || userInfo?.firstName || "",
    lastName: initialData?.lastName || userInfo?.lastName || "",
    email: initialData?.email || userInfo?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zipCode: initialData?.zipCode || "",
    country: initialData?.country || "US",
    saveAddress: initialData?.saveAddress || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: keyof ShippingInfo, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Street Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          placeholder="123 Main Street"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CA">California</SelectItem>
              <SelectItem value="NY">New York</SelectItem>
              <SelectItem value="TX">Texas</SelectItem>
              <SelectItem value="FL">Florida</SelectItem>
              <SelectItem value="IL">Illinois</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => handleInputChange("zipCode", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="US">United States</SelectItem>
            <SelectItem value="CA">Canada</SelectItem>
            <SelectItem value="UK">United Kingdom</SelectItem>
            <SelectItem value="AU">Australia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="saveAddress"
          checked={formData.saveAddress}
          onCheckedChange={(checked) => handleInputChange("saveAddress", checked as boolean)}
        />
        <Label htmlFor="saveAddress" className="text-sm">
          Save this address for future orders
        </Label>
      </div>

      <Button type="submit" className="w-full">
        Continue to Payment
      </Button>
    </form>
  )
}
