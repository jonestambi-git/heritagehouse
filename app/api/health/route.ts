import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";

export async function GET() {
  try {
    console.log("[HEALTH CHECK] Starting database connection test...");
    
    // Test MongoDB connection
    const startTime = Date.now();
    const conn = await connectDB();
    const connectionTime = Date.now() - startTime;
    
    console.log("[HEALTH CHECK] Database connected successfully");
    console.log("[HEALTH CHECK] Connection time:", connectionTime, "ms");
    
    return NextResponse.json({
      success: true,
      status: "healthy",
      database: {
        connected: true,
        connectionTime: `${connectionTime}ms`,
        name: conn.connection.name,
        host: conn.connection.host,
        port: conn.connection.port,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        mongodbUri: process.env.MONGODB_URI ? "✓ Set" : "✗ Not set",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[HEALTH CHECK] Database connection failed:", error);
    
    return NextResponse.json({
      success: false,
      status: "unhealthy",
      database: {
        connected: false,
        error: error instanceof Error ? error.message : String(error),
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        mongodbUri: process.env.MONGODB_URI ? "✓ Set" : "✗ Not set",
      },
      timestamp: new Date().toISOString(),
    }, { status: 503 });
  }
}
