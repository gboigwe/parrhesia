/**
 * Session Management with Iron Session
 * Secure, encrypted session storage for authenticated users
 */

import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";
import type { Address } from "viem";

export interface SessionData {
  address: Address;
  chainId: number;
  issuedAt: number;
  expiresAt: number;
  nonce?: string;
}

/**
 * Session configuration
 */
const sessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long",
  cookieName: "parrhesia_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 24 * 60 * 60, // 24 hours
    path: "/",
  },
};

/**
 * Get current session
 */
export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

/**
 * Create new session for authenticated user
 */
export async function createSession(address: Address, chainId: number = 8453): Promise<void> {
  const session = await getSession();

  session.address = address;
  session.chainId = chainId;
  session.issuedAt = Date.now();
  session.expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  await session.save();
}

/**
 * Destroy current session
 */
export async function destroySession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}

/**
 * Check if session is valid and not expired
 */
export async function isSessionValid(): Promise<boolean> {
  try {
    const session = await getSession();

    if (!session.address || !session.expiresAt) {
      return false;
    }

    if (session.expiresAt < Date.now()) {
      await destroySession();
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Get authenticated user address from session
 */
export async function getAuthenticatedAddress(): Promise<Address | null> {
  try {
    const session = await getSession();

    if (!session.address || !await isSessionValid()) {
      return null;
    }

    return session.address;
  } catch {
    return null;
  }
}

/**
 * Refresh session expiration
 */
export async function refreshSession(): Promise<boolean> {
  try {
    const session = await getSession();

    if (!session.address) {
      return false;
    }

    session.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    await session.save();

    return true;
  } catch {
    return false;
  }
}
