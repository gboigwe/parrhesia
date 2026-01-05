import { DEBATE_CONFIG, DEBATE_CATEGORIES } from "@/lib/constants";

export interface DebateValidationError {
  field: string;
  message: string;
}

export interface DebateFormData {
  title: string;
  description: string;
  category: string;
  format: string;
  stakeAmount: number;
}

/**
 * Validate debate creation form data
 */
export function validateDebateForm(data: DebateFormData): DebateValidationError[] {
  const errors: DebateValidationError[] = [];

  // Title validation
  if (!data.title || data.title.trim().length === 0) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (data.title.length < 10) {
    errors.push({ field: "title", message: "Title must be at least 10 characters" });
  } else if (data.title.length > 200) {
    errors.push({ field: "title", message: "Title must not exceed 200 characters" });
  }

  // Description validation
  if (!data.description || data.description.trim().length === 0) {
    errors.push({ field: "description", message: "Description is required" });
  } else if (data.description.length < 50) {
    errors.push({ field: "description", message: "Description must be at least 50 characters" });
  } else if (data.description.length > 1000) {
    errors.push({ field: "description", message: "Description must not exceed 1000 characters" });
  }

  // Category validation
  const validCategories = DEBATE_CATEGORIES.map((c) => c.id);
  if (!data.category) {
    errors.push({ field: "category", message: "Category is required" });
  } else if (!validCategories.includes(data.category)) {
    errors.push({ field: "category", message: "Invalid category selected" });
  }

  // Format validation
  if (!data.format) {
    errors.push({ field: "format", message: "Format is required" });
  } else if (!["live", "async"].includes(data.format)) {
    errors.push({ field: "format", message: "Invalid format selected" });
  }

  // Stake amount validation
  if (data.stakeAmount === undefined || data.stakeAmount === null) {
    errors.push({ field: "stakeAmount", message: "Stake amount is required" });
  } else if (data.stakeAmount < DEBATE_CONFIG.MIN_STAKE_USDC) {
    errors.push({
      field: "stakeAmount",
      message: `Stake must be at least ${DEBATE_CONFIG.MIN_STAKE_USDC} USDC`,
    });
  } else if (data.stakeAmount > DEBATE_CONFIG.MAX_STAKE_USDC) {
    errors.push({
      field: "stakeAmount",
      message: `Stake must not exceed ${DEBATE_CONFIG.MAX_STAKE_USDC} USDC`,
    });
  } else if (!Number.isInteger(data.stakeAmount)) {
    errors.push({ field: "stakeAmount", message: "Stake amount must be a whole number" });
  }

  return errors;
}

/**
 * Check if user can join a debate
 */
export function canJoinDebate(
  debate: {
    status: string;
    creatorId: string;
    challengerId?: string | null;
  },
  userId: string | undefined
): boolean {
  if (!userId) return false;
  if (debate.status !== "pending") return false;
  if (debate.creatorId === userId) return false;
  if (debate.challengerId) return false;
  return true;
}

/**
 * Check if user can vote on a debate
 */
export function canVoteOnDebate(
  debate: {
    status: string;
    creatorId: string;
    challengerId?: string | null;
  },
  userId: string | undefined
): boolean {
  if (!userId) return false;
  if (debate.status !== "voting") return false;
  // Users cannot vote on their own debates
  if (debate.creatorId === userId || debate.challengerId === userId) return false;
  return true;
}

/**
 * Get debate status label
 */
export function getDebateStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Waiting for Opponent",
    active: "Debate Active",
    voting: "Voting Open",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
}

/**
 * Calculate prize pool
 */
export function calculatePrizePool(stakeAmount: number, hasBothParticipants: boolean): number {
  if (!hasBothParticipants) return stakeAmount;

  const totalStake = stakeAmount * 2;
  const platformFee = (totalStake * DEBATE_CONFIG.PLATFORM_FEE_PERCENT) / 100;
  const voterReward = (totalStake * DEBATE_CONFIG.VOTER_REWARD_PERCENT) / 100;

  return totalStake - platformFee - voterReward;
}

/**
 * Format debate time remaining
 */
export function getTimeRemaining(endTime: Date | null | undefined): string {
  if (!endTime) return "N/A";

  const now = new Date();
  const end = new Date(endTime);
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
