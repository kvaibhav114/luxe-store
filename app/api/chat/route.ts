import { NextResponse } from "next/server"
import type { Filter } from "mongodb"

import { formatPriceINR } from "@/lib/utils"
import { productsCollection, toProduct, type Product } from "@/lib/products"

type CatalogProduct = ReturnType<typeof toProduct>
type BudgetRange = { min?: number; max?: number }

type ClientProductSummary = {
  slug: string
  title: string
  description: string
  price: number
  currency: string
  category?: string
  brand?: string
  rating?: number
  inStock: boolean
  images: string[]
  url: string
}

const BASE_SYSTEM_PROMPT =
  "You are LUXE, a concise, helpful shopping assistant for a minimal e-commerce store. Keep answers short, polite, and practical."

export async function GET() {
  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT?.trim()
  const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT?.trim()
  const azureHasPath = Boolean(azureEndpoint && /\/openai\/deployments\//i.test(azureEndpoint))
  const hasAzure = Boolean(azureEndpoint && process.env.AZURE_OPENAI_API_KEY && (azureDeployment || azureHasPath))
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY)
  const provider = hasAzure ? "azure-openai" : hasOpenAI ? "openai" : "builtin"
  return NextResponse.json({ provider })
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as any
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = Array.isArray(body?.messages)
      ? body.messages
      : typeof body?.prompt === "string"
        ? [{ role: "user", content: String(body.prompt) }]
        : []

    const userText = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join("\n\n")
      .slice(-2000)

    const catalogProducts = await fetchRelevantProductsForChat(userText)
    const catalogSnapshot = buildCatalogSnapshot(catalogProducts)
    const catalogGuidance = buildCatalogGuidance(catalogProducts)
    const clientProducts = catalogProducts.map(mapProductForClient)

    const chatMessages = [
      { role: "system", content: BASE_SYSTEM_PROMPT },
      { role: "system", content: catalogGuidance },
      ...(catalogSnapshot ? [{ role: "system", content: catalogSnapshot }] : []),
      ...messages.map((m) => ({ role: m.role, content: String(m.content) })),
    ]

    const payload = {
      model: body?.model || "gpt-4o-mini",
      messages: chatMessages,
      temperature: body?.temperature ?? 0.4,
      max_tokens: body?.max_tokens ?? 300,
    }

    const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT?.trim()
    const azureApiKey = process.env.AZURE_OPENAI_API_KEY?.trim()
    const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT?.trim()
    const azureApiVersion = process.env.AZURE_OPENAI_API_VERSION?.trim() || "2024-02-15-preview"
    const azureEndpointHasPath = Boolean(azureEndpoint && /\/openai\/deployments\//i.test(azureEndpoint))
    const azureConfigured = Boolean(azureEndpoint && azureApiKey && (azureDeployment || azureEndpointHasPath))

    if (azureConfigured && azureEndpoint && azureApiKey) {
      let azureUrl: string | null = null
      try {
        azureUrl = buildAzureChatUrl(azureEndpoint, azureDeployment, azureApiVersion)
      } catch (err) {
        console.error("Azure OpenAI configuration error", err)
      }

      if (azureUrl) {
        const azurePayload = { ...payload }
        delete (azurePayload as any).model
        const res = await fetch(azureUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": azureApiKey,
          },
          body: JSON.stringify(azurePayload),
        })

        if (res.ok) {
          const data = await res.json()
          const reply = data?.choices?.[0]?.message?.content?.trim()
          if (reply) return NextResponse.json({ reply, provider: "azure-openai", products: clientProducts })
        } else {
          const errText = await res.text()
          const reply = fallbackReply(userText, catalogProducts)
          return NextResponse.json({ reply, provider: "azure-openai", error: errText, products: clientProducts }, { status: 200 })
        }
      }
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim()
    if (apiKey) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errText = await res.text()
        const reply = fallbackReply(userText, catalogProducts)
        return NextResponse.json({ reply, provider: "openai", error: errText, products: clientProducts }, { status: 200 })
      }

      const data = await res.json()
      const reply = data?.choices?.[0]?.message?.content?.trim()
      if (reply) return NextResponse.json({ reply, provider: "openai", products: clientProducts })
    }

    const reply = fallbackReply(userText, catalogProducts)
    return NextResponse.json({ reply, provider: "builtin", products: clientProducts })
  } catch (err: any) {
    return NextResponse.json(
      { reply: "I had trouble answering that just now. Please try again.", error: err?.message || "Unknown error" },
      { status: 200 },
    )
  }
}

function buildAzureChatUrl(endpoint: string, deployment: string | undefined, apiVersion: string) {
  const trimmed = endpoint.trim()
  if (/\/openai\/deployments\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed)
      if (apiVersion) url.searchParams.set("api-version", apiVersion)
      return url.toString()
    } catch {
      if (apiVersion && !trimmed.includes("api-version=")) {
        const separator = trimmed.includes("?") ? "&" : "?"
        return `${trimmed}${separator}api-version=${encodeURIComponent(apiVersion)}`
      }
      return trimmed
    }
  }
  if (!deployment) {
    throw new Error("AZURE_OPENAI_DEPLOYMENT is required when endpoint does not include a deployment path")
  }
  const base = trimmed.replace(/\/$/, "")
  const versionParam = apiVersion ? `?api-version=${encodeURIComponent(apiVersion)}` : ""
  return `${base}/openai/deployments/${deployment}/chat/completions${versionParam}`
}

async function fetchRelevantProductsForChat(text: string, limit = 6): Promise<CatalogProduct[]> {
  try {
    const col = await productsCollection()
    const { filter, sort } = buildProductFilter(text)
    const docs = await col
      .find(filter)
      .sort(sort)
      .limit(limit)
      .toArray()

    if (docs.length === 0) {
      const fallbackDocs = await col.find({}).sort({ rating: -1, createdAt: -1 }).limit(limit).toArray()
      return fallbackDocs.map((doc) => toProduct(doc as any))
    }

    return docs.map((doc) => toProduct(doc as any))
  } catch (error) {
    console.error("Failed to fetch catalog for chat:", error)
    return []
  }
}

function buildProductFilter(text: string): { filter: Filter<Product>; sort: Record<string, 1 | -1> } {
  const normalized = text.toLowerCase()
  const clauses: Filter<Product>[] = []

  const keywords = extractKeywords(normalized)
  if (keywords.length) {
    const pattern = keywords.map(escapeRegex).join("|")
    const regex = new RegExp(pattern, "i")
    clauses.push({
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { category: { $regex: regex } },
        { brand: { $regex: regex } },
      ],
    })
  }

  const budget = parseBudgetRange(normalized)
  if (budget) {
    clauses.push({
      price: {
        ...(budget.min ? { $gte: budget.min } : {}),
        ...(budget.max ? { $lte: budget.max } : {}),
      },
    })
  }

  let filter: Filter<Product> = {}
  if (clauses.length === 1) {
    filter = clauses[0]
  } else if (clauses.length > 1) {
    filter = { $and: clauses }
  }

  let sort: Record<string, 1 | -1> = { rating: -1, createdAt: -1 }
  if (budget?.max && !budget.min) {
    sort = { price: 1 }
  } else if (budget?.min && !budget.max) {
    sort = { price: -1 }
  }

  return { filter, sort }
}

function parseBudgetRange(text: string): BudgetRange | null {
  const explicitMatches = Array.from(text.matchAll(/(?:₹|rs\.?\s*)(\d[\d,]*)/gi))
  const implicitMatches = Array.from(text.matchAll(/(\d+(?:\.\d+)?)\s*k\b/gi))

  const values = explicitMatches
    .map((match) => parseInt(match[1].replace(/,/g, ""), 10))
    .filter((value) => Number.isFinite(value))

  implicitMatches.forEach((match) => {
    const numeric = Number.parseFloat(match[1])
    if (!Number.isNaN(numeric)) {
      values.push(Math.round(numeric * 1000))
    }
  })

  const uniqueValues = Array.from(new Set(values.filter((value) => value >= 100)))
  if (!uniqueValues.length) {
    return null
  }

  uniqueValues.sort((a, b) => a - b)
  const hasUpperBound = /\b(under|below|less|upto|up to|max|budget)\b/i.test(text)
  const hasLowerBound = /\b(over|above|more|min|minimum|greater)\b/i.test(text)

  if (uniqueValues.length >= 2) {
    return { min: uniqueValues[0], max: uniqueValues[uniqueValues.length - 1] }
  }

  const singleValue = uniqueValues[0]
  if (hasUpperBound) return { max: singleValue }
  if (hasLowerBound) return { min: singleValue }
  return { min: Math.round(singleValue * 0.7), max: Math.round(singleValue * 1.3) }
}

function extractKeywords(text: string) {
  const cleaned = text.replace(/[^a-z0-9\s]/g, " ")
  const words = cleaned
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
  return Array.from(new Set(words)).slice(0, 8)
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function buildCatalogGuidance(products: CatalogProduct[]) {
  if (products.length) {
    return "Only recommend items from the provided LUXE catalog snapshot. Mention product title, INR price, availability, and link as /products/<slug>. If nothing fits, request more details instead of inventing products."
  }
  return "The current catalog snapshot did not return matching products. Ask clarifying questions about category, style, or budget before offering to look again. Do not invent products."
}

function buildCatalogSnapshot(products: CatalogProduct[]) {
  if (!products.length) {
    return "Catalog snapshot: no matching products located for this query."
  }

  const lines = products.map((product) => {
    const details = [
      `slug: ${product.slug}`,
      `title: ${product.title}`,
      `price: ${formatPriceINR(product.price)}`,
      product.category ? `category: ${product.category}` : null,
      product.brand ? `brand: ${product.brand}` : null,
      `inStock: ${product.inStock ? "yes" : "no"}`,
    ]
      .filter((value): value is string => Boolean(value))
      .join(" | ")

    const description = product.description ? `summary: ${truncateText(product.description, 220)}` : null
    return description ? `- ${details} | ${description}` : `- ${details}`
  })

  return `Catalog snapshot (up to ${products.length} items):\n${lines.join("\n")}`
}

function fallbackReply(raw: string, products: CatalogProduct[]) {
  if (products.length) {
    const suggestions = products.slice(0, 3).map((product) => {
      const price = formatPriceINR(product.price)
      const category = product.category ? ` | ${product.category}` : ""
      return `• ${product.title}${category} — ${price} → /products/${product.slug}`
    })

    return `Here are some picks from our catalog:\n${suggestions.join("\n")}\nLet me know if you’d like more options or different criteria.`
  }

  const msg = (raw || "").toLowerCase()
  if (!msg) return "Hi! How can I help you today? I can track orders, help with returns, sizing, and product recommendations."
  if (msg.includes("order") || msg.includes("track")) return "Please share your order number and I’ll track it for you."
  if (msg.includes("return") || msg.includes("refund")) return "You can return items within 30 days. Shall I start a return?"
  if (msg.includes("size") || msg.includes("fit")) return "Happy to help with sizing. Which product are you considering?"
  if (msg.includes("recommend") || msg.includes("suggest") || msg.includes("product")) return "Tell me what you’re looking for—budget, category, or style—and I’ll suggest options."
  if (msg.includes("price") || msg.includes("cost") || msg.includes("budget")) return "What’s your price range? I’ll find items that fit."
  return "I can help with orders, returns, sizing, and recommendations. What would you like to do?"
}

function mapProductForClient(product: CatalogProduct): ClientProductSummary {
  return {
    slug: product.slug,
    title: product.title,
    description: product.description,
    price: product.price,
    currency: product.currency,
    category: product.category,
    brand: product.brand,
    rating: product.rating,
    inStock: product.inStock,
    images: Array.isArray(product.images) ? product.images.slice(0, 4) : [],
    url: `/products/${product.slug}`,
  }
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 1)}…`
}

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "your",
  "have",
  "about",
  "need",
  "want",
  "could",
  "would",
  "please",
  "help",
  "give",
  "show",
  "tell",
  "like",
  "looking",
  "find",
  "budget",
  "price",
  "under",
  "over",
  "between",
  "more",
  "less",
  "what",
  "best",
])
