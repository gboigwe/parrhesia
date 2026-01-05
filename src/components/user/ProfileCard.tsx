"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Badge as BaseBadge } from "@coinbase/onchainkit/identity";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  userId: string;
  basename: string;
  avatar?: string;
  bio?: string;
  reputation: number;
  totalDebates: number;
  wins: number;
  losses: number;
  totalEarnings: number;
  isVerified?: boolean;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onEdit?: () => void;
  className?: string;
}

export function ProfileCard({
  userId,
  basename,
  avatar,
  bio,
  reputation,
  totalDebates,
  wins,
  losses,
  totalEarnings,
  isVerified = false,
  isOwnProfile = false,
  isFollowing = false,
  onFollow,
  onEdit,
  className,
}: ProfileCardProps) {
  const winRate = totalDebates > 0
    ? ((wins / totalDebates) * 100).toFixed(1)
    : "0.0";

  return (
    <Card variant="elevated" className={cn("", className)}>
      <CardContent className="p-0">
        {/* Cover/Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-lg" />

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex items-start gap-4 -mt-16 mb-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar
                src={avatar}
                alt={basename}
                fallback={basename[0].toUpperCase()}
                size="xl"
                className="ring-4 ring-white dark:ring-gray-800"
              />
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="ml-auto mt-16 flex gap-2">
              {isOwnProfile ? (
                <Button onClick={onEdit} variant="outline" size="sm">
                  Edit Profile
                </Button>
              ) : (
                <Button
                  onClick={onFollow}
                  variant={isFollowing ? "outline" : "primary"}
                  size="sm"
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              )}
            </div>
          </div>

          {/* Name & Bio */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {basename}
              </h2>
              {isVerified && (
                <>
                  <BaseBadge className="!bg-blue-600" />
                  <Badge variant="primary" size="sm">
                    Verified
                  </Badge>
                </>
              )}
            </div>
            {bio && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {bio}
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {reputation}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Reputation
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalDebates}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Debates
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {winRate}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Win Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                ${totalEarnings.toFixed(0)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Earned
              </div>
            </div>
          </div>

          {/* Win/Loss Record */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Wins:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {wins}
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Losses:</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {losses}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
