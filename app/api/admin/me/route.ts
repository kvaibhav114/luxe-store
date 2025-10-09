import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(req: Request) {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) return NextResponse.json({ error: "Server not configured" }, { status: 500 })
  const cookie = (req as any).cookies?.get?.("admin_token")?.value
  // In edge/runtime, use headers
  const cookieHeader = (req as any).headers?.get?.("cookie") as string | undefined
  const token = cookie || cookieHeader?.split(";").map((c) => c.trim()).find((c) => c.startsWith("admin_token="))?.split("=")[1]
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 })
  try {
    const payload = jwt.verify(token, jwtSecret) as any
    if (payload?.role !== "admin") throw new Error("Invalid role")
    return NextResponse.json({ authenticated: true })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
