const mongoose = require("mongoose");

const conn_string = process.env.MONGO_CONN;

if (!conn_string) {
  throw new Error("Please define MONGO_CONN in your environment variables");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000,
      maxPoolSize: 5, // Reduce connection pool size for serverless
    };

    cached.promise = mongoose.connect(conn_string, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB Connected");
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

module.exports = connectDB;