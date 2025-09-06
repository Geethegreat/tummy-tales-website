"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

export default function CartPage() {
  const { items, update, remove, total } = useCart()
if (items.length === 0) {
  return (
    <div
      className="flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-center p-6 text-center"
      style={{ backgroundImage: "url(/images/menu-bg.png)" }}
    >
      <h1 className="mb-2 text-2xl font-bold text-emerald-700 bg-white/80 px-4 py-2 rounded">
        Your Cart
      </h1>
      <p className="mb-6 text-zinc-800 bg-white/70 px-3 py-1 rounded">
        No items yet. Explore our menu!
      </p>
      <Link
        href="/#menu"
        className="rounded bg-amber-500 px-4 py-2 font-semibold text-black shadow"
      >
        View Menu
      </Link>
    </div>
  )
}


  return (
    <div
      className="min-h-screen w-full bg-cover bg-center p-6"
      style={{ backgroundImage: "url(/images/menu-bg.png)" }}
    >
      <div className="mx-auto max-w-3xl space-y-6 bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-emerald-700">Your Cart</h1>
        <ul className="divide-y rounded-lg border bg-white">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-24 overflow-hidden rounded bg-emerald-50">
                <Image
                  src={
                    it.image_url ||
                    `/placeholder.svg?height=100&width=200&query=meal%20photo`
                  }
                  alt={it.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="font-semibold">{it.name}</div>
                <div className="text-sm text-zinc-600">
                  ${it.price.toFixed(2)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Quantity Controls */}
                <div className="flex items-center border rounded overflow-hidden">
                  <button
                    onClick={() => update(it.id, Math.max(1, it.quantity - 1))}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-lg font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={it.quantity}
                    onChange={(e) =>
                      update(it.id, Math.max(1, Number(e.target.value)))
                    }
                    className="w-12 text-center border-x"
                  />
                  <button
                    onClick={() => update(it.id, it.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-lg font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => remove(it.id)}
                  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                >
                  Remove
                </button>
              </div>

            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Total</div>
          <div className="text-lg font-bold text-emerald-700">
            ${total.toFixed(2)}
          </div>
        </div>

        <div className="text-right">
          <Link
            href="/checkout"
            className="rounded bg-amber-500 px-5 py-2 font-semibold text-black shadow"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
