import mongoose from "mongoose";

export const connectDb = async () => {
  const uri = process.env.MONGO_URI;

  try {
    const conn = await mongoose.connect(uri);
    console.log(
      `Connected to MongoDB Database ${mongoose.connection.host}`.bgMagenta
        .white
    );
    return conn;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`.red);
    throw error;
  }
};
