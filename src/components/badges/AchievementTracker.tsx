"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { checkBadgeProgress } from "@/lib/badges/detectBadges";
import { BADGE_METADATA, BADGE_TYPES } from "@/lib/badges/constants";

interface AchievementTrackerProps {
  userStats: any;
  earnedBadges: Array<{ type: string }>;
}

export function AchievementTracker({
  userStats,
  earnedBadges,
}: AchievementTrackerProps) {
  const earnedBadgeTypes = new Set(earnedBadges.map((b) => b.type));

  const inProgressBadges = Object.values(BADGE_TYPES)
    .filter((badgeType) => !earnedBadgeTypes.has(badgeType))
    .map((badgeType) => {
      const progress = checkBadgeProgress(badgeType, userStats);
      return {
        type: badgeType,
        ...progress,
      };
    })
    .filter((badge) => badge.percentage > 0 && badge.percentage < 100)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  if (inProgressBadges.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievement Progress</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Badges you're close to unlocking
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inProgressBadges.map((badge) => {
            const metadata =
              BADGE_METADATA[badge.type as keyof typeof BADGE_METADATA];

            return (
              <div key={badge.type} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {metadata?.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {metadata?.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {metadata?.rarity}
                  </Badge>
                </div>

                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      {badge.current} / {badge.required}
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {badge.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${badge.percentage}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {badge.required - badge.current} more to unlock
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
