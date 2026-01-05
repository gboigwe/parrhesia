"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  endsAt: Date;
  label?: string;
  variant?: "default" | "warning" | "danger";
  className?: string;
}

export function TimerDisplay({
  endsAt,
  label = "Time Remaining",
  variant = "default",
  className,
}: TimerDisplayProps) {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(endsAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeRemaining("Ended");
        setIsExpired(true);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endsAt]);

  const getVariantColor = () => {
    if (isExpired) {
      return "text-gray-600 dark:text-gray-400";
    }

    switch (variant) {
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "danger":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-blue-600 dark:text-blue-400";
    }
  };

  const getBadgeVariant = () => {
    if (isExpired) return "default" as const;

    switch (variant) {
      case "warning":
        return "warning" as const;
      case "danger":
        return "danger" as const;
      default:
        return "primary" as const;
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}:</span>
      <Badge variant={getBadgeVariant()} size="sm">
        <span className={cn("font-mono", getVariantColor())}>
          {timeRemaining}
        </span>
      </Badge>
    </div>
  );
}
