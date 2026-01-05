/**
 * Voting validation functions
 */

export interface VotingEligibility {
  canVote: boolean;
  reason?: string;
}

/**
 * Check if user can vote on debate
 */
export function checkVotingEligibility(
  userId: string | undefined,
  creatorId: string,
  challengerId: string | null | undefined,
  debateStatus: string,
  hasVoted: boolean
): VotingEligibility {
  if (!userId) {
    return { canVote: false, reason: "You must be logged in to vote" };
  }

  if (debateStatus !== "voting") {
    return { canVote: false, reason: "Debate is not in voting phase" };
  }

  if (userId === creatorId || userId === challengerId) {
    return { canVote: false, reason: "Debate participants cannot vote" };
  }

  if (hasVoted) {
    return { canVote: false, reason: "You have already voted on this debate" };
  }

  return { canVote: true };
}

/**
 * Validate vote scores
 */
export function validateVoteScores(scores: {
  argumentQuality: number;
  rebuttalStrength: number;
  clarity: number;
  evidence: number;
  persuasiveness: number;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const [key, value] of Object.entries(scores)) {
    if (typeof value !== "number") {
      errors.push(`${key} must be a number`);
    } else if (value < 1 || value > 10) {
      errors.push(`${key} must be between 1 and 10`);
    } else if (!Number.isInteger(value)) {
      errors.push(`${key} must be a whole number`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if minimum votes threshold met
 */
export function hasMinimumVotes(totalVotes: number, minimumRequired: number = 3): boolean {
  return totalVotes >= minimumRequired;
}

/**
 * Calculate vote weight based on voter reputation
 */
export function calculateVoteWeight(voterReputation: number): number {
  // Base weight is 1.0
  // Higher reputation voters get slightly more weight (max 1.5x)
  const baseWeight = 1.0;
  const reputationBonus = Math.min(voterReputation / 200, 0.5); // Max 0.5 bonus at 100 reputation
  return baseWeight + reputationBonus;
}
