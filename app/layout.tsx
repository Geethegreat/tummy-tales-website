import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/hooks/use-cart"
import { Suspense } from "react"
import FloatingNav from "@/components/floating-nav"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Tummy Tales",
  description: "Healthy meals made easy for busy families",
  generator: "v0.app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body
        className={`min-h-screen flex flex-col bg-emerald-50 font-sans ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <CartProvider>
            <Suspense
              fallback={
                <div
                  className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-50"
                  style={{ backgroundImage: "url('/images/menu-bg.png')" }}
                />
              }
            >
              <main className="flex-1 w-full p-0 m-0">{children}</main>
            </Suspense>

            <FloatingNav />
            <Footer />
          </CartProvider>


        <Analytics />
      </body>
    </html>
  )
}
