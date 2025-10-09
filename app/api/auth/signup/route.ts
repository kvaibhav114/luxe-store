import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { User } from "@/lib/models/User";
import { connectDB } from "@/lib/mongoose"; // your mongoose connector
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, name, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      name,
      passwordHash: hashed,
      wishlist: [],
      cart: [],
    });

    const token = signToken({ id: user._id.toString(), email: user.email });

    return NextResponse.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
