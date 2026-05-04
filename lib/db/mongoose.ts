import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null;
  // eslint-disable-next-line no-var
  var _mongoosePromise: Promise<typeof mongoose> | null;
}

export async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  // Return cached connection if available
  if (global._mongooseConn) {
    return global._mongooseConn;
  }

  // Reuse pending connection promise
  if (!global._mongoosePromise) {
    console.log("🔌 [MongoDB] Connecting to database...");

    global._mongoosePromise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 15000, // 15 seconds
        connectTimeoutMS: 15000,
        socketTimeoutMS: 30000,
      })
      .then((conn) => {
        console.log("✅ [MongoDB] Connected successfully to:", conn.connection.name);
        return conn;
      })
      .catch((err) => {
        console.error("❌ [MongoDB] Connection failed:", err.message);
        global._mongoosePromise = null;
        throw err;
      });
  }

  try {
    global._mongooseConn = await global._mongoosePromise;
    return global._mongooseConn;
  } catch (error) {
    global._mongoosePromise = null;
    global._mongooseConn = null;
    throw error;
  }
}
