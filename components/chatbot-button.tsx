'use client'

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Send } from "lucide-react"
import { useChat, type ChatProduct } from "@/contexts/chat-context"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { cn, formatPriceINR } from "@/lib/utils"

const QUICK_ACTIONS = [
  { id: "track-order", label: "Track Order" },
  { id: "returns", label: "Returns" },
  { id: "size-guide", label: "Size Guide" },
  { id: "product-help", label: "Product Help" },
]

const TIMESTAMP_OPTIONS: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" }

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const { messages, isTyping, isConnected, sendMessage, sendQuickReply, clearChat } = useChat()

  const messagesViewportRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const viewport = messagesViewportRef.current
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight
    }
  }, [messages.length, isTyping, isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const frame = requestAnimationFrame(() => {
      textareaRef.current?.focus()
    })

    return () => cancelAnimationFrame(frame)
  }, [isOpen])

  const togglePanel = () => {
    setIsOpen((prev) => !prev)
  }

  const handleSendMessage = async () => {
    const trimmed = inputValue.trim()

    if (!trimmed) {
      return
    }

    await sendMessage(trimmed)
    setInputValue("")
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    void handleSendMessage()
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      void handleSendMessage()
    }
  }

  const handleQuickReply = (actionId: string) => {
    void sendQuickReply(actionId)
  }

  return (
    <>
      <Button
        onClick={togglePanel}
        className="assistant-launcher"
        size="icon"
        aria-expanded={isOpen}
        aria-controls="assistant-panel"
      >
        {isOpen ? <X className="h-6 w-6" aria-hidden /> : <MessageCircle className="h-6 w-6" aria-hidden />}
      </Button>

      {isOpen && (
        <section
          id="assistant-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistant-panel-title"
          className="assistant-panel"
        >
          <header className="assistant-header">
            <div className="assistant-header-main">
              <h2 id="assistant-panel-title" className="assistant-title">
                LUXE Assistant
              </h2>
              <div className="assistant-status">
                <span
                  className={cn(
                    "assistant-status-indicator",
                    isConnected ? "assistant-status-indicator-online" : "assistant-status-indicator-offline"
                  )}
                  aria-hidden
                />
                <span>{isConnected ? "Online" : "Offline"}</span>
              </div>
            </div>

            <div className="assistant-header-actions">
              <Button variant="outline" size="sm" onClick={clearChat} disabled={!messages.length}>
                Clear
              </Button>
              <Button variant="ghost" size="icon" onClick={togglePanel} aria-label="Close chat">
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </header>

          <div className="assistant-body">
            <div
              ref={messagesViewportRef}
              className="assistant-messages"
              role="log"
              aria-live="polite"
              aria-relevant="additions"
            >
              {messages.map((message) => {
                const isUserMessage = message.sender === "user"
                const hasProducts = Boolean(message.products?.length)
                const hasText = Boolean(message.content?.trim())

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "assistant-message-row",
                      isUserMessage ? "assistant-message-row-user" : "assistant-message-row-assistant"
                    )}
                  >
                    <div
                      className={cn(
                        "assistant-message-bubble",
                        isUserMessage ? "assistant-message-bubble-user" : "assistant-message-bubble-assistant"
                      )}
                    >
                      <div className="assistant-message-content">
                        {hasText && <p className="assistant-message-text">{message.content}</p>}

                        {hasProducts && (
                          <div className="assistant-product-list">
                            {message.products?.map((product) => (
                              <ProductSuggestion key={`${message.id}-${product.slug}`} product={product} />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="assistant-message-meta">
                        {message.timestamp.toLocaleTimeString([], TIMESTAMP_OPTIONS)}
                      </div>
                    </div>
                  </div>
                )
              })}

              {isTyping && (
                <div className="assistant-message-row assistant-message-row-assistant">
                  <div className="assistant-typing">
                    <span className="assistant-typing-dot animate-bounce" />
                    <span className="assistant-typing-dot animate-bounce animation-delay-100" />
                    <span className="assistant-typing-dot animate-bounce animation-delay-200" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <footer className="assistant-footer">
            <div className="assistant-quick-actions">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply(action.id)}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>

            <form className="assistant-composer" onSubmit={handleSubmit}>
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="assistant-input"
                disabled={!isConnected}
                aria-label="Message the LUXE assistant"
              />

              <Button
                type="submit"
                size="icon"
                className="assistant-send-button"
                disabled={!inputValue.trim() || !isConnected}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" aria-hidden />
              </Button>
            </form>
          </footer>
        </section>
      )}
    </>
  )
}

type ProductSuggestionProps = {
  product: ChatProduct
}

function ProductSuggestion({ product }: ProductSuggestionProps) {
  const primaryImage = product.images?.[0] ?? "/placeholder.svg"
  const metaParts = [
    typeof product.brand === "string" && product.brand.trim() ? product.brand.trim() : null,
    typeof product.category === "string" && product.category.trim() ? product.category.trim() : null,
    typeof product.rating === "number" && product.rating > 0 ? `★ ${product.rating.toFixed(1)}` : null,
  ].filter((value): value is string => Boolean(value))

  const metaText = metaParts.join(" • ")
  const stockClass = product.inStock ? "assistant-product-stock-available" : "assistant-product-stock-unavailable"

  return (
    <div className="assistant-product-card">
      <div className="assistant-product-thumb">
        <ImageWithFallback
          src={primaryImage}
          alt={product.title}
          className="assistant-product-thumb-image"
          loading="lazy"
          decoding="async"
          sizes="48px"
        />
      </div>
      <div className="assistant-product-card-body">
        <Link href={product.url} className="assistant-product-title" prefetch={false}>
          {product.title}
        </Link>
        <div className="assistant-product-price">{formatPriceINR(product.price)}</div>
        {metaText && <div className="assistant-product-meta">{metaText}</div>}
        <div className={cn("assistant-product-stock", stockClass)}>{product.inStock ? "In stock" : "Out of stock"}</div>
      </div>
    </div>
  )
}
