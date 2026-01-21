/**
 * Authentication Logging
 * Track auth events for security monitoring
 */

interface AuthLog {
  timestamp: Date;
  event: string;
  address?: string;
  success: boolean;
  error?: string;
}

const AUTH_LOGS: AuthLog[] = [];
const MAX_LOGS = 1000;

export function logAuthEvent(
  event: string,
  success: boolean,
  address?: string,
  error?: string
): void {
  const log: AuthLog = {
    timestamp: new Date(),
    event,
    address,
    success,
    error,
  };

  AUTH_LOGS.push(log);

  if (AUTH_LOGS.length > MAX_LOGS) {
    AUTH_LOGS.shift();
  }

  console.log(`[AUTH] ${event}:`, {
    success,
    address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : undefined,
    error,
  });
}

export function getAuthLogs(limit: number = 100): AuthLog[] {
  return AUTH_LOGS.slice(-limit);
}
