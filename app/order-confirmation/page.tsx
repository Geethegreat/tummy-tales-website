"use client"

import { useEffect, useState } from "react"

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem("lastOrder")
    if (stored) setOrder(JSON.parse(stored))
  }, [])

  if (!order) return <p className="text-center mt-20">Loading order...</p>

  return (
    <div className="mx-auto max-w-lg text-center p-6">
      <h1 className="mb-2 text-3xl font-extrabold text-emerald-700">Thank you!</h1>
      <p className="text-pretty text-zinc-700">
        Your order has been placed successfully. We&apos;re preparing your meal with care.
      </p>

      {order.orderID && <p className="mt-4 text-sm text-zinc-600">Order ID: {order.orderID}</p>}

      <div className="mt-6 text-left">
        <h2 className="text-xl font-semibold text-emerald-700 mb-2">Order Summary</h2>
        <ul className="divide-y rounded-lg border bg-white">
          {order.items.map((it: any, idx: number) => (
            <li key={idx} className="flex justify-between p-3">
              <div>
                <div className="font-medium">{it.name || it.productId}</div>
                <div className="text-sm text-gray-600">
                  {it.quantity} × ${it.total?.toFixed(2) || it.price?.toFixed(2)}
                </div>
              </div>
              <div className="font-semibold text-emerald-700">
                ${(it.total || it.price * it.quantity).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 font-semibold text-emerald-700 text-right">Total: ${order.total.toFixed(2)}</p>

        {order.instructions && (
          <p className="mt-2 text-sm text-zinc-600">
            Special Instructions: {order.instructions}
          </p>
        )}
      </div>
    </div>
  )
}
