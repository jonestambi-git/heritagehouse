import { MongoClient, Db } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | null;
  // eslint-disable-next-line no-var
  var _mongoDb: Db | null;
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  // Return cached database if available
  if (cachedDb) {
    return cachedDb;
  }

  try {
    // Create new client if not cached
    if (!cachedClient) {
      cachedClient = new MongoClient(MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        socketTimeoutMS: 30000,
      });

      console.log("🔌 [MongoDB] Connecting to database...");
      await cachedClient.connect();
      console.log("✅ [MongoDB] Connected successfully");
    }

    // Get database
    const dbName = new URL(MONGODB_URI).pathname.slice(1) || "church";
    cachedDb = cachedClient.db(dbName);

    return cachedDb;
  } catch (error) {
    console.error("❌ [MongoDB] Connection failed:", error);
    cachedClient = null;
    cachedDb = null;
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log("🔌 [MongoDB] Connection closed");
  }
}

export async function getDatabase(): Promise<Db> {
  if (!cachedDb) {
    return connectToDatabase();
  }
  return cachedDb;
}
