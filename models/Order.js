const mongoose = require("mongoose");
const {Enum} = require('../helpers/enumtypes');
const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId, ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: Enum.PENDING },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);