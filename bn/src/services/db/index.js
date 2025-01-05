import mongoose from "mongoose";

export const connectDB = async (DB_URI) => {
  try {
    await mongoose.connect(DB_URI);
    console.log("DB connected successfully");
  } catch (error) {
    console.log("ERROR CONNECTING TO DB...", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};
