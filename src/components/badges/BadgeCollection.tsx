"use client";

import { BadgeCard } from "./BadgeCard";
import { BADGE_TYPES } from "@/lib/badges/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Badge {
  type: string;
  earnedAt: Date;
}

interface BadgeCollectionProps {
  earnedBadges: Badge[];
  userStats?: any;
  showLocked?: boolean;
}

export function BadgeCollection({
  earnedBadges,
  userStats,
  showLocked = true,
}: BadgeCollectionProps) {
  const earnedBadgeTypes = new Set(earnedBadges.map((b) => b.type));

  const debaterBadges = [
    BADGE_TYPES.FIRST_WIN,
    BADGE_TYPES.WIN_STREAK_5,
    BADGE_TYPES.WIN_STREAK_10,
    BADGE_TYPES.GIANT_SLAYER,
    BADGE_TYPES.PERFECT_SCORE,
    BADGE_TYPES.SPECIALIST,
    BADGE_TYPES.VERSATILE,
    BADGE_TYPES.DEBATE_VETERAN,
  ];

  const voterBadges = [
    BADGE_TYPES.FIRST_VOTE,
    BADGE_TYPES.ACCURATE_VOTER,
    BADGE_TYPES.VOTE_STREAK,
    BADGE_TYPES.SUPER_VOTER,
    BADGE_TYPES.ORACLE,
  ];

  const specialBadges = [
    BADGE_TYPES.LEGENDARY_DEBATER,
    BADGE_TYPES.TOP_CONTRIBUTOR,
    BADGE_TYPES.COMMUNITY_CHAMPION,
  ];

  const allBadges = [...debaterBadges, ...voterBadges, ...specialBadges];

  const earnedCount = earnedBadges.length;
  const totalCount = allBadges.length;
  const completionPercentage = (earnedCount / totalCount) * 100;

  return (
    <div>
      {/* Progress Header */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Badge Collection
          </h3>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {earnedCount} / {totalCount}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          {completionPercentage.toFixed(0)}% of all badges earned
        </p>
      </div>

      {/* Badge Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
          <TabsTrigger value="debater">Debater ({debaterBadges.length})</TabsTrigger>
          <TabsTrigger value="voter">Voter ({voterBadges.length})</TabsTrigger>
          <TabsTrigger value="special">Special ({specialBadges.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allBadges.map((badgeType) => {
              const badge = earnedBadges.find((b) => b.type === badgeType);
              return (
                <BadgeCard
                  key={badgeType}
                  type={badgeType}
                  earnedAt={badge?.earnedAt}
                  locked={!badge && showLocked}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="debater" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {debaterBadges.map((badgeType) => {
              const badge = earnedBadges.find((b) => b.type === badgeType);
              return (
                <BadgeCard
                  key={badgeType}
                  type={badgeType}
                  earnedAt={badge?.earnedAt}
                  locked={!badge && showLocked}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="voter" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {voterBadges.map((badgeType) => {
              const badge = earnedBadges.find((b) => b.type === badgeType);
              return (
                <BadgeCard
                  key={badgeType}
                  type={badgeType}
                  earnedAt={badge?.earnedAt}
                  locked={!badge && showLocked}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="special" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialBadges.map((badgeType) => {
              const badge = earnedBadges.find((b) => b.type === badgeType);
              return (
                <BadgeCard
                  key={badgeType}
                  type={badgeType}
                  earnedAt={badge?.earnedAt}
                  locked={!badge && showLocked}
                />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
