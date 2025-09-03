"use client"

import type React from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation" // ensure Cart/Admin navigate reliably
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  // simple placeholder menu data for demo
  const menu = [
    { id: 1001, name: "Chicken Alfredo", desc: "Creamy sauce, broccoli, penne", price: 12.5 },
    { id: 1002, name: "Veggie Stir Fry", desc: "Seasonal veggies, jasmine rice", price: 10.0 },
    { id: 1003, name: "Beef Lasagna", desc: "Layers of pasta, ricotta, basil", price: 13.0 },
    { id: 1004, name: "Mac & Cheese", desc: "3-cheese blend, toasted crumbs", price: 9.5 },
    { id: 1005, name: "Turkey Meatballs", desc: "Tomato basil sauce, couscous", price: 11.5 },
    { id: 1006, name: "Chicken Tikka", desc: "Mild spice, butter sauce, rice", price: 12.0 },
  ]

  const smoothScrollTo = (selector: string) => {
    const el = document.querySelector(selector) as HTMLElement | null
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      history.replaceState(null, "", selector)
    } else {
      window.location.hash = selector.replace("#", "")
    }
  }

  const onMenuClick = (e?: React.MouseEvent) => {
    e?.preventDefault()
    smoothScrollTo("#menu")
  }

  const onHomeClick = (e?: React.MouseEvent) => {
    e?.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
    history.replaceState(null, "", "#top")
  }

  const router = useRouter() // router for Cart/Admin clicks
  const onCartClick = (e?: React.MouseEvent) => {
    e?.preventDefault()
    router.push("/cart")
  }
  const onAdminClick = (e?: React.MouseEvent) => {
    e?.preventDefault()
    router.push("/admin")
  }

  const { add } = useCart()

  return (
    <div id="top" className="space-y-0">
      <section
        className="
          relative isolate text-white
          w-screen min-h-[100svh]
          left-1/2 right-1/2 -mx-[50vw]
        "
      >
        <Image
          src="/images/hero-latest.png"
          alt="Tummy Tales hero"
          fill
          className="object-cover object-center pointer-events-none"
          priority
        />

        <nav
          role="navigation"
          className="absolute right-4 top-4 z-50 flex items-center gap-6 text-sm font-medium uppercase tracking-wide text-white/90 md:right-6 md:top-6 pointer-events-auto"
        >
          <a href="#top" onClick={onHomeClick} className="hover:text-white">
            Home
          </a>
          <a href="#menu" onClick={onMenuClick} className="hover:text-white">
            Menu
          </a>
          <a href="/cart" onClick={onCartClick} className="hover:text-white">
            Cart
          </a>
          <a href="/admin" onClick={onAdminClick} className="hover:text-white">
            Admin
          </a>
        </nav>

        <div className="relative z-20 flex min-h-[100svh] w-full items-end justify-center px-6 pb-2 md:pb-4">
          <div className="flex flex-col items-center gap-3">
            <a
              href="#menu"
              onClick={onMenuClick}
              className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/95 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              VIEW MENU
            </a>
            <a
              href="#menu"
              onClick={onMenuClick}
              aria-label="Scroll to menu"
              className="group inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/90 bg-white/0 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <ChevronDown className="h-5 w-5 text-white transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>

      <section id="menu" className="scroll-mt-28 -mt-px bg-[#92BE4F] py-10 md:py-14">
        <div className="mx-auto max-w-5xl px-2 sm:px-4">
          <header className="mb-6 sm:mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-900 md:text-3xl">Our Menu</h2>
            <p className="text-sm text-emerald-900/70">Freshly made, ready to enjoy.</p>
          </header>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {menu.map((item) => (
              <Card key={item.id} className="border-emerald-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base md:text-lg">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="shrink-0 rounded bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                      ${item.price.toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      className="bg-amber-500 text-black hover:bg-amber-400"
                      onClick={() => add({ id: item.id, name: item.name, price: item.price })}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
