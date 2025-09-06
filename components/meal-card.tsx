"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export type Meal = {
  id: number | string
  name: string
  description: string | null
  price: number | string
  image_url: string | null
}

export default function MealCard({ meal }: { meal: Meal }) {
  const { add, items } = useCart() // grab cart items
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)

  // --- Check if user is logged in ---
  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await fetch("/api/user/me")
        const data = await res.json()
        setLoggedIn(data.loggedIn)
      } catch {
        setLoggedIn(false)
      }
    }
    checkLogin()
  }, [])

  // --- Image src handling ---
  let imageSrc = "/placeholder.svg"
  if (meal.image_url) {
    if (meal.image_url.startsWith("http")) imageSrc = meal.image_url
    else if (meal.image_url.startsWith("/")) imageSrc = meal.image_url
    else imageSrc = `/images/${meal.image_url}`
  }

  const price = typeof meal.price === "number" ? meal.price : parseFloat(meal.price || "0")

  // --- Check if this meal is already in the cart ---
  const isAdded = items.some((i) => i.id === meal.id)

  const handleAddToCart = () => {
    if (loggedIn === false) {
      router.push(`/user/login?redirect=/cart&addMealId=${meal.id}`)
      return
    }
    if (!isAdded) add({ id: meal.id, name: meal.name, price, image_url: meal.image_url || undefined })
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-emerald-700/20 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/product/${meal.id}`} className="flex flex-col flex-1">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={imageSrc}
            alt={meal.name || "Meal image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-lg font-semibold text-zinc-900 leading-snug group-hover:underline">
            {meal.name}
          </h3>
          {meal.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-tight text-zinc-600">
              {meal.description}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="font-semibold text-emerald-700">${price.toFixed(2)}</span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className={`w-full rounded px-3 py-1.5 text-sm font-medium text-white ${
            isAdded ? "bg-green-600 hover:bg-green-700" : "bg-amber-500 hover:bg-amber-400 text-black"
          }`}
        >
          {isAdded ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}
