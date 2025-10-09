import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header removed - rendered globally by AppShell */}

      <main className="container mx-auto px-4 py-16">
        <section className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Minimal. Premium. Yours.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed text-pretty">
            Curated essentials crafted with precision and purpose. Explore refined products designed to elevate the
            everyday.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <Link href="/shop">
              <Button size="lg">Explore Collection</Button>
            </Link>
            <Link
              href="/shop"
              className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground"
            >
              Shop all products
            </Link>
          </div>
        </section>

        {/* Minimal, premium image grid to enrich hero */}
        <section className="mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <figure className="overflow-hidden rounded-lg border border-border">
              <img
                src="/premium-wireless-headphones-black-on-white.jpg"
                alt="Premium wireless headphones in a minimal studio"
                className="w-full h-56 object-cover"
              />
            </figure>
            <figure className="overflow-hidden rounded-lg border border-border">
              <img
                src="/modern-smartwatch-minimal-product-photo.jpg"
                alt="Modern smartwatch with minimal face"
                className="w-full h-56 object-cover"
              />
            </figure>
            <figure className="overflow-hidden rounded-lg border border-border">
              <img
                src="/minimal-desk-lamp-studio-shot.jpg"
                alt="Minimal desk lamp studio shot"
                className="w-full h-56 object-cover"
              />
            </figure>
            <figure className="overflow-hidden rounded-lg border border-border">
              <img
                src="/carbon-fiber-wallet-macro.jpg"
                alt="Carbon fiber wallet detail"
                className="w-full h-56 object-cover"
              />
            </figure>
          </div>
        </section>

        <section className="mt-16 border-t border-border pt-8">
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <li className="border border-border rounded-lg p-5">
              <h3 className="font-semibold text-foreground">Timeless Design</h3>
              <p className="mt-1 text-sm text-muted-foreground">Neutral palette, refined materials, built to last.</p>
            </li>
            <li className="border border-border rounded-lg p-5">
              <h3 className="font-semibold text-foreground">Considered Quality</h3>
              <p className="mt-1 text-sm text-muted-foreground">Premium workmanship across every detail.</p>
            </li>
            <li className="border border-border rounded-lg p-5">
              <h3 className="font-semibold text-foreground">Effortless Experience</h3>
              <p className="mt-1 text-sm text-muted-foreground">Fast, simple, and intuitive from browse to checkout.</p>
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}
