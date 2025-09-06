"use client"

import type React from "react"
import Image from "next/image"
import { ChevronDown, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import MealCard, { type Meal } from "@/components/meal-card"

export default function HomePage() {
  const [menu, setMenu] = useState<Meal[]>([])
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    async function fetchMeals() {
      try {
        const res = await fetch("/api/meals")
        if (!res.ok) throw new Error(`Failed to fetch meals: ${res.status}`)
        const data = await res.json()
        setMenu(data)
      } catch (err) {
        console.error("Failed to load meals", err)
      }
    }
    fetchMeals()
  }, [])

  const router = useRouter()
  const onMenuClick = (e?: React.MouseEvent) => {
    e?.preventDefault()
    document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" })
    setNavOpen(false)
  }
  const onHomeClick = (e?: React.MouseEvent) => {
    e?.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
    setNavOpen(false)
  }

  return (
    <div id="top" className="space-y-0">


      {/* Hero Section */}
      <section className="relative isolate text-white w-screen min-h-[100svh] left-1/2 right-1/2 -mx-[50vw]">
        <Image
          src="/images/hero-latest.png"
          alt="Tummy Tales hero"
          fill
          className="object-cover object-center pointer-events-none"
          priority
        />

        <div className="relative z-20 flex min-h-[100svh] w-full items-end justify-center px-6 pb-2 md:pb-4">
          <div className="flex flex-col items-center gap-3">
            <a
              href="#menu"
              onClick={onMenuClick}
              className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/95 hover:text-white"
            >
              VIEW MENU
            </a>
            <a
              href="#menu"
              onClick={onMenuClick}
              aria-label="Scroll to menu"
              className="group inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/90 transition-colors hover:bg-white/10"
            >
              <ChevronDown className="h-5 w-5 text-white group-hover:translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Menu Section */}
     <section
  id="menu"
  className="relative scroll-mt-28 -mt-px py-10 md:py-14"
>
      {/* Background image */}
      <Image
        src="/images/menu-bg.png"   // put your uploaded image here
        alt="Menu background"
        fill
        className="object-cover object-center -z-10"
      />

      <div className="mx-auto max-w-5xl px-2 sm:px-4 relative z-10">
        <header className="mb-6 sm:mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-emerald-900 md:text-3xl">
            Our Menu
          </h2>
          <p className="text-sm text-emerald-900/70">
            Freshly made, ready to enjoy.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {menu.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </div>
    </section>

    </div>
  )
}
