import { NextResponse } from "next/server"
import { User } from "@/lib/models/User"
import "@/lib/db"

// ➝ Add to cart
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { productId, quantity } = await req.json()
    const user = await User.findByIdAndUpdate(
      params.id,
      { $push: { cart: { productId, quantity } } },
      { new: true }
    ).populate("cart.productId")
    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json({ error: "Error updating cart" }, { status: 500 })
  }
}

// ➝ Get cart
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await User.findById(params.id).populate("cart.productId")
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    return NextResponse.json(user.cart)
  } catch (err) {
    return NextResponse.json({ error: "Error fetching cart" }, { status: 500 })
  }
}
