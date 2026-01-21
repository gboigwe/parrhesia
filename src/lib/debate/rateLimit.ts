/**
 * Join Rate Limiting
 * Prevent spam joins
 */

const JOIN_ATTEMPTS = new Map<string, number[]>();
const MAX_ATTEMPTS = 3;
const WINDOW_MS = 60000; // 1 minute

export function canAttemptJoin(userId: string): {
  allowed: boolean;
  remainingAttempts: number;
  resetTime?: number;
} {
  const now = Date.now();
  const attempts = JOIN_ATTEMPTS.get(userId) || [];

  const recentAttempts = attempts.filter((time) => now - time < WINDOW_MS);

  if (recentAttempts.length >= MAX_ATTEMPTS) {
    const oldestAttempt = Math.min(...recentAttempts);
    const resetTime = oldestAttempt + WINDOW_MS;

    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime,
    };
  }

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - recentAttempts.length,
  };
}

export function recordJoinAttempt(userId: string): void {
  const now = Date.now();
  const attempts = JOIN_ATTEMPTS.get(userId) || [];

  attempts.push(now);
  JOIN_ATTEMPTS.set(userId, attempts.filter((time) => now - time < WINDOW_MS));
}
