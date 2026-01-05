/**
 * Voting utility functions
 */

interface Vote {
  winnerId: string;
  totalScore: string;
  weight?: string;
}

/**
 * Determine debate winner from votes
 */
export function determineWinner(
  votes: Vote[],
  creatorId: string,
  challengerId: string
): { winnerId: string | null; isTie: boolean; creatorVotes: number; challengerVotes: number } {
  const creatorVotes = votes.filter((v) => v.winnerId === creatorId);
  const challengerVotes = votes.filter((v) => v.winnerId === challengerId);

  // Simple majority vote
  if (creatorVotes.length > challengerVotes.length) {
    return {
      winnerId: creatorId,
      isTie: false,
      creatorVotes: creatorVotes.length,
      challengerVotes: challengerVotes.length,
    };
  } else if (challengerVotes.length > creatorVotes.length) {
    return {
      winnerId: challengerId,
      isTie: false,
      creatorVotes: creatorVotes.length,
      challengerVotes: challengerVotes.length,
    };
  }

  // Tie - use average scores as tiebreaker
  const creatorAvgScore =
    creatorVotes.reduce((sum, v) => sum + parseFloat(v.totalScore), 0) /
    (creatorVotes.length || 1);
  const challengerAvgScore =
    challengerVotes.reduce((sum, v) => sum + parseFloat(v.totalScore), 0) /
    (challengerVotes.length || 1);

  if (creatorAvgScore > challengerAvgScore) {
    return {
      winnerId: creatorId,
      isTie: false,
      creatorVotes: creatorVotes.length,
      challengerVotes: challengerVotes.length,
    };
  } else if (challengerAvgScore > creatorAvgScore) {
    return {
      winnerId: challengerId,
      isTie: false,
      creatorVotes: creatorVotes.length,
      challengerVotes: challengerVotes.length,
    };
  }

  // True tie
  return {
    winnerId: null,
    isTie: true,
    creatorVotes: creatorVotes.length,
    challengerVotes: challengerVotes.length,
  };
}

/**
 * Calculate vote statistics
 */
export function calculateVoteStats(votes: Vote[], creatorId: string, challengerId: string) {
  const creatorVotes = votes.filter((v) => v.winnerId === creatorId);
  const challengerVotes = votes.filter((v) => v.winnerId === challengerId);

  const creatorAvgScore =
    creatorVotes.reduce((sum, v) => sum + parseFloat(v.totalScore), 0) /
    (creatorVotes.length || 1);
  const challengerAvgScore =
    challengerVotes.reduce((sum, v) => sum + parseFloat(v.totalScore), 0) /
    (challengerVotes.length || 1);

  const totalVotes = votes.length;
  const creatorPercentage = totalVotes > 0 ? (creatorVotes.length / totalVotes) * 100 : 0;
  const challengerPercentage = totalVotes > 0 ? (challengerVotes.length / totalVotes) * 100 : 0;

  return {
    totalVotes,
    creatorVotes: creatorVotes.length,
    challengerVotes: challengerVotes.length,
    creatorAvgScore,
    challengerAvgScore,
    creatorPercentage,
    challengerPercentage,
  };
}

/**
 * Check if voting period has ended
 */
export function hasVotingEnded(votingEndsAt: Date | null | undefined): boolean {
  if (!votingEndsAt) return false;
  return new Date() > new Date(votingEndsAt);
}

/**
 * Get time remaining for voting
 */
export function getVotingTimeRemaining(votingEndsAt: Date | null | undefined): string {
  if (!votingEndsAt) return "N/A";

  const now = new Date();
  const end = new Date(votingEndsAt);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Ended";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} remaining`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }

  return `${minutes}m remaining`;
}

/**
 * Calculate prize distribution
 */
export function calculatePrizeDistribution(
  prizePool: number,
  totalVotes: number,
  platformFeePercent: number = 5,
  voterRewardPercent: number = 10
): {
  winnerPrize: number;
  platformFee: number;
  voterRewardPool: number;
  perVoterReward: number;
} {
  const platformFee = (prizePool * platformFeePercent) / 100;
  const voterRewardPool = (prizePool * voterRewardPercent) / 100;
  const winnerPrize = prizePool - platformFee - voterRewardPool;
  const perVoterReward = totalVotes > 0 ? voterRewardPool / totalVotes : 0;

  return {
    winnerPrize,
    platformFee,
    voterRewardPool,
    perVoterReward,
  };
}
