"use client"

import Image from "next/image"
import { useCart } from "@/hooks/use-cart"

export type Meal = {
  id: number
  name: string
  description: string
  price: number
  image_url: string | null
}

export default function MealCard({ meal }: { meal: Meal }) {
  const { add } = useCart()
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-emerald-700/20 bg-white shadow-sm">
      <div className="relative h-40 w-full bg-emerald-50">
        <Image
          src={
            meal.image_url ||
            `/placeholder.svg?height=200&width=400&query=family-friendly%20meal%20photo` ||
            "/placeholder.svg"
          }
          alt={meal.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold text-zinc-900">{meal.name}</h3>
        <p className="line-clamp-2 text-sm text-zinc-600">{meal.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-semibold text-emerald-700">${meal.price.toFixed(2)}</span>
          <button
            onClick={() =>
              add({ id: meal.id, name: meal.name, price: meal.price, image_url: meal.image_url || undefined })
            }
            className="rounded bg-amber-500 px-3 py-1.5 text-sm font-medium text-black hover:bg-amber-400"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
