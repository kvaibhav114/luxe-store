import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET env variable");

interface JwtPayload {
  id: string;
  email: string;
}

export function signToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: "1h" };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
