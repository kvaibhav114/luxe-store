"use client"

'use client'

import { createContext, useContext, useState, type ReactNode } from "react"

export interface ChatProduct {
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

export interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "quick-reply" | "product-recommendation"
  products?: ChatProduct[]
}

interface ChatContextType {
  messages: Message[]
  isTyping: boolean
  isConnected: boolean
  sendMessage: (content: string) => Promise<void>
  sendQuickReply: (action: string) => Promise<void>
  clearChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm your LUXE shopping assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [isConnected] = useState(true)

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    try {
      const history = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.content,
      }))
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...history, { role: "user", content }] }),
      })
      const data = await res.json().catch(() => null)
      const products = normalizeProducts(data?.products)
      const reply = (data?.reply && String(data.reply)) ||
        (products.length ? "Here are some options you might like:" : "I couldn’t answer that just now. Please try again.")

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: reply,
        sender: "bot",
        timestamp: new Date(),
        type: products.length ? "product-recommendation" : "text",
        products,
      }
      setMessages((prev) => [...prev, botResponse])
    } catch {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I’m having trouble responding at the moment. Please try again shortly.",
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, botResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const sendQuickReply = async (action: string) => {
    const map: Record<string, string> = {
      "track-order": "I want to track my order.",
      returns: "Tell me about returns.",
      "size-guide": "I need help with sizing.",
      "product-help": "Recommend products for me.",
    }
    const prompt = map[action] || "I need help."
    await sendMessage(prompt)
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        content: "Hi! I'm your LUXE shopping assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      },
    ])
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        isConnected,
        sendMessage,
        sendQuickReply,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

function normalizeProducts(input: unknown): ChatProduct[] {
  if (!Array.isArray(input)) {
    return []
  }

  return input
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null
      }

      const product = item as Record<string, unknown>
      const slug = typeof product.slug === "string" ? product.slug : null
      const title = typeof product.title === "string" ? product.title : null
      const description = typeof product.description === "string" ? product.description : ""
      const price = typeof product.price === "number" ? product.price : Number(product.price)
      const currency = typeof product.currency === "string" ? product.currency : "INR"
      const category = typeof product.category === "string" ? product.category : undefined
      const brand = typeof product.brand === "string" ? product.brand : undefined
      const rating = typeof product.rating === "number" ? product.rating : undefined
      const inStock = typeof product.inStock === "boolean" ? product.inStock : true
      const images = Array.isArray(product.images)
        ? product.images.filter((value): value is string => typeof value === "string").slice(0, 4)
        : []
      const url = typeof product.url === "string" ? product.url : slug ? `/products/${slug}` : ""

      if (!slug || !title || !Number.isFinite(price)) {
        return null
      }

      return {
        slug,
        title,
        description,
        price,
        currency,
        category,
        brand,
        rating,
        inStock,
        images,
        url,
      }
    })
    .filter((value): value is ChatProduct => Boolean(value))
}
