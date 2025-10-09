import { NextResponse } from "next/server"
import { User } from "@/lib/models/User"
import "@/lib/db"

// ➝ Add to wishlist
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { productId } = await req.json()
    const user = await User.findByIdAndUpdate(
      params.id,
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).populate("wishlist")
    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json({ error: "Error updating wishlist" }, { status: 500 })
  }
}

// ➝ Get wishlist
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await User.findById(params.id).populate("wishlist")
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    return NextResponse.json(user.wishlist)
  } catch (err) {
    return NextResponse.json({ error: "Error fetching wishlist" }, { status: 500 })
  }
}
