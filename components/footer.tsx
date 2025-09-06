"use client"

import { Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-emerald-700 text-white py-6 px-6 mt-0">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Links */}
        <div className="flex flex-col md:flex-row gap-4 text-sm font-medium">
          <a href="/about" className="hover:underline">
            About
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy
          </a>
        </div>

        {/* Instagram */}
        <div>
          <a
            href="https://www.instagram.com/tummytales.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-2 rounded-full hover:bg-emerald-600 transition"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="mt-4 text-center text-xs text-white/80">
        © 2025 Tummy Tales. All rights reserved.
      </div>
    </footer>
  )
}
