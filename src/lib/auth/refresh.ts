/**
 * Session Refresh Logic
 * Auto-refresh sessions before expiry
 */

const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

let refreshTimer: NodeJS.Timeout | null = null;

export function startSessionRefresh(
  refreshCallback: () => Promise<void>
): void {
  stopSessionRefresh();

  refreshTimer = setInterval(async () => {
    try {
      await refreshCallback();
    } catch (error) {
      console.error("Session refresh failed:", error);
    }
  }, REFRESH_INTERVAL);
}

export function stopSessionRefresh(): void {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

export function getSessionTimeRemaining(issuedAt: number): number {
  const expiresAt = issuedAt + SESSION_DURATION;
  const remaining = expiresAt - Date.now();
  return Math.max(0, remaining);
}

export function shouldRefreshSession(issuedAt: number): boolean {
  const remaining = getSessionTimeRemaining(issuedAt);
  return remaining < REFRESH_INTERVAL * 2; // Refresh when less than 30 min remaining
}
