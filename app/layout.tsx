import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context" // <-- add this
import { AuthProvider } from "@/contexts/auth-context"
import { ChatProvider } from "@/contexts/chat-context"
import { Toaster } from "@/components/ui/toaster"
import { AppShell } from "@/components/app-shell"
import "./globals.css"

export const metadata: Metadata = {
  title: "LUXE - Premium E-Commerce",
  description: "Discover premium products with minimalistic elegance",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ChatProvider>
                  <AppShell>{children}</AppShell>
                  <Toaster />
                </ChatProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
