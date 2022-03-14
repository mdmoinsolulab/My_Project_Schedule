const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
  {
        productId: {
          type: String,
          required: true,
        },
        discounts: { type: Array } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", DiscountSchema);
