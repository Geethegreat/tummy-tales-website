"use client"

import { useState } from "react"

// Helper function to read response once and try JSON parse
function parseBodyOnce(resp: Response) {
  return resp.text().then((text) => {
    try {
      const json = JSON.parse(text)
      return { json, text }
    } catch {
      return { json: null as any, text }
    }
  })
}

export default function AddMealForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState<number>(10)
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit() {
    try {
      setLoading(true)
      let image_url: string | null = null

      if (file) {
        const formData = new FormData()
        formData.append("file", file)

        const uploadResp = await fetch("/api/upload", { method: "POST", body: formData })

        if (uploadResp.ok) {
          const { json, text } = await parseBodyOnce(uploadResp)
          if (json?.url) {
            image_url = json.url as string
          } else {
            throw new Error(text || "Image upload failed")
          }
        } else {
          const { text } = await parseBodyOnce(uploadResp)
          console.warn("[v0] Image upload failed:", text)
        }
      }

      const resp = await fetch("/api/meals", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, price, description, image_url }),
      })

      if (!resp.ok) {
        const { json, text } = await parseBodyOnce(resp)
        const message = (json?.error as string) || text || "Failed to create meal"
        throw new Error(message)
      }

      // Reset form on success
      setName("")
      setPrice(10)
      setDescription("")
      setFile(null)
      onCreated()
    } catch (e: any) {
      alert(e?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-emerald-700">Add Meal</h2>

      <div className="space-y-3">
        <input
          placeholder="Meal name"
          className="w-full rounded border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Price"
          className="w-full rounded border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />

        <textarea
          placeholder="Description (optional)"
          className="w-full rounded border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={submit}
        disabled={loading || !name || !price}
        className="w-full rounded bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create Meal"}
      </button>
    </div>
  )
}
