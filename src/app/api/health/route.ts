/**
 * Health Check Endpoint
 * GET /api/health
 */

import { NextResponse } from "next/server";

export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    chain: process.env.NEXT_PUBLIC_CHAIN_ID,
    version: process.env.npm_package_version || "unknown",
    services: {
      api: "operational",
      database: await checkDatabase(),
      ai: await checkAI(),
    },
  };

  const isHealthy = Object.values(health.services).every(
    (status) => status === "operational"
  );

  return NextResponse.json(health, {
    status: isHealthy ? 200 : 503,
  });
}

async function checkDatabase(): Promise<string> {
  try {
    if (!process.env.DATABASE_URL) {
      return "not_configured";
    }
    return "operational";
  } catch (error) {
    console.error("Database health check failed:", error);
    return "degraded";
  }
}

async function checkAI(): Promise<string> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return "not_configured";
    }
    return "operational";
  } catch (error) {
    console.error("AI service health check failed:", error);
    return "degraded";
  }
}
