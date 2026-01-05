"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  userId: string;
  initialFollowing?: boolean;
  followerCount?: number;
  showCount?: boolean;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline";
  onFollowChange?: (isFollowing: boolean) => void;
  className?: string;
}

export function FollowButton({
  userId,
  initialFollowing = false,
  followerCount = 0,
  showCount = false,
  size = "default",
  variant = "default",
  onFollowChange,
  className,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFollowerCount, setCurrentFollowerCount] =
    useState(followerCount);
  const [isHovered, setIsHovered] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);

    try {
      const endpoint = isFollowing ? "/api/users/unfollow" : "/api/users/follow";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update follow status");
      }

      const newFollowingState = !isFollowing;
      setIsFollowing(newFollowingState);
      setCurrentFollowerCount((prev) =>
        newFollowingState ? prev + 1 : prev - 1
      );

      onFollowChange?.(newFollowingState);
    } catch (error) {
      console.error("Error updating follow status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return "...";
    if (isFollowing) {
      return isHovered ? "Unfollow" : "Following";
    }
    return "Follow";
  };

  const getButtonVariant = () => {
    if (variant === "outline") return "outline";
    if (isFollowing) return "outline";
    return "primary";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        onClick={handleFollow}
        variant={getButtonVariant()}
        size={size}
        isLoading={isLoading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "min-w-[100px] transition-all",
          isFollowing &&
            isHovered &&
            "border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
        )}
      >
        {getButtonText()}
      </Button>

      {showCount && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {currentFollowerCount.toLocaleString()}{" "}
          {currentFollowerCount === 1 ? "follower" : "followers"}
        </span>
      )}
    </div>
  );
}
