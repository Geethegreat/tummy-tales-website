"use client"

import useSWR from "swr"
import dynamic from "next/dynamic"
import AddMealForm from "@/components/admin/add-meal-form"
import { RESTAURANT_LOCATION } from "@/lib/constants"
import { useMemo, useState } from "react"

// Lazy load OrdersMap (fix for "Map container already initialized")
const OrdersMap = dynamic(() => import("@/components/admin/orders-map"), { ssr: false })

// ---- Types ----
type Meal = {
  id: number
  name: string
  description: string
  price: number
  image_url: string | null
}

type Order = {
  id: number
  customer_name: string
  phone: string
  address: string
  lat: number
  lng: number
  instructions: string
  items: any[]
  total: number
  created_at: string
}

type OrdersAPIResponse = {
  status: string
  order: Order[]
}

// ---- Data fetcher ----
const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => r.json())

// ---- Helpers ----
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const la1 = (a.lat * Math.PI) / 180
  const la2 = (b.lat * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// ---- Component ----
export default function AdminDashboard() {
  const { data: meals, mutate: reloadMeals } = useSWR<Meal[]>("/api/meals", fetcher)
  const { data } = useSWR<OrdersAPIResponse>("/api/orders", fetcher)
  const [sort, setSort] = useState<"closest" | "newest">("closest")

  const mealsList = Array.isArray(meals) ? meals : []

  // Map API response properly
  const ordersList: Order[] =
    data?.order?.map((o) => ({
      id: o.id,
      customer_name: o.customer_name,
      phone: (o as any).mobile ?? o.phone,
      address: o.address ?? "",
      instructions: o.instructions ?? "",
      total: o.totalPrice ?? 0,
      created_at: o.created_at,
      lat: (o as any).lat ?? RESTAURANT_LOCATION.lat,
      lng: (o as any).lng ?? RESTAURANT_LOCATION.lng,
      items: (o as any).items ?? [],
    })) ?? []

  async function delMeal(id: number) {
    if (!confirm("Delete this meal?")) return
    await fetch(`/api/meals/${id}`, { method: "DELETE" })
    reloadMeals()
  }

  const sortedOrders = useMemo(() => {
    if (!ordersList.length) return []
    const list = [...ordersList]
    if (sort === "newest") {
      return list.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }
    return list.sort((a, b) => {
      const da = distanceKm(RESTAURANT_LOCATION, { lat: a.lat, lng: a.lng })
      const db = distanceKm(RESTAURANT_LOCATION, { lat: b.lat, lng: b.lng })
      return da - db
    })
  }, [ordersList, sort])

  const sortLabel =
    sort === "closest"
      ? "distance from restaurant (closest first)"
      : "creation time (newest first)"

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-12">
        <h1 className="text-3xl font-bold text-emerald-700">Admin Dashboard</h1>

        {/* ---- Meals Section ---- */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-emerald-700 border-b border-emerald-200 pb-2">
            Manage Meals
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <AddMealForm onCreated={() => reloadMeals()} />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-emerald-700">Current Meals</h3>
              <div className="rounded-lg border bg-white shadow-sm max-h-[400px] overflow-y-auto">
                {mealsList.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No meals yet</div>
                ) : (
                  <ul className="divide-y">
                    {mealsList.map((m) => (
                      <li key={m.id} className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{m.name}</div>
                          <div className="text-sm text-gray-600">{m.description}</div>
                          <div className="text-sm font-semibold text-emerald-600">
                            ${m.price.toFixed(2)}
                          </div>
                        </div>
                        <button
                          onClick={() => delMeal(m.id)}
                          className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ---- Orders Section ---- */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-emerald-700 border-b border-emerald-200 pb-2">
              View Orders
            </h2>
            <button
              onClick={() => console.log("Generate PDF logic here")}
              className="ml-4 rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              Get PDF
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-6 max-h-[500px] overflow-y-auto">
              <div className="text-sm text-gray-600">
                Showing {sortedOrders.length} orders, sorted by {sortLabel}
              </div>

              {sortedOrders.length === 0 ? (
                <div className="rounded-lg border bg-white p-8 text-center text-gray-500 shadow-sm">
                  No orders yet
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-emerald-100 text-emerald-900">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Order</th>
                        <th className="px-4 py-3 font-semibold">Customer</th>
                        <th className="px-4 py-3 font-semibold">Total</th>
                        <th className="px-4 py-3 font-semibold">Distance</th>
                        <th className="px-4 py-3 font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {sortedOrders.map((o) => {
                        const d = distanceKm(RESTAURANT_LOCATION, { lat: o.lat, lng: o.lng })
                        return (
                          <tr key={o.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">#{o.id}</td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900">{o.customer_name}</div>
                              <div className="text-xs text-gray-600">{o.phone}</div>
                              <div className="text-xs text-gray-600">{o.address}</div>
                            </td>
                            <td className="px-4 py-3 font-semibold text-emerald-600">
                              ${o.total.toFixed(2)}
                            </td>
                            <td className="px-4 py-3">{d.toFixed(2)} km</td>
                            <td className="px-4 py-3 text-gray-600">{o.instructions || "—"}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Orders Map */}
            <div className="sticky top-6 space-y-3 h-fit">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-emerald-700">
                  Sort Orders
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as "closest" | "newest")}
                    className="ml-2 rounded border px-2 py-1 text-sm"
                  >
                    <option value="newest">Newest</option>
                    <option value="closest">Closest to restaurant</option>
                  </select>
                </label>
              </div>

              <OrdersMap
                orders={ordersList.map((o) => ({ id: o.id, lat: o.lat, lng: o.lng }))}
                height="60vh"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
