import mongoose from "mongoose";

async function dbConection() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing. Add it to your backend environment variables.");
  }
  await mongoose.connect(mongoUri);
  console.log("MongoDB Atlas connected");
}

export default dbConection;
