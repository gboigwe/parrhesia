/**
 * Sign Out Endpoint
 * Destroys user session
 */

import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({
      success: true,
      message: "Signed out successfully",
    });
  } catch (error) {
    console.error("Sign out error:", error);

    return NextResponse.json(
      { error: "Failed to sign out" },
      { status: 500 }
    );
  }
}
