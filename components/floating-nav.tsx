"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu } from "lucide-react"

export default function FloatingNav() {
  const [navOpen, setNavOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const onHomeClick = (e?: React.MouseEvent) => {
    e?.preventDefault()
    setNavOpen(false)
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      router.push("/") // go to homepage
    }
  }

  const onMenuClick = (e?: React.MouseEvent) => {
    e?.preventDefault()
    setNavOpen(false)
    if (pathname === "/") {
      document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" })
    } else {
      router.push("/#menu") // go to homepage + menu section
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setNavOpen((p) => !p)}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 transition-colors"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {navOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg bg-[#92BE4F] shadow-lg flex flex-col text-white text-sm font-medium">
          <a
            href="/"
            onClick={onHomeClick}
            className="px-4 py-2 hover:bg-green-700 rounded-t-lg"
          >
            Home
          </a>
          <a
            href="/#menu"
            onClick={onMenuClick}
            className="px-4 py-2 hover:bg-green-700"
          >
            Menu
          </a>
          <a
            href="/cart"
            className="px-4 py-2 hover:bg-green-700"
          >
            Cart
          </a>
          <a
            href="/admin/login"
            className="px-4 py-2 hover:bg-green-700 rounded-b-lg"
          >
            Admin
          </a>
        </div>
      )}
    </div>
  )
}
