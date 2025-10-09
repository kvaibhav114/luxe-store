"use client"

import { useEffect, useMemo, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, Mail, Phone, MapPin, Calendar } from "lucide-react"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const [uRes, oRes] = await Promise.all([fetch("/api/users"), fetch("/api/orders")])
        const [users, orders] = await Promise.all([uRes.json(), oRes.json()])
        const orderByUser: Record<string, any[]> = {}
        for (const o of orders || []) {
          const uid = String(o.userId || "")
          if (!orderByUser[uid]) orderByUser[uid] = []
          orderByUser[uid].push(o)
        }
        const mapped = (users || []).map((u: any) => {
          const id = String(u._id)
          const userOrders = orderByUser[id] || []
          const totalOrders = userOrders.length
          const totalSpent = userOrders.reduce((s: number, o: any) => s + (Number(o.total) || 0), 0)
          const lastOrder = userOrders[0]?.createdAt || u.updatedAt || u.createdAt
          return {
            id,
            name: u.name || u.email,
            email: u.email,
            phone: "",
            avatar: "/diverse-user-avatars.png",
            joinDate: u.createdAt,
            totalOrders,
            totalSpent,
            status: totalOrders > 5 ? "vip" : totalOrders > 0 ? "active" : "new",
            address: "",
            lastOrder,
          }
        })
        setCustomers(mapped)
      } catch {}
    })()
  }, [])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof mockCustomers)[0] | null>(null)

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vip":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{customers.length}</p>
                <p className="text-sm text-muted-foreground">Total Customers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {customers.filter((c) => c.status === "new").length}
                </p>
                <p className="text-sm text-muted-foreground">New This Month</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {customers.filter((c) => c.status === "vip").length}
                </p>
                <p className="text-sm text-muted-foreground">VIP Customers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers List */}
        <Card>
          <CardHeader>
            <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                      <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{customer.name}</h3>
                        <Badge className={getStatusColor(customer.status)}>{customer.status.toUpperCase()}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${customer.totalSpent.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{customer.totalOrders} orders</p>
                    <p className="text-xs text-muted-foreground">
                      Last order: {new Date(customer.lastOrder).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(customer)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Customer Details</DialogTitle>
                        </DialogHeader>
                        {selectedCustomer && (
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-16 w-16">
                                <AvatarImage
                                  src={selectedCustomer.avatar || "/placeholder.svg"}
                                  alt={selectedCustomer.name}
                                />
                                <AvatarFallback>{getInitials(selectedCustomer.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h2 className="text-xl font-semibold">{selectedCustomer.name}</h2>
                                  <Badge className={getStatusColor(selectedCustomer.status)}>
                                    {selectedCustomer.status.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground">
                                  Customer since {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{selectedCustomer.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{selectedCustomer.phone}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                  <span className="text-sm">{selectedCustomer.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    Joined {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Total Orders</p>
                                  <p className="text-2xl font-bold">{selectedCustomer.totalOrders}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Total Spent</p>
                                  <p className="text-2xl font-bold">${selectedCustomer.totalSpent.toFixed(2)}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Average Order Value</p>
                                  <p className="text-2xl font-bold">
                                    ${(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Last Order</p>
                                  <p className="text-lg font-semibold">
                                    {new Date(selectedCustomer.lastOrder).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" className="flex-1 bg-transparent">
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </Button>
                              <Button variant="outline" className="flex-1 bg-transparent">
                                View Orders
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
