import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(req: Request) {
  try {
    // Attempt to parse form data regardless of the header value; some runtimes normalize/omit content-type
    let form: FormData
    try {
      form = await req.formData()
    } catch {
      return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 })
    }

    const file = form.get("file")
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 })
    }

    const ext = file.name?.split(".").pop() || "bin"
    const name = `meals/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { url } = await put(name, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return NextResponse.json({ url })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 })
  }
}
