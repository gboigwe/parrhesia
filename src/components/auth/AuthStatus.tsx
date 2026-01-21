"use client";

/**
 * Authentication Status Display
 * Shows current session info
 */

import { useAuth } from "@/contexts/AuthContext";

export function AuthStatus() {
  const { isAuthenticated, sessionAddress, walletAddress } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="text-sm text-muted-foreground">
        Not authenticated
      </div>
    );
  }

  const shortAddress = sessionAddress
    ? `${sessionAddress.slice(0, 6)}...${sessionAddress.slice(-4)}`
    : "Unknown";

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="h-2 w-2 rounded-full bg-green-500" />
      <span className="text-muted-foreground">
        Authenticated as {shortAddress}
      </span>
    </div>
  );
}
