// lib/mongoose.ts
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

let isConnected = false

export async function connectDB() {
  if (isConnected) return

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME,
    })
    isConnected = true
    console.log("[mongoose] Connected to MongoDB")
    return db
  } catch (err) {
    console.error("[mongoose] Connection error:", err)
    throw err
  }
}
