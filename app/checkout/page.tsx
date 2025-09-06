"use client"

import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const router = useRouter()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")

  async function placeOrder() {
  if (!address) return alert("Please enter your delivery address.");

  try {
    const payload = {
      customer_name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      instructions: notes.trim(),
      items: items.map((it) => ({
        productId: it.id,
        //name: it.name,
        quantity: it.quantity,
         total: it.price * it.quantity,
      })),
      total,
    };

    console.log("Checkout payload:", JSON.stringify(payload, null, 2))


    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to place order");

    localStorage.setItem(
      "lastOrder",
      JSON.stringify({ ...data, items: payload.items, total, instructions: notes })
    );

    clear();
    router.push(`/order-confirmation?id=${data.orderID || data.id}`);
  } catch (e: any) {
    alert(e.message || "Failed to place order");
  }
}

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-emerald-700">Checkout</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left: Form */}
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              Name
              <input
                className="mt-1 w-full rounded border px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block text-sm font-medium">
              Phone
              <input
                className="mt-1 w-full rounded border px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label className="block text-sm font-medium">
              Address
              <input
                className="mt-1 w-full rounded border px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="Enter delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
            <label className="block text-sm font-medium">
              Special Instructions
              <textarea
                className="mt-1 w-full rounded border px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
                rows={4}
                placeholder="e.g. make it spicy, no onions"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>

            <div className="rounded bg-emerald-50 p-3 text-emerald-900">
              <div className="font-semibold">Total: ${total.toFixed(2)}</div>
            </div>

            <button
              onClick={placeOrder}
              className="w-full rounded bg-amber-500 px-5 py-2.5 font-semibold text-black shadow hover:bg-amber-400"
            >
              Place Order
            </button>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-emerald-700">Order Summary</h2>
            <ul className="divide-y rounded-lg border bg-white">
              {items.map((it) => (
                <li key={it.id} className="flex justify-between p-3">
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-gray-600">
                      {it.quantity} × ${it.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="font-semibold text-emerald-700">
                    ${(it.price * it.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
