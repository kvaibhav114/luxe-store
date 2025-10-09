import { connectDB } from "../lib/mongoose"
import { User } from "../lib/models/User"

async function run() {
  await connectDB()
  console.log("[seed-users] Connected with Mongoose")

  const users = [
    { email: "john.doe@example.com", name: "John Doe", wishlist: [], cart: [] },
    { email: "jane.smith@example.com", name: "Jane Smith", wishlist: [], cart: [] },
  ]

  for (const u of users) {
    await User.updateOne({ email: u.email }, { $set: u }, { upsert: true })
  }

  console.log("[seed-users] Done")
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
