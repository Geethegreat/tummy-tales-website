// app/api/checkout/route.ts
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // grab session cookie from the incoming request (set during login)
    const cookieHeader = req.headers.get("cookie") || ""

    // forward to your backend checkout API
    const backendRes = await fetch(
      "http://192.168.1.5:3000/tt/v1/api/carts/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader || "",
        },
        body: JSON.stringify(body),
      }
    )

    const data = await backendRes.json()

    // Include the submitted items & totals so the frontend can display summary
    const order = {
      id: data.orderID,
      customer_name: body.customer_name,
      phone: body.phone,
      address: body.address,
      instructions: body.instructions,
      items: body.items,
      total: body.total,
    }

    return NextResponse.json({ status: "S", message: "Order created successfully", order }, { status: backendRes.status })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to checkout" },
      { status: 500 }
    )
  }
}
