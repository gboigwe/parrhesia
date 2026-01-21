/**
 * Join Debate Analytics Tracking
 * Track join events for analytics
 */

export interface JoinAnalyticsEvent {
  debateId: string;
  userId: string;
  stakeAmount: number;
  transactionHash: string;
  timestamp: Date;
  chainId: number;
}

export async function trackJoinEvent(event: JoinAnalyticsEvent): Promise<void> {
  try {
    await fetch("/api/analytics/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error("Failed to track join event:", error);
  }
}

export async function trackJoinAttempt(
  debateId: string,
  userId: string
): Promise<void> {
  try {
    await fetch("/api/analytics/join-attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ debateId, userId, timestamp: new Date() }),
    });
  } catch (error) {
    console.error("Failed to track join attempt:", error);
  }
}
