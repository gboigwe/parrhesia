"use client";

import { cn } from "@/lib/utils";

export type DebateCategory =
  | "politics"
  | "technology"
  | "science"
  | "philosophy"
  | "economics"
  | "social"
  | "entertainment"
  | "sports"
  | "other";

interface Category {
  id: DebateCategory;
  label: string;
  emoji: string;
  description: string;
  color: string;
}

const CATEGORIES: Category[] = [
  {
    id: "politics",
    label: "Politics",
    emoji: "<Û",
    description: "Government, policy, elections",
    color: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
  },
  {
    id: "technology",
    label: "Technology",
    emoji: "=»",
    description: "Tech, AI, software, hardware",
    color: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  },
  {
    id: "science",
    label: "Science",
    emoji: "=,",
    description: "Research, discoveries, theories",
    color:
      "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  },
  {
    id: "philosophy",
    label: "Philosophy",
    emoji: ">",
    description: "Ethics, existence, logic",
    color:
      "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300",
  },
  {
    id: "economics",
    label: "Economics",
    emoji: "=°",
    description: "Markets, finance, trade",
    color: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  },
  {
    id: "social",
    label: "Social Issues",
    emoji: "=e",
    description: "Society, culture, rights",
    color: "bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300",
  },
  {
    id: "entertainment",
    label: "Entertainment",
    emoji: "<¬",
    description: "Movies, music, pop culture",
    color:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "sports",
    label: "Sports",
    emoji: "½",
    description: "Athletics, games, competition",
    color:
      "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
  },
  {
    id: "other",
    label: "Other",
    emoji: "=Ì",
    description: "Miscellaneous topics",
    color: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
  },
];

interface CategorySelectorProps {
  value: DebateCategory;
  onChange: (category: DebateCategory) => void;
  className?: string;
}

export function CategorySelector({
  value,
  onChange,
  className,
}: CategorySelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Category
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={cn(
              "p-3 border-2 rounded-lg text-left transition-all hover:shadow-sm",
              value === category.id
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{category.emoji}</span>
              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                {category.label}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {category.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export { CATEGORIES };
