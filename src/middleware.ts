/**
 * Next.js Middleware
 * Security headers, rate limiting, and request handling
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_REQUESTS = parseInt(
  process.env.RATE_LIMIT_REQUESTS || "100",
  10
);
const RATE_LIMIT_WINDOW = parseInt(
  process.env.RATE_LIMIT_WINDOW || "60000",
  10
);

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";

  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (!rateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW / 1000)),
          },
        }
      );
    }
  }

  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.base.org https://*.coinbase.com https://*.anthropic.com;"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
