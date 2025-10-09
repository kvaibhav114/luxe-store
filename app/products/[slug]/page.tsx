import { notFound } from "next/navigation"
import { formatPriceINR } from "@/lib/utils"
import ProductActions from "@/components/product-actions"
import { productsCollection, toProduct } from "@/lib/products"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

async function getProductFromDb(slug: string) {
  const col = await productsCollection()
  const doc = await col.findOne({ slug })
  if (!doc) return null
  return toProduct(doc)
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductFromDb(slug)
  if (!product) return notFound()

  const image = (product as any).images?.[0] || "/diverse-products-still-life.png"

  return (
    <main className="min-h-[70vh] px-4 md:px-6 lg:px-8 py-8 mx-auto">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative w-full h-96 rounded-md overflow-hidden bg-muted">
          <ImageWithFallback src={image} alt={product.title} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">{product.title}</h1>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-foreground">{formatPriceINR(product.price)}</span>
              {typeof product.rating === "number" && (
                <span className="text-xs text-muted-foreground">★ {product.rating.toFixed(1)} • Rated</span>
              )}
              {product.inStock === false ? (
                <span className="text-xs text-destructive">Out of stock</span>
              ) : (
                <span className="text-xs text-green-600">In stock</span>
              )}
            </div>
            {product.category && (
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>
            )}
          </div>

          {product.description ? (
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p className="leading-6">{product.description}</p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>Crafted for daily use with a focus on comfort and durability.</li>
                <li>Thoughtful minimalist design pairs well with any setup or style.</li>
                <li>Backed by a 1-year limited warranty and 30-day returns.</li>
              </ul>
            </div>
          ) : null}

          <ProductActions
            productId={product._id}
            slug={product.slug}
            title={product.title}
            price={product.price}
            image={image}
            category={product.category || "General"}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-md border border-border p-4">
              <h3 className="font-medium text-foreground mb-2">Highlights</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                <li>Premium materials and refined finish</li>
                <li>Lightweight yet durable construction</li>
                <li>Designed for comfort and daily wear</li>
              </ul>
            </div>
            <div className="rounded-md border border-border p-4">
              <h3 className="font-medium text-foreground mb-2">Specifications</h3>
              <div className="text-sm text-muted-foreground grid grid-cols-2 gap-y-1">
                <span>Brand</span><span className="text-foreground">{product.brand || "Independent"}</span>
                <span>Category</span><span className="text-foreground">{product.category || "General"}</span>
                <span>Rating</span><span className="text-foreground">{typeof product.rating === "number" ? product.rating.toFixed(1) : "—"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-border p-4">
            <h3 className="font-medium text-foreground mb-2">Shipping & Returns</h3>
            <p className="text-sm text-muted-foreground">Free standard shipping on orders over ₹2,000. Easy 30‑day returns.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
