/**
 * Badge Metadata Generator for IPFS
 * Generates NFT metadata for badge tokens
 */

import { BADGE_METADATA } from "./constants";

interface BadgeMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export function generateBadgeMetadata(
  badgeType: string,
  userId: string,
  earnedAt: Date
): BadgeMetadata {
  const metadata = BADGE_METADATA[badgeType as keyof typeof BADGE_METADATA];

  if (!metadata) {
    throw new Error(`Unknown badge type: ${badgeType}`);
  }

  const imageUrl = `ipfs://QmBadgeBaseHash/${badgeType}.png`;

  return {
    name: metadata.name,
    description: metadata.description,
    image: imageUrl,
    attributes: [
      {
        trait_type: "Badge Type",
        value: badgeType,
      },
      {
        trait_type: "Rarity",
        value: metadata.rarity,
      },
      {
        trait_type: "Category",
        value: getCategoryFromBadgeType(badgeType),
      },
      {
        trait_type: "Earned Date",
        value: earnedAt.toISOString(),
      },
      {
        trait_type: "Requirement",
        value: metadata.requirement,
      },
      {
        trait_type: "Owner",
        value: userId,
      },
    ],
  };
}

export function getBadgeImageSVG(badgeType: string): string {
  const metadata = BADGE_METADATA[badgeType as keyof typeof BADGE_METADATA];

  if (!metadata) return "";

  const colorMap: Record<string, string> = {
    gold: "#FFD700",
    orange: "#FF8C00",
    purple: "#9333EA",
    red: "#EF4444",
    yellow: "#FCD34D",
    blue: "#3B82F6",
    green: "#10B981",
    silver: "#C0C0C0",
    cyan: "#06B6D4",
    indigo: "#6366F1",
    pink: "#EC4899",
  };

  const color = colorMap[metadata.color] || "#6B7280";

  return `
    <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${badgeType}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustColor(color, -30)};stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="128" cy="128" r="120" fill="url(#grad${badgeType})" />
      <circle cx="128" cy="128" r="100" fill="white" fill-opacity="0.2" />
      <text x="128" y="150" font-size="80" text-anchor="middle" fill="white">
        ${getIconForBadge(metadata.icon)}
      </text>
      <text x="128" y="220" font-size="16" text-anchor="middle" fill="white" font-weight="bold">
        ${metadata.name.toUpperCase()}
      </text>
    </svg>
  `.trim();
}

function getCategoryFromBadgeType(badgeType: string): string {
  const debaterBadges = [
    "first_win",
    "win_streak_5",
    "win_streak_10",
    "giant_slayer",
    "perfect_score",
    "specialist",
    "versatile",
    "debate_veteran",
  ];

  const voterBadges = [
    "first_vote",
    "accurate_voter",
    "vote_streak",
    "super_voter",
    "oracle",
  ];

  if (debaterBadges.includes(badgeType)) return "Debater";
  if (voterBadges.includes(badgeType)) return "Voter";
  return "Special";
}

function getIconForBadge(iconName: string): string {
  const icons: Record<string, string> = {
    trophy: "🏆",
    flame: "🔥",
    zap: "⚡",
    target: "🎯",
    star: "⭐",
    award: "🏅",
    layers: "📚",
    shield: "🛡️",
    check: "✅",
    eye: "👁️",
    calendar: "📅",
    "thumbs-up": "👍",
    sparkles: "✨",
    crown: "👑",
    "trending-up": "📈",
    heart: "❤️",
  };
  return icons[iconName] || "🎖️";
}

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
