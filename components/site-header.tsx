"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/cart", label: "Cart" },
  { href: "/admin/login", label: "Admin" },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const { count } = useCart()
  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-700/20 bg-emerald-600/95 backdrop-blur supports-[backdrop-filter]:bg-emerald-600/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-white">
        <Link href="/" className="font-bold text-lg tracking-wide">
          Tummy Tales
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn("rounded px-2 py-1 hover:bg-emerald-700/30", pathname === l.href && "bg-emerald-700/40")}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className="relative rounded bg-amber-500 px-3 py-1.5 font-medium text-black hover:bg-amber-400"
          >
            Cart
            {count > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
