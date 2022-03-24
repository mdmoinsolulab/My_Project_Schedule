import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
import auth from "./routes/auth.js";
import users from "./routes/user.js";
import product from "./routes/product.js";
import cart from "./routes/cart.js";
import order from "./routes/order.js";
import stripe from "./routes/stripe.js";
import cors from "cors";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/products", product);
app.use("/api/carts", cart);
app.use("/api/orders", order);
app.use("/api/checkout", stripe);

app.listen(process.env.PORT || 3000, () => {
  console.log("Backend server is running!");
});
