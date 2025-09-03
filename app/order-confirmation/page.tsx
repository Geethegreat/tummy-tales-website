import { Suspense } from "react"

function Content() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
  const id = params.get("id")
  return (
    <div className="mx-auto max-w-lg text-center">
      <h1 className="mb-2 text-3xl font-extrabold text-emerald-700">Thank you!</h1>
      <p className="text-pretty text-zinc-700">
        Your order has been placed successfully. We&apos;re preparing your meal with care.
      </p>
      {id && <p className="mt-4 text-sm text-zinc-600">Order ID: {id}</p>}
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Content />
    </Suspense>
  )
}
