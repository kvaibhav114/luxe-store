"use client"
import { Button } from "@/components/ui/button"
import { User, Menu, Search, Heart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { CartDrawer } from "@/components/cart-drawer"
import { AuthModal } from "@/components/auth-modal"
import { UserMenu } from "@/components/user-menu"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export function Header() {
  const { getTotalItems } = useCart()
  const { isAuthenticated } = useAuth()

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="/">
                <h1 className="text-2xl font-bold text-foreground cursor-pointer">LUXE</h1>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/shop/categories" className="text-foreground hover:text-primary text-sm">
                Categories
              </Link>
              <Link href="/recommendations" className="text-foreground hover:text-primary text-sm">
                🤖 Recommendations
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/account/wishlist">
              <Button variant="ghost" size="icon" aria-label="Open wishlist">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <CartDrawer />

            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <AuthModal>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </AuthModal>
            )}

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
