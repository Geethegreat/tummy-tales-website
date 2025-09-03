import { type NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const body = await req.json()
  const { name, description, price, image_url } = body
  const sql = getSql()
  try {
    const rows =
      await sql`update meals set name=${name}, description=${description}, price=${price}, image_url=${image_url} where id=${id} returning id, name, description, price, image_url`
    return NextResponse.json(rows[0])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const sql = getSql()
  try {
    await sql`delete from meals where id=${id}`
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
