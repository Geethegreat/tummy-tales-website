"use client"

import { useState } from "react"
import MapPicker, { type LatLng } from "@/components/map-picker"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const router = useRouter()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [pos, setPos] = useState<LatLng | null>(null)
  const [notes, setNotes] = useState("")

  async function placeOrder() {
    if (!pos) return alert("Please pin your location on the map.")
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          phone,
          address,
          lat: pos.lat,
          lng: pos.lng,
          instructions: notes,
          items,
          total,
        }),
      })
      let data: any = null
      const ct = res.headers.get("content-type") || ""
      if (ct.includes("application/json")) {
        data = await res.json()
      } else {
        const text = await res.text()
        data = text ? { error: text } : null
      }
      if (!res.ok) throw new Error(data?.error || res.statusText || "Failed to place order")
      clear()
      router.push(`/order-confirmation?id=${data.id}`)
    } catch (e: any) {
      alert(e.message || "Failed to place order")
    }
  }

  if (items.length === 0) {
    return <p>Your cart is empty.</p>
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-emerald-700">Checkout</h1>
        <label className="block text-sm font-medium">
          Name
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium">
          Phone
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium">
          Address
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium">
          Special Instructions
          <textarea
            className="mt-1 w-full rounded border px-3 py-2"
            rows={4}
            placeholder="e.g. make it spicy, no onions"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <div className="rounded bg-emerald-100 p-3 text-emerald-900">
          <div className="font-semibold">Total: ${total.toFixed(2)}</div>
        </div>
        <button onClick={placeOrder} className="w-full rounded bg-amber-500 px-5 py-2.5 font-semibold text-black">
          Place Order
        </button>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium text-zinc-700">Tap the map to drop a pin at your location</div>
        <MapPicker value={pos || undefined} onChange={setPos} height={380} />
      </div>
    </div>
  )
}
