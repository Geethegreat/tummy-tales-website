// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    // 1️⃣ Forward login to ExpressCart
    const backendUrl = "/tt/v1/api/login";

    const loginRes = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await loginRes.json();

    if (!loginRes.ok || data.status !== "S") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 2️⃣ Extract ExpressCart _sessionid from Set-Cookie
    const setCookieHeader = loginRes.headers.get("set-cookie");
    const sessionMatch = setCookieHeader?.match(/_sessionid=([^;]+)/);
    const sessionValue = sessionMatch?.[1];

    if (!sessionValue) {
      return NextResponse.json({ error: "Failed to get ExpressCart session" }, { status: 500 });
    }

    // 3️⃣ Set both cookies in Next.js response
    const response = NextResponse.json({ success: true, user: data });

    // ✅ Local admin session (for Next.js check)
    response.cookies.set({
      name: process.env.ADMIN_SESSION_KEY || "admin_session",
      value: "authenticated",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    // ✅ ExpressCart session cookie
    response.cookies.set({
      name: "_sessionid",
      value: sessionValue,
      httpOnly: true,
      secure: false, // must be false for localhost
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (err: any) {
    console.error("Admin login failed:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
