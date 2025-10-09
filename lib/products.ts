import type { WithId, Document } from "mongodb"
import { getDb } from "./mongodb"

export type Product = {
  slug: string
  title: string
  description: string
  price: number
  currency: "USD" | "EUR" | "GBP" | "INR" | string
  images: string[]
  category?: string
  brand?: string
  rating?: number
  inStock: boolean
  variants?: { name: string; value: string }[]
  createdAt: string
  updatedAt: string
}

export async function productsCollection() {
  const db = await getDb()
  return db.collection<Product>("products")
}

export function toProduct(dto: WithId<Document>): Product & { _id: string } {
  const { _id, ...rest } = dto as any
  return { ...rest, _id: String(_id) }
}
