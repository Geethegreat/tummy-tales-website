import { type NextRequest, NextResponse } from "next/server"

type Meal = {
  id: number
  name: string
  description: string
  price: number
  image_url: string | null
}

export async function GET() {
  try {
    const res = await fetch("/tt/v1/api/products", {
      cache: "no-store", // ensure fresh data every time
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch meals: ${res.statusText}`)
    }

    const data = await res.json()
    const meals = Array.isArray(data.product) ? data.product : []

    return NextResponse.json(meals)
  } catch (e: any) {
    console.error("GET /api/meals failed:", e)
    return NextResponse.json(
      { error: e?.message || "Failed to fetch meals" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const name = body?.name as string | undefined
    const description = (body?.description as string | undefined) ?? ""
    const rawPrice = body?.price
    const price = typeof rawPrice === "string" ? Number(rawPrice) : rawPrice
    const image_url = (body?.image_url as string | null) ?? null

    if (!name || typeof price !== "number" || Number.isNaN(price)) {
      return NextResponse.json(
        { error: "Missing required fields: name, price" },
        { status: 400 }
      )
    }

    // --- Get ExpressCart session cookie from request ---
    const expressCartSession = req.cookies.get("_sessionid")?.value
    if (!expressCartSession) {
      return NextResponse.json(
        { error: "Unauthorized (missing ExpressCart session)" },
        { status: 401 }
      )
    }

    // --- Forward to ExpressCart API ---
    const res = await fetch("/tt/v1/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `_sessionid=${expressCartSession}`, // pass session for auth
      },
      body: JSON.stringify({ name, description, price, image_url, additionalInfo: null }),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    console.error("POST /api/meals failed:", e)
    return NextResponse.json(
      { error: e?.message || "Failed to create meal" },
      { status: 500 }
    )
  }
}
