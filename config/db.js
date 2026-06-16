import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;

const connectDB = async () => {

  if (isConnected) {
    return;
  }

  try {

    await mongoose.connect(
      process.env.MONGO_DB
    );

    isConnected = true;

    console.log(
      "Database Connected"
    );

  } catch (error) {

    console.error(
      "MongoDB Connection Error:",
      error
    );

    throw error;
  }
};

export default connectDB;