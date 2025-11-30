import mongoose from "mongoose";

// Cache the connection to reuse in serverless environments (Vercel)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If already connected, return cached connection
  if (cached.conn) {
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/taqyeem";

    cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
      console.log(`📚 Database: ${mongoose.connection.name}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", e);
    // In serverless, don't exit process - let Vercel handle it
    if (process.env.VERCEL !== "1" && !process.env.VERCEL_ENV) {
      process.exit(1);
    }
    throw e;
  }

  return cached.conn;
};

export default connectDB;
