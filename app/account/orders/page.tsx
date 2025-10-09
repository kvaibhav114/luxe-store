"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { Package, Search, Eye, RotateCcw, Truck, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatPriceINR } from "@/lib/utils"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

import useSWR from "swr"

type ApiOrderItem = {
  productId?: any
  title: string
  price: number
  quantity: number
  image?: string | null
}

type ApiOrder = {
  _id: string
  userId: any
  items: ApiOrderItem[]
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  total: number
  createdAt: string
  updatedAt: string
  tracking?: string | null
}

const statusColors = {
  processing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")


  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const { data, isLoading, error } = useSWR<ApiOrder[]>(user ? `/api/orders?userId=${user.id}` : null, fetcher)
  const orders = data ?? []

  useEffect(() => {
    if (!user) {
      router.replace("/")
    }
  }, [router, user])

  if (!user) return null

  const filteredOrders = orders.filter((order) => {
    const orderNumber = `ORD-${order._id.slice(-6)}`
    const matchesSearch =
      orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <Package className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/account">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Account
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">Order History</h1>
            <p className="text-muted-foreground">Track and manage your orders</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
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
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
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
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || statusFilter !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "You haven't placed any orders yet"}
                    </p>
                    <Link href="/">
                      <Button>Start Shopping</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <Card key={order._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{`ORD-${order._id.slice(-6)}`}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <ImageWithFallback
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">{formatPriceINR(item.price)}</p>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Order Summary */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Total: <span className="font-semibold text-foreground">{formatPriceINR(order.total)}</span>
                          </p>
                          {order.tracking && (
                            <p className="text-sm text-muted-foreground">
                              Tracking: <span className="font-mono">{order.tracking}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {order.status === "delivered" && (
                            <Button variant="outline" size="sm">
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Return
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
