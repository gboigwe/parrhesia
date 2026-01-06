"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEBATE_TIMING } from "@/lib/debate/constants";
import type { DebateFiltersState } from "./DebateDiscovery";

const CATEGORIES = [
  { id: "all", label: "All", emoji: "📋" },
  { id: "politics", label: "Politics", emoji: "🏛️" },
  { id: "technology", label: "Technology", emoji: "💻" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "philosophy", label: "Philosophy", emoji: "🤔" },
  { id: "economics", label: "Economics", emoji: "💰" },
  { id: "social", label: "Social", emoji: "👥" },
  { id: "entertainment", label: "Entertainment", emoji: "🎬" },
  { id: "sports", label: "Sports", emoji: "⚽" },
];

const STATUSES = [
  { id: "all", label: "All" },
  { id: "pending", label: "Open" },
  { id: "active", label: "Active" },
  { id: "voting", label: "Voting" },
  { id: "completed", label: "Completed" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest First" },
  { id: "popular", label: "Most Popular" },
  { id: "stake", label: "Highest Stake" },
  { id: "ending", label: "Ending Soon" },
] as const;

interface DebateFiltersProps {
  filters: DebateFiltersState;
  onChange: (filters: Partial<DebateFiltersState>) => void;
}

export function DebateFilters({ filters, onChange }: DebateFiltersProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Debates
          </label>
          <Input
            type="search"
            placeholder="Search by title or description..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category.id}
                onClick={() => onChange({ category: category.id })}
                variant={filters.category === category.id ? "primary" : "outline"}
                size="sm"
                className="flex items-center gap-1.5"
              >
                <span>{category.emoji}</span>
                <span>{category.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((status) => (
              <Button
                key={status.id}
                onClick={() => onChange({ status: status.id })}
                variant={filters.status === status.id ? "primary" : "outline"}
                size="sm"
              >
                {status.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Stake Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Stake Range (USDC)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Min
              </label>
              <Input
                type="number"
                min={0}
                max={filters.maxStake}
                value={filters.minStake}
                onChange={(e) =>
                  onChange({ minStake: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Max
              </label>
              <Input
                type="number"
                min={filters.minStake}
                max={DEBATE_TIMING.MAX_STAKE_AMOUNT}
                value={filters.maxStake}
                onChange={(e) =>
                  onChange({ maxStake: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Sort By
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SORT_OPTIONS.map((option) => (
              <Button
                key={option.id}
                onClick={() => onChange({ sortBy: option.id })}
                variant={filters.sortBy === option.id ? "primary" : "outline"}
                size="sm"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {(filters.search ||
          filters.category !== "all" ||
          filters.status !== "all" ||
          filters.minStake > 0 ||
          filters.maxStake < DEBATE_TIMING.MAX_STAKE_AMOUNT) && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Filters
              </span>
              <Button
                onClick={() =>
                  onChange({
                    search: "",
                    category: "all",
                    status: "all",
                    minStake: 0,
                    maxStake: DEBATE_TIMING.MAX_STAKE_AMOUNT,
                  })
                }
                variant="ghost"
                size="sm"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="outline">Search: "{filters.search}"</Badge>
              )}
              {filters.category !== "all" && (
                <Badge variant="outline">
                  {CATEGORIES.find((c) => c.id === filters.category)?.label}
                </Badge>
              )}
              {filters.status !== "all" && (
                <Badge variant="outline">
                  {STATUSES.find((s) => s.id === filters.status)?.label}
                </Badge>
              )}
              {(filters.minStake > 0 ||
                filters.maxStake < DEBATE_TIMING.MAX_STAKE_AMOUNT) && (
                <Badge variant="outline">
                  ${filters.minStake} - ${filters.maxStake}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
