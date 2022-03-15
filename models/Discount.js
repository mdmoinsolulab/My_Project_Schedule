const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
  {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        discounts: { type: Array } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", DiscountSchema);