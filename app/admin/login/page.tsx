"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  async function submit() {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) router.push("/admin")
    else alert("Invalid credentials")
  }

  return (
    <div className="mx-auto max-w-sm space-y-4">
      <h1 className="text-center text-2xl font-bold text-emerald-700">Admin Login</h1>
      <label className="block text-sm font-medium">
        Email
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input
          type="password"
          className="mt-1 w-full rounded border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button
        onClick={submit}
        className="w-full rounded bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
      >
        Sign In
      </button>
    </div>
  )
}
