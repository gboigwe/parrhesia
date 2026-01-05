import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORY_CONFIG = {
  crypto: {
    label: "Crypto & Web3",
    emoji: "¿",
    color: "bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800",
  },
  technology: {
    label: "Technology & AI",
    emoji: ">",
    color: "bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800",
  },
  policy: {
    label: "Policy & Governance",
    emoji: "–",
    color: "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800",
  },
  economics: {
    label: "Economics & Finance",
    emoji: "=È",
    color: "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800",
  },
  social: {
    label: "Social Issues",
    emoji: "<",
    color: "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800",
  },
  entertainment: {
    label: "Entertainment & Culture",
    emoji: "<­",
    color: "bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-200 border-pink-200 dark:border-pink-800",
  },
  dao: {
    label: "DAOs & Protocols",
    emoji: "<Û",
    color: "bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-200 border-violet-200 dark:border-violet-800",
  },
  custom: {
    label: "Custom",
    emoji: "(",
    color: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700",
  },
} as const;

type CategoryKey = keyof typeof CATEGORY_CONFIG;

interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "default" | "lg";
  showEmoji?: boolean;
  className?: string;
}

export function CategoryBadge({
  category,
  size = "default",
  showEmoji = true,
  className,
}: CategoryBadgeProps) {
  const categoryKey = category.toLowerCase() as CategoryKey;
  const config = CATEGORY_CONFIG[categoryKey] || CATEGORY_CONFIG.custom;

  return (
    <Badge
      size={size}
      className={cn(
        "inline-flex items-center gap-1.5 border",
        config.color,
        className
      )}
    >
      {showEmoji && <span>{config.emoji}</span>}
      <span>{config.label}</span>
    </Badge>
  );
}

// Export category options for forms
export const DEBATE_CATEGORIES = Object.entries(CATEGORY_CONFIG).map(
  ([key, value]) => ({
    id: key,
    label: value.label,
    emoji: value.emoji,
  })
);
