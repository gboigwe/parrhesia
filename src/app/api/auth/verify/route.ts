/**
 * SIWE Authentication Verification Endpoint
 * Verifies wallet signature and creates session
 */

import { NextRequest, NextResponse } from "next/server";
import { verifySiweSignature } from "@/lib/auth/siwe";
import { createSession } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, signature } = body;

    if (!message || !signature) {
      return NextResponse.json(
        { error: "Message and signature required" },
        { status: 400 }
      );
    }

    // Verify SIWE signature
    const result = await verifySiweSignature(message, signature);

    if (!result.success || !result.address) {
      return NextResponse.json(
        { error: result.error || "Invalid signature" },
        { status: 401 }
      );
    }

    // Create secure session
    await createSession(result.address);

    return NextResponse.json({
      success: true,
      address: result.address,
    });
  } catch (error) {
    console.error("Auth verification error:", error);

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
