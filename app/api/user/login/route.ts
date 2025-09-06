// app/api/user/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log("➡️ Incoming login:", email);

    let backendRes: Response;
    try {
      backendRes = await fetch("/tt/v1/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch (err) {
      console.error("❌ Fetch to backend failed:", err);
      return NextResponse.json(
        { error: "Could not reach backend", details: (err as Error).message },
        { status: 502 }
      );
    }

    const backendText = await backendRes.text();
    let backendJson: any = null;
    try {
      backendJson = JSON.parse(backendText);
    } catch {
      // plain text fallback
    }

    console.log("⬅️ Backend status:", backendRes.status);
    console.log("⬅️ Backend body:", backendJson || backendText);

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Backend login failed", details: backendJson || backendText },
        { status: backendRes.status }
      );
    }

    // cookie parsing
const cookiesHeader = backendRes.headers.get("set-cookie");
if (!cookiesHeader) {
  return NextResponse.json({ error: "No session cookie from backend" }, { status: 500 });
}

const match = cookiesHeader.match(/_sessionid=([^;]+)/);
if (!match) {
  //console.error("❌ Could not extract _sessionid from:", cookiesHeader);
  return NextResponse.json({ error: "Backend session cookie missing" }, { status: 500 });
}
const sessionValue = match[1];


    // JWT signing
    if (!process.env.JWT_SECRET) {
      //console.error("❌ JWT_SECRET is not defined");
      return NextResponse.json({ error: "JWT secret not set" }, { status: 500 });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const res = NextResponse.json({ ok: true, user: backendJson });
    res.cookies.set("user_token", token, { httpOnly: true, secure: true, path: "/" });
    res.cookies.set("_sessionid", sessionValue, { httpOnly: true, secure: true, path: "/" });

    return res;
  } catch (err: any) {
    //console.error("❌ Top-level login error:", err);
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
