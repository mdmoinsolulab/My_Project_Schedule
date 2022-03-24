import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true, },
    img: { type: String, required: true },
    // categories: { type: Array }, recent
    categories: [String],
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
    discount: [String],
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
