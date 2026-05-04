import mongoose from "mongoose";
import { readFileSync } from "fs";
import { join } from "path";

// Load .env.local manually
const envPath = join(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const uri = envContent
  .split("\n")
  .find((line) => line.startsWith("MONGODB_URI="))
  ?.split("=")
  .slice(1)
  .join("=")
  .trim();

if (!uri) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

console.log("URI:", uri.replace(/:([^:@]+)@/, ":****@"));
console.log("Connecting...");

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log("✅ MongoDB connected successfully!");
  await mongoose.disconnect();
} catch (err) {
  console.error("❌ Connection failed:", err.message);
  process.exit(1);
}
