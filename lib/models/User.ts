import mongoose, { Schema, type Document, type Model, Types } from "mongoose"

export interface IUser extends Document {
  _id : Types.ObjectId
  email: string
  name: string
  passwordHash: string // later replace with Azure AD if needed
  wishlist: mongoose.Types.ObjectId[] // array of product IDs
  cart: {
    productId: mongoose.Types.ObjectId
    quantity: number
  }[]
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    passwordHash: String, // placeholder for now
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    cart: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
)

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
