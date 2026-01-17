/**
 * Badge System Type Definitions
 */

export interface Badge {
  id: string;
  userId: string;
  type: string;
  tokenId: number;
  metadataUri: string;
  transactionHash: string;
  earnedAt: Date;
  createdAt: Date;
}

export interface BadgeProgress {
  badgeType: string;
  current: number;
  required: number;
  percentage: number;
  unlocked: boolean;
}

export interface BadgeMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface UserBadgeStats {
  totalBadges: number;
  debaterBadges: number;
  voterBadges: number;
  specialBadges: number;
  completionPercentage: number;
  rarest: string | null;
}

export interface BadgeEarnEvent {
  userId: string;
  badgeType: string;
  debateId?: string;
  eventType: string;
  earnedAt: Date;
}
