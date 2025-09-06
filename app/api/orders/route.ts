// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // 1️⃣ Check admin cookie
  const adminCookie = req.cookies.get(process.env.ADMIN_SESSION_KEY || "admin_session");
  if (!adminCookie?.value || adminCookie.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized (admin)" }, { status: 401 });
  }

  // 2️⃣ Get ExpressCart session cookie
  const expressCartSession = req.cookies.get("_sessionid")?.value;
  if (!expressCartSession) {
    return NextResponse.json({ error: "Unauthorized (missing ExpressCart session)" }, { status: 401 });
  }

  try {
    const ordersRes = await fetch("/tt/v1/api/orders", {
      headers: {
        "Content-Type": "application/json",
        Cookie: `_sessionid=${expressCartSession}`,
      },
      cache: "no-store",
    });

    if (!ordersRes.ok) {
      const text = await ordersRes.text(); // get error text
      console.error("ExpressCart returned error:", text);
      return NextResponse.json({ error: "Failed to fetch orders from ExpressCart" }, { status: 500 });
    }

    const data = await ordersRes.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("GET /api/orders failed:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
