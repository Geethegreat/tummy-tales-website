import { type NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function GET() {
  try {
    const sql = getSql()
    const rows = await sql`select id, name, description, price, image_url from meals order by created_at desc`
    if (rows.length === 0) {
      return NextResponse.json([
        {
          id: 1,
          name: "Veggie Pesto Pasta",
          description: "Fresh basil pesto, cherry tomatoes, parmesan.",
          price: 12.5,
          image_url: null,
        },
        {
          id: 2,
          name: "Chicken Fried Rice",
          description: "Wok-fried rice with peas, carrots, and eggs.",
          price: 11.0,
          image_url: null,
        },
        {
          id: 3,
          name: "Creamy Corn Risotto",
          description: "Comforting, kid-approved and cheesy.",
          price: 13.0,
          image_url: null,
        },
      ])
    }
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const name = body?.name as string | undefined
  const description = (body?.description as string | undefined) ?? ""
  const rawPrice = body?.price
  const price = typeof rawPrice === "string" ? Number(rawPrice) : rawPrice
  const image_url = (body?.image_url as string | null) ?? null

  if (!name || typeof price !== "number" || Number.isNaN(price)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const sql = getSql()
    const rows =
      await sql`insert into meals (name, description, price, image_url) values (${name}, ${description}, ${price}, ${image_url}) returning id, name, description, price, image_url`
    return NextResponse.json(rows[0])
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create meal" }, { status: 500 })
  }
}
