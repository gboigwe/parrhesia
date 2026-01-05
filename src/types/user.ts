/**
 * User-related type definitions for Parrhesia
 */

export interface User {
  id: string;
  basename: string;
  walletAddress: string;
  avatar?: string;
  bio?: string;
  email?: string;
  isVerified: boolean;
  reputation: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  totalDebates: number;
  wins: number;
  losses: number;
  draws: number;
  totalEarnings: number;
  totalStaked: number;
  votesGiven: number;
  rank?: number;
  percentile?: number;
  followersCount: number;
  followingCount: number;
}

export interface UserStats {
  totalDebates: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  totalEarnings: number;
  totalStaked: number;
  averageScore: number;
  votesGiven: number;
  reputation: number;
  rank?: number;
  percentile?: number;
  streak?: number;
  favoriteCategory?: string;
}

export interface UserSocial {
  twitter?: string;
  github?: string;
  website?: string;
  discord?: string;
}

export interface ReputationHistory {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt: Date;
  progress?: {
    current: number;
    required: number;
  };
}

export interface UserFollow {
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export type ReputationTier =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert"
  | "Master"
  | "Legendary";

export interface ReputationTierConfig {
  name: ReputationTier;
  minReputation: number;
  color: string;
  bg: string;
}
