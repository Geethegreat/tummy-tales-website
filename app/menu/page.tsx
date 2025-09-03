"use client"

import useSWR from "swr"
import MealCard, { type Meal } from "@/components/meal-card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function MenuPage() {
  const { data, error, isLoading } = useSWR<Meal[]>("/api/meals", fetcher)

  return (
    <section className="space-y-6">
      <header className="text-center">
        <h1 className="text-balance text-3xl font-bold text-emerald-700">Our Family-Friendly Menu</h1>
        <p className="text-zinc-600">Bright, tasty meals made with care.</p>
      </header>

      {isLoading && <p>Loading menu…</p>}
      {error && <p className="text-red-600">Failed to load menu.</p>}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(data || []).map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </section>
  )
}
