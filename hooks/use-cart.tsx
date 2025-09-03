"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type CartItem = {
  id: number
  name: string
  price: number
  image_url?: string | null
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  add: (item: Omit<CartItem, "quantity">) => void
  remove: (id: number) => void
  update: (id: number, quantity: number) => void
  clear: () => void
  count: number
  total: number
}

const CartContext = createContext<CartContextType | null>(null)
const STORAGE_KEY = "tummy-tales-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const api = useMemo<CartContextType>(() => {
    const add: CartContextType["add"] = (item) => {
      setItems((prev) => {
        const found = prev.find((p) => p.id === item.id)
        if (found) {
          return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p))
        }
        return [...prev, { ...item, quantity: 1 }]
      })
    }
    const remove = (id: number) => setItems((prev) => prev.filter((p) => p.id !== id))
    const update = (id: number, quantity: number) =>
      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity } : p)))
    const clear = () => setItems([])
    const count = items.reduce((a, b) => a + b.quantity, 0)
    const total = items.reduce((a, b) => a + b.price * b.quantity, 0)
    return { items, add, remove, update, clear, count, total }
  }, [items])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
