import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
  try {
    const { password } = await req.json()
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin!234"
    const jwtSecret = process.env.JWT_SECRET || "dev-admin-secret"

    if (!password || password !== adminPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }
    const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "12h" })
    const res = NextResponse.json({ ok: true })
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 12,
    })
    return res
  } catch (err) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
