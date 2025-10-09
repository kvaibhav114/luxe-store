import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/lib/models/User";

export async function POST(req: Request) {
  await connectDB();
  const { userId, productId } = await req.json();

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const index = user.wishlist.indexOf(productId);
  if (index >= 0) {
    user.wishlist.splice(index, 1); // remove if exists
  } else {
    user.wishlist.push(productId); // add if not exists
  }

  await user.save();
  return NextResponse.json({ wishlist: user.wishlist });
}
