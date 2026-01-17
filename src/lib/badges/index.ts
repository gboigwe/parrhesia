/**
 * Badge System Barrel Exports
 */

export { BADGE_TYPES, BADGE_METADATA, BADGE_RARITY, RARITY_COLORS } from "./constants";
export { detectNewBadges, checkBadgeProgress } from "./detectBadges";
export { generateBadgeMetadata, getBadgeImageSVG } from "./metadataGenerator";
export {
  getBadgeRarityColor,
  sortBadgesByRarity,
  groupBadgesByRarity,
  calculateBadgeStats,
  isDebaterBadge,
  isVoterBadge,
  getRarestBadge,
} from "./utils";

export type { Badge, BadgeProgress, BadgeMetadata, UserBadgeStats, BadgeEarnEvent } from "./types";
