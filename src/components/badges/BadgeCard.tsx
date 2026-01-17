"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BADGE_METADATA, RARITY_COLORS } from "@/lib/badges/constants";

interface BadgeCardProps {
  type: string;
  earnedAt?: Date;
  locked?: boolean;
  progress?: number;
  showProgress?: boolean;
}

export function BadgeCard({
  type,
  earnedAt,
  locked = false,
  progress = 0,
  showProgress = false,
}: BadgeCardProps) {
  const metadata = BADGE_METADATA[type as keyof typeof BADGE_METADATA];

  if (!metadata) return null;

  const rarityColor = RARITY_COLORS[metadata.rarity as keyof typeof RARITY_COLORS];

  const getBorderColor = () => {
    if (locked) return "border-gray-300 dark:border-gray-700";
    switch (rarityColor) {
      case "gold":
        return "border-yellow-500";
      case "purple":
        return "border-purple-500";
      case "blue":
        return "border-blue-500";
      case "green":
        return "border-green-500";
      default:
        return "border-gray-400";
    }
  };

  const getBackgroundColor = () => {
    if (locked) return "bg-gray-100 dark:bg-gray-800";
    switch (rarityColor) {
      case "gold":
        return "bg-yellow-50 dark:bg-yellow-900/20";
      case "purple":
        return "bg-purple-50 dark:bg-purple-900/20";
      case "blue":
        return "bg-blue-50 dark:bg-blue-900/20";
      case "green":
        return "bg-green-50 dark:bg-green-900/20";
      default:
        return "bg-gray-50 dark:bg-gray-900/20";
    }
  };

  return (
    <Card className={`border-2 ${getBorderColor()} ${locked ? "opacity-60" : ""}`}>
      <CardContent className="p-4">
        <div className={`${getBackgroundColor()} rounded-lg p-6 mb-3 flex items-center justify-center`}>
          <div className={`w-16 h-16 rounded-full ${locked ? "bg-gray-300 dark:bg-gray-600" : "bg-white dark:bg-gray-900"} flex items-center justify-center`}>
            <span className="text-3xl">{locked ? "🔒" : getIcon(metadata.icon)}</span>
          </div>
        </div>

        <div className="text-center">
          <h3 className={`font-bold text-lg mb-1 ${locked ? "text-gray-500" : "text-gray-900 dark:text-white"}`}>
            {metadata.name}
          </h3>

          <Badge variant="outline" className={`text-xs mb-2 ${locked ? "border-gray-400" : ""}`}>
            {metadata.rarity}
          </Badge>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {metadata.description}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-500">
            {metadata.requirement}
          </p>

          {earnedAt && !locked && (
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
              Earned {new Date(earnedAt).toLocaleDateString()}
            </p>
          )}

          {showProgress && locked && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{progress.toFixed(0)}% complete</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getIcon(iconName: string): string {
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
