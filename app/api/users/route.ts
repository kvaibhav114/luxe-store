import { NextResponse } from "next/server"
import { User } from "@/lib/models/User"
import "@/lib/db" // ensures mongoose connection

// Create a new user
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const user = await User.create(body)
    return NextResponse.json(user, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 })
  }
}

// Fetch all users (admin only ideally)
export async function GET() {
  try {
    const users = await User.find().lean()
    return NextResponse.json(users)
  } catch (err) {
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 })
  }
}
