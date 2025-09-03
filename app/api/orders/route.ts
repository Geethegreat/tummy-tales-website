import { type NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function GET() {
  const sql = getSql()
  try {
    const rows =
      await sql`select id, customer_name, phone, address, lat, lng, instructions, items, total, created_at from orders order by created_at desc`
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

  const { customer_name, phone, address, lat, lng, instructions, items, total } = body
  if (!customer_name || !phone || !address || lat == null || lng == null || !items) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  const sql = getSql()
  try {
    const rows =
      await sql`insert into orders (customer_name, phone, address, lat, lng, instructions, items, total) values (${customer_name}, ${phone}, ${address}, ${lat}, ${lng}, ${instructions || ""}, ${JSON.stringify(
        items,
      )}, ${total}) returning id`
    return NextResponse.json({ id: rows[0].id })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 })
  }
}
