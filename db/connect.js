import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("DB Connection Successfull!");
  } catch (err) {
    console.log(err);
  }
};

export default connect;
