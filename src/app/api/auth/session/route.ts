/**
 * Session Status Endpoint
 * Check current authentication status
 */

import { NextResponse } from "next/server";
import { getAuthenticatedAddress } from "@/lib/auth/session";

export async function GET() {
  try {
    const address = await getAuthenticatedAddress();

    if (!address) {
      return NextResponse.json({
        authenticated: false,
        address: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      address,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: "Failed to check session" },
      { status: 500 }
    );
  }
}
