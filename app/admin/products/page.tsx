"use client"

import { useEffect, useMemo, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/products")
        const data = await res.json()
        const items = (data?.items ?? []).map((p: any, idx: number) => ({
          id: p._id ?? idx,
          name: p.title,
          price: p.price,
          category: p.category || "",
          stock: p.inStock ? 100 : 0,
          status: p.inStock ? "active" : "out_of_stock",
          image: p.images?.[0] || "/placeholder.svg",
          description: p.description || "",
          sku: p.slug,
        }))
        setProducts(items)
      } catch {}
    })()
  }, [])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddingProduct, setIsAddingProduct] = useState(false)

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "out_of_stock":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "text-red-600" }
    if (stock < 10) return { label: "Low Stock", color: "text-yellow-600" }
    return { label: "In Stock", color: "text-green-600" }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input id="productName" placeholder="Enter product name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" placeholder="Enter SKU" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter product description" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="home">Home</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setIsAddingProduct(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" onClick={() => setIsAddingProduct(false)}>
                    Add Product
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock)
                return (
                  <div key={product.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        <Badge className={getStatusColor(product.status)}>{product.status.replace("_", " ")}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">SKU: {product.sku}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${product.price}</p>
                      <p className={`text-sm ${stockStatus.color}`}>{product.stock} in stock</p>
                      <p className={`text-xs ${stockStatus.color}`}>{stockStatus.label}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
