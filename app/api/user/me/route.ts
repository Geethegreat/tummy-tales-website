import { NextRequest, NextResponse } from "next/server"
import * as jwt from "jsonwebtoken"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("user_token")?.value
  if (!token) return NextResponse.json({ loggedIn: false })

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!)
    return NextResponse.json({ loggedIn: true, user: data })
  } catch {
    return NextResponse.json({ loggedIn: false })
  }
}
