import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/hooks/use-cart"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Tummy Tales",
  description: "Healthy meals made easy for busy families",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className={`min-h-dvh bg-emerald-50 font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <CartProvider>
            <main className="w-full p-0 m-0">{children}</main>
          </CartProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
