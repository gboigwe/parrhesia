import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

interface BadgeCollectionProps {
  badges: UserBadge[];
  lockedBadges?: UserBadge[];
  showLocked?: boolean;
  className?: string;
}

const rarityConfig = {
  common: {
    bg: "bg-gray-100 dark:bg-gray-800",
    border: "border-gray-300 dark:border-gray-600",
    text: "text-gray-700 dark:text-gray-300",
    badge: "bg-gray-500",
  },
  rare: {
    bg: "bg-blue-50 dark:bg-blue-950",
    border: "border-blue-300 dark:border-blue-700",
    text: "text-blue-700 dark:text-blue-300",
    badge: "bg-blue-500",
  },
  epic: {
    bg: "bg-purple-50 dark:bg-purple-950",
    border: "border-purple-300 dark:border-purple-700",
    text: "text-purple-700 dark:text-purple-300",
    badge: "bg-purple-500",
  },
  legendary: {
    bg: "bg-yellow-50 dark:bg-yellow-950",
    border: "border-yellow-300 dark:border-yellow-700",
    text: "text-yellow-700 dark:text-yellow-300",
    badge: "bg-yellow-500",
  },
};

export function BadgeCollection({
  badges,
  lockedBadges = [],
  showLocked = true,
  className,
}: BadgeCollectionProps) {
  const allBadges = [...badges, ...(showLocked ? lockedBadges : [])];

  return (
    <Card variant="elevated" className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Achievements</CardTitle>
          <Badge variant="outline">
            {badges.length} / {badges.length + lockedBadges.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {allBadges.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No badges earned yet. Start debating to unlock achievements!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allBadges.map((badge) => {
              const isLocked = lockedBadges.some((b) => b.id === badge.id);
              const config = rarityConfig[badge.rarity];

              return (
                <div
                  key={badge.id}
                  className={cn(
                    "relative p-4 rounded-lg border-2 transition-all",
                    config.bg,
                    config.border,
                    isLocked
                      ? "opacity-50 grayscale"
                      : "hover:shadow-lg hover:scale-105"
                  )}
                >
                  {/* Badge Icon */}
                  <div className="text-4xl text-center mb-2">
                    {isLocked ? "=" : badge.icon}
                  </div>

                  {/* Badge Name */}
                  <h4
                    className={cn(
                      "font-semibold text-sm text-center mb-1",
                      config.text
                    )}
                  >
                    {badge.name}
                  </h4>

                  {/* Badge Description */}
                  <p className="text-xs text-gray-600 dark:text-gray-400 text-center mb-2">
                    {badge.description}
                  </p>

                  {/* Rarity Badge */}
                  <div className="flex justify-center mb-2">
                    <Badge
                      className={cn(
                        "text-xs capitalize text-white",
                        config.badge
                      )}
                      size="sm"
                    >
                      {badge.rarity}
                    </Badge>
                  </div>

                  {/* Progress Bar (for locked badges) */}
                  {isLocked && badge.progress && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          Progress
                        </span>
                        <span className="font-semibold">
                          {badge.progress.current} / {badge.progress.required}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className={cn("h-1.5 rounded-full", config.badge)}
                          style={{
                            width: `${
                              (badge.progress.current /
                                badge.progress.required) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Earned Date (for unlocked badges) */}
                  {!isLocked && (
                    <div className="text-xs text-center text-gray-500 dark:text-gray-500 mt-2">
                      Earned {new Date(badge.earnedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
