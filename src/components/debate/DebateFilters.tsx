"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DebateStatus, DebateCategory } from "@/types/debate";

const STATUS_OPTIONS: { value: DebateStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Open" },
  { value: "active", label: "Active" },
  { value: "voting", label: "Voting" },
  { value: "completed", label: "Completed" },
];

const CATEGORY_OPTIONS: { value: DebateCategory | "all"; label: string; emoji: string }[] = [
  { value: "all", label: "All Categories", emoji: "(" },
  { value: "crypto", label: "Crypto & Web3", emoji: "¿" },
  { value: "tech", label: "Technology & AI", emoji: ">" },
  { value: "policy", label: "Policy & Governance", emoji: "–" },
  { value: "economics", label: "Economics", emoji: "=È" },
  { value: "social", label: "Social Issues", emoji: "<" },
  { value: "entertainment", label: "Entertainment", emoji: "<­" },
  { value: "dao", label: "DAOs", emoji: "<Û" },
];

interface DebateFiltersProps {
  onFilterChange: (filters: {
    status: DebateStatus | "all";
    category: DebateCategory | "all";
    sortBy: "recent" | "popular" | "prize";
  }) => void;
  className?: string;
}

export function DebateFilters({ onFilterChange, className }: DebateFiltersProps) {
  const [selectedStatus, setSelectedStatus] = useState<DebateStatus | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<DebateCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "prize">("recent");

  const handleStatusChange = (status: DebateStatus | "all") => {
    setSelectedStatus(status);
    onFilterChange({ status, category: selectedCategory, sortBy });
  };

  const handleCategoryChange = (category: DebateCategory | "all") => {
    setSelectedCategory(category);
    onFilterChange({ status: selectedStatus, category, sortBy });
  };

  const handleSortChange = (sort: "recent" | "popular" | "prize") => {
    setSortBy(sort);
    onFilterChange({ status: selectedStatus, category: selectedCategory, sortBy: sort });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              variant={selectedStatus === option.value ? "primary" : "outline"}
              size="sm"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((option) => (
            <Button
              key={option.value}
              onClick={() => handleCategoryChange(option.value)}
              variant={selectedCategory === option.value ? "primary" : "outline"}
              size="sm"
              className="flex items-center gap-1.5"
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sort By
        </label>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleSortChange("recent")}
            variant={sortBy === "recent" ? "primary" : "outline"}
            size="sm"
          >
            Most Recent
          </Button>
          <Button
            onClick={() => handleSortChange("popular")}
            variant={sortBy === "popular" ? "primary" : "outline"}
            size="sm"
          >
            Most Popular
          </Button>
          <Button
            onClick={() => handleSortChange("prize")}
            variant={sortBy === "prize" ? "primary" : "outline"}
            size="sm"
          >
            Highest Prize
          </Button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedStatus !== "all" || selectedCategory !== "all") && (
        <div className="flex items-center gap-2 pt-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
          {selectedStatus !== "all" && (
            <Badge variant="primary" size="sm">
              {STATUS_OPTIONS.find((o) => o.value === selectedStatus)?.label}
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge variant="secondary" size="sm">
              {CATEGORY_OPTIONS.find((o) => o.value === selectedCategory)?.label}
            </Badge>
          )}
          <Button
            onClick={() => {
              setSelectedStatus("all");
              setSelectedCategory("all");
              onFilterChange({ status: "all", category: "all", sortBy });
            }}
            variant="ghost"
            size="sm"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
