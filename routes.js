import auth from "./routes/auth.js";
import users from "./routes/user.js";
import product from "./routes/product.js";
import cart from "./routes/cart.js";
import order from "./routes/order.js";
import stripe from "./routes/stripe.js";

const routes = (app) => {
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/products", product);
  app.use("/api/carts", cart);
  app.use("/api/orders", order);
  app.use("/api/checkout", stripe);
};

export default routes;
