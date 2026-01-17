"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BADGE_METADATA } from "@/lib/badges/constants";

interface BadgeUnlockNotificationProps {
  badgeType: string;
  onClose: () => void;
}

export function BadgeUnlockNotification({
  badgeType,
  onClose,
}: BadgeUnlockNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const metadata = BADGE_METADATA[badgeType as keyof typeof BADGE_METADATA];

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!metadata) return null;

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
        isVisible
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
    >
      <Card className="border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center animate-bounce">
              <span className="text-3xl">🎉</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
                Badge Unlocked!
              </p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {metadata.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {metadata.description}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                  {metadata.rarity}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
