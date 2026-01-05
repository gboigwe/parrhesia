import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "default" | "lg" | "xl";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "default", ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const sizes = {
      sm: "h-8 w-8 text-xs",
      default: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg",
    };

    const displayFallback = imageError || !src;

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 font-semibold text-gray-600 dark:text-gray-300",
          sizes[size],
          className
        )}
        {...props}
      >
        {displayFallback ? (
          <span>{fallback || "?"}</span>
        ) : (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

const AvatarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { max?: number }
>(({ className, children, max, ...props }, ref) => {
  const childrenArray = React.Children.toArray(children);
  const displayChildren = max ? childrenArray.slice(0, max) : childrenArray;
  const remainingCount = max && childrenArray.length > max ? childrenArray.length - max : 0;

  return (
    <div
      ref={ref}
      className={cn("flex items-center -space-x-2", className)}
      {...props}
    >
      {displayChildren}
      {remainingCount > 0 && (
        <div className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-900 text-xs font-semibold text-gray-700 dark:text-gray-200">
          +{remainingCount}
        </div>
      )}
    </div>
  );
});

AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup };
