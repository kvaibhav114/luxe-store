import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  title: string
  price: number
  quantity: number
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId
  items: IOrderItem[]
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  total: number
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        title: String, // snapshot
        price: Number,
        quantity: Number,
      },
    ],
    status: { type: String, enum: ["pending", "paid", "shipped", "delivered", "cancelled"], default: "pending" },
    total: { type: Number, required: true },
  },
  { timestamps: true }
)

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
