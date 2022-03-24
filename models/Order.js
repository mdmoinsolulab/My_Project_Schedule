import mongoose from "mongoose";
import Enum from "../helpers/enumtypes.js";
const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        productAmount: {
          type: Number,
          default: 0,
        },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: Enum.PENDING },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
