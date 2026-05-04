import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

// Only validate if MongoDB is actually being used
if (!uri && process.env.NODE_ENV !== 'test') {
  console.warn('Warning: MONGODB_URI environment variable is not set. MongoDB features will not be available.');
}

// MongoDB connection options
const options = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxPoolSize: 10,
  minPoolSize: 1,
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  // Create a dummy promise that will reject if MongoDB is accessed
  clientPromise = Promise.reject(new Error('MongoDB URI not configured'));
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

/**
 * Get a database connection
 * @param dbName - Optional database name, defaults to the database specified in the connection string
 * @returns Promise<Db> - MongoDB database instance
 */
export async function getDatabase(dbName?: string): Promise<Db> {
  if (!uri) {
    throw new Error('MongoDB URI is not configured. Please set MONGODB_URI environment variable.');
  }
  
  try {
    const client = await clientPromise;
    return client.db(dbName);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.error('MongoDB URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Log URI with masked password
    throw error; // Throw the original error instead of a generic one
  }
}

/**
 * Get the MongoDB client
 * @returns Promise<MongoClient> - MongoDB client instance
 */
export async function getClient(): Promise<MongoClient> {
  try {
    return await clientPromise;
  } catch (error) {
    console.error('Failed to get MongoDB client:', error);
    throw new Error('Failed to get database client');
  }
}
