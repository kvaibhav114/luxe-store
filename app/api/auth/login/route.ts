import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { User } from "@/lib/models/User";
import { connectDB } from "@/lib/mongoose";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: user._id.toString(), email: user.email });

    return NextResponse.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
