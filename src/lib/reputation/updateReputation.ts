/**
 * Reputation Update Service
 * Handles onchain and database reputation updates
 */

import { REPUTATION_REWARDS } from "@/lib/voting/constants";

interface ReputationUpdateParams {
  userId: string;
  event: "debate_win" | "debate_loss" | "vote_cast" | "correct_vote" | "argument_submitted";
  metadata?: Record<string, any>;
}

interface ReputationUpdateResponse {
  success: boolean;
  newReputation: number;
  pointsEarned: number;
  transactionHash?: string;
}

/**
 * Update user reputation after a debate event
 */
export async function updateReputation(
  params: ReputationUpdateParams
): Promise<ReputationUpdateResponse> {
  const { userId, event, metadata } = params;

  // Determine points earned based on event type
  let pointsEarned = 0;
  switch (event) {
    case "debate_win":
      pointsEarned = REPUTATION_REWARDS.DEBATE_WIN;
      break;
    case "debate_loss":
      pointsEarned = REPUTATION_REWARDS.DEBATE_PARTICIPATION;
      break;
    case "vote_cast":
      pointsEarned = REPUTATION_REWARDS.VOTE_CAST;
      break;
    case "correct_vote":
      pointsEarned = REPUTATION_REWARDS.CORRECT_VOTE;
      break;
    case "argument_submitted":
      pointsEarned = REPUTATION_REWARDS.ARGUMENT_SUBMITTED;
      break;
    default:
      pointsEarned = 0;
  }

  // Call API endpoint to update reputation
  const response = await fetch("/api/reputation/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      event,
      pointsEarned,
      metadata,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update reputation");
  }

  return response.json();
}

/**
 * Batch update reputation for multiple users
 */
export async function batchUpdateReputation(
  updates: ReputationUpdateParams[]
): Promise<ReputationUpdateResponse[]> {
  const results: ReputationUpdateResponse[] = [];

  for (const update of updates) {
    try {
      const result = await updateReputation(update);
      results.push(result);
    } catch (error) {
      console.error(`Failed to update reputation for ${update.userId}:`, error);
      results.push({
        success: false,
        newReputation: 0,
        pointsEarned: 0,
      });
    }
  }

  return results;
}

/**
 * Calculate reputation after debate conclusion
 */
export async function updateDebateReputation(
  debateId: string,
  winnerId: string,
  loserId: string,
  voters: { userId: string; votedCorrectly: boolean }[]
): Promise<void> {
  const updates: ReputationUpdateParams[] = [];

  // Update winner reputation
  updates.push({
    userId: winnerId,
    event: "debate_win",
    metadata: { debateId },
  });

  // Update loser reputation
  updates.push({
    userId: loserId,
    event: "debate_loss",
    metadata: { debateId },
  });

  // Update voter reputations
  for (const voter of voters) {
    updates.push({
      userId: voter.userId,
      event: voter.votedCorrectly ? "correct_vote" : "vote_cast",
      metadata: { debateId },
    });
  }

  await batchUpdateReputation(updates);
}
