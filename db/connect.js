import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connect = () => {
  return mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connection Successfull!"))
    .catch((err) => {
      console.log(err);
    });
};

export default connect;
