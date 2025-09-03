import { cookies } from "next/headers"
import crypto from "crypto"

const COOKIE = "admin_session"

function getSecret() {
  const secret = process.env.ADMIN_SECRET
  if (!secret) throw new Error("ADMIN_SECRET is not set.")
  return secret
}

export function sign(payload: object) {
  const secret = getSecret()
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url")
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url")
  return `${data}.${sig}`
}

export function verify(token: string | undefined) {
  if (!token) return null
  const secret = getSecret()
  const [data, sig] = token.split(".")
  const expect = crypto.createHmac("sha256", secret).update(data).digest("base64url")
  if (sig !== expect) return null
  try {
    return JSON.parse(Buffer.from(data, "base64url").toString())
  } catch {
    return null
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE)?.value
  return verify(token)
}

export async function setAdminSession() {
  const cookieStore = await cookies()
  const token = sign({ role: "admin", ts: Date.now() })
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE)
}
