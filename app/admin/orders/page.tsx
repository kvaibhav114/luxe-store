"use client"

import { useEffect, useMemo, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/orders")
        const data = await res.json()
        const mapped = (data || []).map((o: any) => ({
          id: `ORD-${String(o._id).slice(-6)}`,
          customer: { name: String(o.userId ?? "Unknown"), email: "" },
          date: o.createdAt || new Date().toISOString(),
          status: o.status || "processing",
          total: Number(o.total) || 0,
          items: (o.items || []).map((it: any) => ({ name: it.title, quantity: it.quantity, price: it.price })),
          shipping: { address: "N/A", method: "N/A", tracking: o.tracking || null },
        }))
        setOrders(mapped)
      } catch {}
    })()
  }, [])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<(typeof mockOrders)[0] | null>(null)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold">{order.id}</h3>
                      <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.id}</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Customer Information</h4>
                                  <p className="text-sm">{selectedOrder.customer.name}</p>
                                  <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Order Status</h4>
                                  <Select
                                    value={selectedOrder.status}
                                    onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="shipped">Shipped</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Order Items</h4>
                                <div className="space-y-2">
                                  {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                                      <span>
                                        {item.name} x{item.quantity}
                                      </span>
                                      <span>${item.price.toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Shipping Information</h4>
                                <p className="text-sm">{selectedOrder.shipping.address}</p>
                                <p className="text-sm text-muted-foreground">{selectedOrder.shipping.method}</p>
                                {selectedOrder.shipping.tracking && (
                                  <p className="text-sm text-muted-foreground">
                                    Tracking: {selectedOrder.shipping.tracking}
                                  </p>
                                )}
                              </div>

                              <div className="flex justify-between items-center pt-4 border-t">
                                <span className="font-semibold">Total: ${selectedOrder.total.toFixed(2)}</span>
                                <Button>Update Order</Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
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
