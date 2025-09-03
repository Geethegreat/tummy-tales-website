import { type NextRequest, NextResponse } from "next/server"
import { setAdminSession } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
  }
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    await setAdminSession()
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
}
