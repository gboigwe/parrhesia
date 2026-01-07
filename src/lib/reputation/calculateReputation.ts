/**
 * Reputation Calculation Formulas
 * Comprehensive reputation scoring for debaters and voters
 */

interface DebateRecord {
  wins: number;
  losses: number;
  totalDebates: number;
  averageScore: number;
  categoryDebates: Record<string, number>;
  consecutiveWins: number;
}

interface VoterRecord {
  totalVotes: number;
  correctVotes: number;
  participationRate: number;
  averageVoteQuality: number;
}

/**
 * Debater Reputation Formula
 * Components:
 * - Win Rate (25%): Percentage of debates won
 * - Average Vote Scores (30%): Average weighted scores received
 * - Participation (10%): Number of debates participated in
 * - Topic Complexity Bonus (10%): Bonus for complex topics
 * - Consistency Score (15%): Win streak and consistency
 * - Engagement (10%): Community interaction and vote quality
 */
export function calculateDebaterReputation(record: DebateRecord): number {
  // 1. Win Rate Component (25%)
  const winRate = record.totalDebates > 0 ? record.wins / record.totalDebates : 0;
  const winRateScore = winRate * 25;

  // 2. Average Vote Scores (30%)
  // Normalized to 0-30 scale (assuming scores are 0-10)
  const averageScoreComponent = (record.averageScore / 10) * 30;

  // 3. Participation Component (10%)
  // Logarithmic scale to reward participation without over-weighting
  const participationScore = Math.min(
    10,
    Math.log10(record.totalDebates + 1) * 5
  );

  // 4. Topic Complexity Bonus (10%)
  // Based on variety of categories debated
  const categoryCount = Object.keys(record.categoryDebates).length;
  const complexityBonus = Math.min(10, categoryCount * 2);

  // 5. Consistency Score (15%)
  // Rewards win streaks and penalizes inconsistency
  const streakBonus = Math.min(15, record.consecutiveWins * 3);
  const consistencyScore = streakBonus;

  // 6. Engagement Score (10%)
  // Based on recent activity (placeholder - can be enhanced)
  const engagementScore = record.totalDebates > 0 ?
    Math.min(10, (record.totalDebates / 10) * 10) : 0;

  const totalReputation =
    winRateScore +
    averageScoreComponent +
    participationScore +
    complexityBonus +
    consistencyScore +
    engagementScore;

  return Math.round(totalReputation * 10) / 10; // Round to 1 decimal
}

/**
 * Voter Reputation Formula
 * Components:
 * - Accuracy (40%): Percentage of correct predictions
 * - Participation (25%): Number of votes cast
 * - Vote Quality (20%): Quality of vote feedback
 * - Consistency (15%): Regular voting activity
 */
export function calculateVoterReputation(record: VoterRecord): number {
  // 1. Accuracy Component (40%)
  const accuracy = record.totalVotes > 0 ?
    record.correctVotes / record.totalVotes : 0;
  const accuracyScore = accuracy * 40;

  // 2. Participation Component (25%)
  // Logarithmic scale
  const participationScore = Math.min(
    25,
    Math.log10(record.totalVotes + 1) * 12.5
  );

  // 3. Vote Quality Component (20%)
  // Based on providing feedback and detailed scores
  const qualityScore = record.averageVoteQuality * 20;

  // 4. Consistency Component (15%)
  // Based on participation rate
  const consistencyScore = record.participationRate * 15;

  const totalReputation =
    accuracyScore +
    participationScore +
    qualityScore +
    consistencyScore;

  return Math.round(totalReputation * 10) / 10;
}

/**
 * Calculate win rate percentage
 */
export function calculateWinRate(wins: number, totalDebates: number): number {
  if (totalDebates === 0) return 0;
  return (wins / totalDebates) * 100;
}

/**
 * Calculate accuracy percentage for voters
 */
export function calculateAccuracy(
  correctVotes: number,
  totalVotes: number
): number {
  if (totalVotes === 0) return 0;
  return (correctVotes / totalVotes) * 100;
}

/**
 * Determine reputation tier
 */
export function getReputationTier(reputation: number): {
  tier: string;
  color: string;
  minScore: number;
  maxScore: number;
} {
  if (reputation >= 90) {
    return {
      tier: "Legendary",
      color: "text-purple-600 dark:text-purple-400",
      minScore: 90,
      maxScore: 100,
    };
  } else if (reputation >= 75) {
    return {
      tier: "Master",
      color: "text-blue-600 dark:text-blue-400",
      minScore: 75,
      maxScore: 89,
    };
  } else if (reputation >= 60) {
    return {
      tier: "Expert",
      color: "text-green-600 dark:text-green-400",
      minScore: 60,
      maxScore: 74,
    };
  } else if (reputation >= 40) {
    return {
      tier: "Intermediate",
      color: "text-yellow-600 dark:text-yellow-400",
      minScore: 40,
      maxScore: 59,
    };
  } else if (reputation >= 20) {
    return {
      tier: "Beginner",
      color: "text-orange-600 dark:text-orange-400",
      minScore: 20,
      maxScore: 39,
    };
  } else {
    return {
      tier: "Novice",
      color: "text-gray-600 dark:text-gray-400",
      minScore: 0,
      maxScore: 19,
    };
  }
}

/**
 * Calculate reputation change
 */
export function calculateReputationChange(
  oldReputation: number,
  newReputation: number
): { change: number; percentage: number; direction: "up" | "down" | "stable" } {
  const change = newReputation - oldReputation;
  const percentage =
    oldReputation > 0 ? (change / oldReputation) * 100 : 0;

  let direction: "up" | "down" | "stable" = "stable";
  if (change > 0) direction = "up";
  else if (change < 0) direction = "down";

  return {
    change: Math.round(change * 10) / 10,
    percentage: Math.round(percentage * 10) / 10,
    direction,
  };
}
