import express from "express";
const app = express();
import connect from "./db/connect.js";
import routes from "./routes.js";
import cors from "cors";

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT || 3000, () => {
  console.log("Backend server is running!");
  connect();
  routes(app);
});