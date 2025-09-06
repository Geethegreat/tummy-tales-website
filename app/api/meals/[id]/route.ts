import { type NextRequest, NextResponse } from "next/server"

// reuse type
type Meal = {
  id: number
  name: string
  description: string
  price: number
  image_url: string | null
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  try {
    // Call ExpressCart backend
    const backendUrl =
      process.env.EXPRESSCART_URL || "/tt/v1/api"

    const res = await fetch(`${backendUrl}/products/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch meal: ${res.statusText}` },
        { status: res.status }
      )
    }

    const data = await res.json()

    // API returns { product: {...} }
    const meal: Meal | undefined = data?.product

    if (!meal) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 })
    }

    return NextResponse.json(meal)
  } catch (e: any) {
    console.error("Error fetching meal:", e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
