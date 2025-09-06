"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

export default function ProductPage() {
  const { id } = useParams()
  const { add, items } = useCart()
  const [meal, setMeal] = useState<any>(null)
  const [comments, setComments] = useState<string[]>([])
  const [newComment, setNewComment] = useState("")
  const [rating, setRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false) // ✅ for button state

  useEffect(() => {
    async function fetchMeal() {
      try {
        const res = await fetch(`/api/meals/${id}`)
        if (!res.ok) throw new Error("Failed to fetch meal")
        const data = await res.json()
        setMeal(data)
        // Check if already in cart
        if (items.find((i) => i.id === data.id)) setAdded(true)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchMeal()
  }, [id, items])

  if (loading) {
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/menu-bg.png')" }}
      ></div>
    )
  }

  if (!meal) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-700">Meal not found.</p>
      </div>
    )
  }

  const handleAddToCart = () => {
    add({
      id: meal.id,
      name: meal.name,
      price: meal.price,
      image_url: meal.image_url || undefined,
    })
    setAdded(true)
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/images/menu-bg.png')" }}
    >
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Product info */}
        <div className="grid md:grid-cols-2 gap-6">
          <Image
            src={meal.image_url || "/fallback.png"}
            alt={meal.name || "Meal"}
            width={500}
            height={500}
            className="rounded-xl object-cover"
          />
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{meal.name}</h1>
              <p className="text-gray-700 mb-4">{meal.description}</p>
              <p className="text-green-600 font-bold text-xl mb-4">
                ${meal.price}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className={`w-full py-2 px-4 rounded-lg font-semibold text-white ${
                added ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-500 hover:bg-amber-400"
              }`}
            >
              {added ? "Added to Cart" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Rating */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">Rate this Product</h2>
          <div className="flex space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer ${
                  rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>

        {/* Comments */}
        <div>
          <h2 className="text-2xl font-semibold mb-3">Comments</h2>
          <div className="space-y-3 mb-4">
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet. Be the first!</p>
            ) : (
              comments.map((c, i) => (
                <div key={i} className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                  {c}
                </div>
              ))
            )}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#92BE4F]"
            />
            <button
              onClick={() => {
                if (newComment.trim()) {
                  setComments([...comments, newComment])
                  setNewComment("")
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 rounded-lg"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
