/**
 * Authentication Middleware Helper
 * Verify requests are authenticated
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAddress } from "./session";

export async function requireAuth(request: NextRequest): Promise<{
  authenticated: boolean;
  address?: string;
  response?: NextResponse;
}> {
  const address = await getAuthenticatedAddress();

  if (!address) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      ),
    };
  }

  return {
    authenticated: true,
    address,
  };
}
