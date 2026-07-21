import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;