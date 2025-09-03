"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

export default function CartPage() {
  const { items, update, remove, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="mb-2 text-2xl font-bold text-emerald-700">Your Cart</h1>
        <p className="mb-6 text-zinc-600">No items yet. Explore our menu!</p>
        <Link href="/#menu" className="rounded bg-amber-500 px-4 py-2 font-semibold text-black">
          View Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-emerald-700">Your Cart</h1>
      <ul className="divide-y rounded-lg border bg-white">
        {items.map((it) => (
          <li key={it.id} className="flex items-center gap-4 p-4">
            <div className="relative h-16 w-24 overflow-hidden rounded bg-emerald-50">
              <Image
                src={it.image_url || `/placeholder.svg?height=100&width=200&query=meal%20photo` || "/placeholder.svg"}
                alt={it.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{it.name}</div>
              <div className="text-sm text-zinc-600">${it.price.toFixed(2)}</div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={it.quantity}
                onChange={(e) => update(it.id, Math.max(1, Number(e.target.value)))}
                className="w-16 rounded border px-2 py-1"
              />
              <button onClick={() => remove(it.id)} className="rounded bg-red-500 px-3 py-1 text-white">
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Total</div>
        <div className="text-lg font-bold text-emerald-700">${total.toFixed(2)}</div>
      </div>

      <div className="text-right">
        <Link href="/checkout" className="rounded bg-amber-500 px-5 py-2 font-semibold text-black">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}
