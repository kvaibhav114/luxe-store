import { clientPromise } from "../lib/mongodb"
import type { Product } from "../lib/products"

function sampleProducts(): Product[] {
  const now = new Date().toISOString()
  return [
    {
      slug: "premium-wireless-headphones",
      title: "Premium Wireless Headphones",
      description: "Noise-cancelling over-ear headphones with studio-grade sound in a minimal matte finish.",
      price: 3999,
      currency: "USD",
      images: ["/premium-wireless-headphones.png"],
      category: "Audio",
      brand: "LUXE",
      rating: 4.7,
      inStock: true,
      variants: [{ name: "Color", value: "Black" }],
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "sleek-smartwatch",
      title: "Sleek Smartwatch",
      description: "Stainless steel smartwatch with AMOLED display and multi-day battery life.",
      price: 2499,
      currency: "USD",
      images: ["/sleek-smartwatch.jpg"],
      category: "Wearables",
      brand: "LUXE",
      rating: 4.5,
      inStock: true,
      variants: [{ name: "Size", value: "42mm" }],
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "minimal-desk-lamp",
      title: "Minimal Desk Lamp",
      description: "Adjustable LED desk lamp with high CRI and anodized aluminum finish.",
      price: 1299,
      currency: "USD",
      images: ["/minimal-desk-lamp.jpg"],
      category: "Home",
      brand: "LUXE",
      rating: 4.6,
      inStock: true,
      variants: [{ name: "Finish", value: "Black" }],
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "carbon-fiber-wallet",
      title: "Carbon Fiber Wallet",
      description: "RFID-blocking slim wallet crafted from premium carbon fiber.",
      price: 799,
      currency: "USD",
      images: ["/carbon-fiber-wallet.jpg"],
      category: "Accessories",
      brand: "LUXE",
      rating: 4.4,
      inStock: true,
      variants: [{ name: "Color", value: "Black" }],
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "studio-monitor-speakers",
      title: "Studio Monitor Speakers",
      description: "Compact nearfield monitors with balanced sound for music production and listening.",
      price: 8999,
      currency: "USD",
      images: ["/studio-monitor-speakers.jpg"],
      category: "Audio",
      brand: "LUXE",
      rating: 4.3,
      inStock: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "wireless-earbuds",
      title: "Wireless Earbuds",
      description: "Low-latency Bluetooth earbuds with comfortable fit and pocketable case.",
      price: 1999,
      currency: "USD",
      images: ["/wireless-earbuds.jpg"],
      category: "Audio",
      brand: "LUXE",
      rating: 4.2,
      inStock: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "linen-overshirt",
      title: "Linen Overshirt",
      description: "Breathable linen overshirt with relaxed fit and corozo buttons.",
      price: 1299,
      currency: "USD",
      images: ["/linen-overshirt.jpg"],
      category: "Clothing",
      brand: "LUXE",
      rating: 4.1,
      inStock: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "minimal-sneakers",
      title: "Minimal Sneakers",
      description: "Full-grain leather sneakers with cushioned insole and tonal stitching.",
      price: 7999,
      currency: "USD",
      images: ["/minimal-sneakers.jpg"],
      category: "Clothing",
      brand: "LUXE",
      rating: 4.4,
      inStock: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "ceramic-plant-pot",
      title: "Ceramic Plant Pot",
      description: "Matte ceramic planter with drainage and matching saucer.",
      price: 1999,
      currency: "USD",
      images: ["/ceramic-plant-pot.jpg"],
      category: "Home",
      brand: "LUXE",
      rating: 4.2,
      inStock: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "aroma-diffuser",
      title: "Aroma Diffuser",
      description: "Ultrasonic diffuser with soft ambient light and auto-shutoff.",
      price: 3999,
      currency: "USD",
      images: ["/aroma-diffuser.jpg"],
      category: "Home",
      brand: "LUXE",
      rating: 4.0,
      inStock: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "vitamin-c-serum",
      title: "Vitamin C Serum",
      description: "Potent brightening serum with stabilized vitamin C and hyaluronic acid.",
      price: 299,
      currency: "USD",
      images: ["/vitamin-c-serum.jpg"],
      category: "Beauty",
      brand: "LUXE",
      rating: 4.3,
      inStock: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "silk-eye-mask",
      title: "Silk Eye Mask",
      description: "Mulberry silk eye mask for comfortable, uninterrupted sleep.",
      price: 249,
      currency: "USD",
      images: ["/silk-eye-mask.jpg"],
      category: "Beauty",
      brand: "LUXE",
      rating: 4.6,
      inStock: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "usb-c-hub",
      title: "USB‑C Hub",
      description: "7‑in‑1 aluminum USB‑C hub with HDMI 4K and PD charging.",
      price: 579,
      currency: "USD",
      images: ["/usb-c-hub.jpg"],
      category: "Electronics",
      brand: "LUXE",
      rating: 4.2,
      inStock: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "mechanical-keyboard",
      title: "Mechanical Keyboard",
      description: "Low‑profile mechanical keyboard with hot‑swappable switches.",
      price: 4699,
      currency: "USD",
      images: ["/mechanical-keyboard.jpg"],
      category: "Electronics",
      brand: "LUXE",
      rating: 4.5,
      inStock: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "leather-card-holder",
      title: "Leather Card Holder",
      description: "Slim card holder in vegetable‑tanned leather.",
      price: 499,
      currency: "USD",
      images: ["/leather-card-holder.jpg"],
      category: "Accessories",
      brand: "LUXE",
      rating: 4.3,
      inStock: true,
      createdAt: now,
      updatedAt: now,
    },
  ]
}

async function run() {
  const dbName = process.env.MONGODB_DB_NAME
  if (!process.env.MONGODB_URI || !dbName) {
    console.log("Please set MONGODB_URI and MONGODB_DB_NAME environment variables.")
    return
  }

  const client = await clientPromise
  const db = client.db(dbName)
  const col = db.collection<Product>("products")

  await col.createIndex({ slug: 1 }, { unique: true })
  await col.createIndex({ title: "text", description: "text", brand: "text", category: "text" })

  const data = sampleProducts()
  for (const p of data) {
    await col.updateOne({ slug: p.slug }, { $set: p }, { upsert: true })
  }

  const count = await col.countDocuments()
  console.log(`[seed] Upserted ${data.length} sample products. Collection now has ${count} docs.`)
}

run()
  .then(() => {
    console.log("[seed] Done.")
  })
  .catch((err) => {
    console.error("[seed] Error:", err)
  })
