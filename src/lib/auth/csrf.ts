/**
 * CSRF Protection
 * Generate and validate CSRF tokens
 */

import { randomBytes } from "crypto";

const CSRF_TOKENS = new Map<string, number>();
const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

export function generateCsrfToken(): string {
  const token = randomBytes(32).toString("hex");
  CSRF_TOKENS.set(token, Date.now());

  // Cleanup expired tokens
  cleanupExpiredTokens();

  return token;
}

export function validateCsrfToken(token: string): boolean {
  const timestamp = CSRF_TOKENS.get(token);

  if (!timestamp) return false;

  if (Date.now() - timestamp > TOKEN_EXPIRY) {
    CSRF_TOKENS.delete(token);
    return false;
  }

  return true;
}

function cleanupExpiredTokens(): void {
  const now = Date.now();

  for (const [token, timestamp] of CSRF_TOKENS.entries()) {
    if (now - timestamp > TOKEN_EXPIRY) {
      CSRF_TOKENS.delete(token);
    }
  }
}
