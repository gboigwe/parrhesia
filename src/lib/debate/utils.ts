/**
 * Debate utility functions
 */

import type { DebateStatus } from "@/types/debate";

/**
 * Get time remaining until a timestamp
 */
export function getTimeRemaining(timestamp: Date | number): string {
  const now = Date.now();
  const end = typeof timestamp === "number" ? timestamp : timestamp.getTime();
  const diff = end - now;

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Check if a debate is active
 */
export function isDebateActive(status: DebateStatus): boolean {
  return status === "active" || status === "voting";
}

/**
 * Check if voting is open
 */
export function isVotingOpen(status: DebateStatus, votingEndsAt?: Date | null): boolean {
  if (status !== "voting") return false;
  if (!votingEndsAt) return false;
  return new Date(votingEndsAt).getTime() > Date.now();
}

/**
 * Get debate status label
 */
export function getDebateStatusLabel(status: DebateStatus): string {
  const labels: Record<DebateStatus, string> = {
    pending: "Waiting for Challenger",
    active: "In Progress",
    voting: "Voting Open",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status];
}

/**
 * Calculate prize distribution
 */
export function calculatePrizeDistribution(
  totalPrizePool: number,
  platformFeePercent: number = 5
): {
  winnerPrize: number;
  platformFee: number;
} {
  const platformFee = totalPrizePool * (platformFeePercent / 100);
  const winnerPrize = totalPrizePool - platformFee;

  return {
    winnerPrize,
    platformFee,
  };
}

/**
 * Format USDC amount
 */
export function formatUSDC(amount: string | number): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Get debate progress percentage
 */
export function getDebateProgress(
  startTime?: Date | null,
  endTime?: Date | null
): number {
  if (!startTime || !endTime) return 0;

  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (now < start) return 0;
  if (now > end) return 100;

  const total = end - start;
  const elapsed = now - start;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

/**
 * Check if user can join debate as challenger
 */
export function canJoinDebate(
  status: DebateStatus,
  challengerId: string | null | undefined,
  userId: string,
  creatorId: string
): { canJoin: boolean; reason?: string } {
  if (status !== "pending") {
    return { canJoin: false, reason: "Debate is no longer accepting challengers" };
  }

  if (challengerId) {
    return { canJoin: false, reason: "Debate already has a challenger" };
  }

  if (userId === creatorId) {
    return { canJoin: false, reason: "Cannot challenge your own debate" };
  }

  return { canJoin: true };
}

/**
 * Get debate round label
 */
export function getRoundLabel(roundNumber: number, format: "timed" | "async"): string {
  if (format === "timed") {
    return `Live Round ${roundNumber}`;
  }
  return `Round ${roundNumber}`;
}

/**
 * Calculate debate duration
 */
export function calculateDebateDuration(
  startTime?: Date | null,
  endTime?: Date | null
): string {
  if (!startTime || !endTime) return "N/A";

  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const diff = end - start;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
