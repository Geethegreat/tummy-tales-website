// app/login/page.tsx
"use client"

import { useState } from "react"
import { useSearchParams,useRouter } from "next/navigation"



export default function UserLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const addMealId = searchParams.get("addMealId")

  async function submit() {
    const res = await fetch("/api/user/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      // ✅ Redirect after login
      router.push(`${redirect}${addMealId ? `?addMealId=${addMealId}` : ""}`)
    } else {
      alert("Invalid email or password")
    }
  }

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: "url(/images/menu-bg.png)" }} // reuse cart bg
    >
      <div className="w-full max-w-sm space-y-6 rounded-lg bg-white/90 p-6 shadow-lg backdrop-blur-sm">
        <h1 className="text-center text-2xl font-bold text-emerald-700">
          User Login
        </h1>

        <label className="block text-sm font-medium text-gray-700">
          Email
          <input
            className="mt-1 w-full rounded border px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Password
          <input
            type="password"
            className="mt-1 w-full rounded border px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>

        <button
          onClick={submit}
          className="w-full rounded bg-emerald-600 px-4 py-2 font-semibold text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          Sign In
        </button>
      </div>
    </div>
  )
}
