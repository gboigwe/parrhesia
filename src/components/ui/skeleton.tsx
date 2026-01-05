import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "text" | "circular" | "rectangular";
  animation?: "pulse" | "wave" | "none";
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "default", animation = "pulse", ...props }, ref) => {
    const variants = {
      default: "rounded-md",
      text: "rounded h-4",
      circular: "rounded-full",
      rectangular: "rounded-sm",
    };

    const animations = {
      pulse: "animate-pulse",
      wave: "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 bg-[length:200%_100%]",
      none: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-gray-200 dark:bg-gray-800",
          variants[variant],
          animations[animation],
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

// Predefined skeleton layouts
const SkeletonText = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        className={cn("w-full", i === lines - 1 && "w-4/5")}
      />
    ))}
  </div>
);

const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("space-y-3", className)}>
    <Skeleton className="h-48 w-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

const SkeletonAvatar = ({ size = "default" }: { size?: "sm" | "default" | "lg" | "xl" }) => {
  const sizes = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return <Skeleton variant="circular" className={sizes[size]} />;
};

const SkeletonButton = ({ className }: { className?: string }) => (
  <Skeleton className={cn("h-10 w-24 rounded-lg", className)} />
);

export { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar, SkeletonButton };
