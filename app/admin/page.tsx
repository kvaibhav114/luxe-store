"use client"

"use client"

import { useEffect, useMemo, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown, Eye, ArrowUpRight } from "lucide-react"

// Data derived from APIs

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  const [orders, setOrders] = useState<any[]>([])
  const [usersList, setUsersList] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const [oRes, uRes, pRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/users"),
          fetch("/api/products"),
        ])
        const [o, u, p] = await Promise.all([oRes.json(), uRes.json(), pRes.json()])
        setOrders(o || [])
        setUsersList(u || [])
        setProducts((p?.items ?? []).map((x: any) => ({ ...x })))
      } catch {}
    })()
  }, [])

  const totals = useMemo(() => {
    const revenue = (orders || []).reduce((sum: number, ord: any) => sum + (Number(ord.total) || 0), 0)
    const ordersCount = (orders || []).length
    const customersCount = (usersList || []).length
    const productsSold = (orders || []).reduce(
      (sum: number, ord: any) => sum + (ord.items || []).reduce((s: number, it: any) => s + (it.quantity || 0), 0),
      0
    )
    return { revenue, ordersCount, customersCount, productsSold }
  }, [orders, usersList])

  const stats = [
    { title: "Total Revenue", value: `$${totals.revenue.toLocaleString()}` , change: "", trend: "up", icon: DollarSign },
    { title: "Total Orders", value: String(totals.ordersCount), change: "", trend: "up", icon: ShoppingCart },
    { title: "Total Customers", value: String(totals.customersCount), change: "", trend: "up", icon: Users },
    { title: "Products Sold", value: String(totals.productsSold), change: "", trend: "up", icon: Package },
  ]

  const recentOrders = useMemo(() => (orders || []).slice(0, 4).map((o: any) => ({
    id: `ORD-${String(o._id).slice(-6)}`,
    customer: String(o.userId ?? "Unknown"),
    amount: Number(o.total) || 0,
    status: o.status || "processing",
    date: o.createdAt || new Date().toISOString(),
  })), [orders])

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of products || []) {
      const c = p.category || "Other"
      counts[c] = (counts[c] || 0) + 1
    }
    const palette = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#A3E635", "#F97316"]
    return Object.entries(counts).map(([name, value], i) => ({ name, value, color: palette[i % palette.length] }))
  }, [products])

  const salesData = useMemo(() => {
    const safeOrders = Array.isArray(orders) ? orders : []
    const toDate = (d: any) => {
      const t = typeof d === "string" || typeof d === "number" ? new Date(d) : d instanceof Date ? d : null
      return t && !isNaN(t.getTime()) ? t : null
    }

    if (timeRange === "7d" || timeRange === "30d") {
      const days = timeRange === "7d" ? 7 : 30
      const map = new Map<string, number>()
      for (let i = days - 1; i >= 0; i--) {
        const dt = new Date()
        dt.setDate(dt.getDate() - i)
        const key = dt.toISOString().slice(0, 10)
        map.set(key, 0)
      }
      for (const o of safeOrders) {
        const d = toDate(o.createdAt)
        if (!d) continue
        const key = d.toISOString().slice(0, 10)
        if (map.has(key)) map.set(key, (map.get(key) || 0) + (Number(o.total) || 0))
      }
      return Array.from(map.entries()).map(([k, v]) => ({ month: k.slice(5), sales: Math.round(v) }))
    }

    // default to 12 months
    const now = new Date()
    const map = new Map<string, number>()
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      map.set(key, 0)
    }
    for (const o of safeOrders) {
      const d = toDate(o.createdAt)
      if (!d) continue
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      if (map.has(key)) map.set(key, (map.get(key) || 0) + (Number(o.total) || 0))
    }
    const monthLabel = (k: string) => {
      const [y, m] = k.split("-").map(Number)
      const d = new Date(y, (m || 1) - 1, 1)
      return d.toLocaleString(undefined, { month: "short" })
    }
    return Array.from(map.entries()).map(([k, v]) => ({ month: monthLabel(k), sales: Math.round(v) }))
  }, [orders, timeRange])

  const topProducts = useMemo(() => {
    const salesMap: Record<string, { name: string; sales: number; revenue: number }> = {}
    for (const ord of orders || []) {
      for (const it of ord.items || []) {
        const key = it.productId ? String(it.productId) : it.title
        const name = it.title || key
        if (!salesMap[key]) salesMap[key] = { name, sales: 0, revenue: 0 }
        salesMap[key].sales += it.quantity || 0
        salesMap[key].revenue += (it.price || 0) * (it.quantity || 0)
      }
    }
    return Object.values(salesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 4)
  }, [orders])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-full">
                    <stat.icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#000000" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <span className="text-sm font-medium">{category.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                      </div>
                      <p className="text-sm font-semibold">${product.revenue.toLocaleString()}</p>
                    </div>
                    <Progress value={(product.sales / 200) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    <p className="font-semibold">${order.amount}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                    <Button variant="ghost" size="sm">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
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
