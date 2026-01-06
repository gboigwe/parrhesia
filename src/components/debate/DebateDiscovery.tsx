"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DebateList } from "./DebateList";
import { DebateFilters } from "./DebateFilters";
import { DebateSkeleton } from "./DebateSkeleton";
import { EmptyDebates } from "./EmptyDebates";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface DebateFiltersState {
  search: string;
  category: string;
  status: string;
  minStake: number;
  maxStake: number;
  sortBy: "newest" | "popular" | "stake" | "ending";
}

export function DebateDiscovery() {
  const [filters, setFilters] = useState<DebateFiltersState>({
    search: "",
    category: "all",
    status: "all",
    minStake: 0,
    maxStake: 1000,
    sortBy: "newest",
  });

  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["debates", filters, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: filters.search,
        category: filters.category,
        status: filters.status,
        minStake: filters.minStake.toString(),
        maxStake: filters.maxStake.toString(),
        sortBy: filters.sortBy,
      });

      const response = await fetch(`/api/debates?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch debates");
      }
      return response.json();
    },
  });

  const handleFilterChange = (newFilters: Partial<DebateFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const hasActiveFilters =
    filters.search ||
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.minStake > 0 ||
    filters.maxStake < 1000;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Discover Debates
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore ongoing debates or create your own
          </p>
        </div>
        <Link href="/debates/create">
          <Button variant="primary" size="lg">
            Create Debate
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <DebateFilters filters={filters} onChange={handleFilterChange} />

      {/* Results Count */}
      {data && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.pagination?.total > 0 ? (
              <>
                Showing {data.debates.length} of {data.pagination.total} debates
                {hasActiveFilters && " (filtered)"}
              </>
            ) : (
              "No debates found"
            )}
          </p>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={() =>
                  setFilters({
                    search: "",
                    category: "all",
                    status: "all",
                    minStake: 0,
                    maxStake: 1000,
                    sortBy: "newest",
                  })
                }
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear filters
              </button>
            )}
            <button
              onClick={() => refetch()}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              title="Refresh debates"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            {error instanceof Error ? error.message : "Failed to load debates"}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <DebateSkeleton count={6} />}

      {/* Empty State */}
      {!isLoading && data?.debates.length === 0 && (
        <EmptyDebates hasFilters={hasActiveFilters} />
      )}

      {/* Debates Grid */}
      {!isLoading && data?.debates && data.debates.length > 0 && (
        <>
          <DebateList debates={data.debates} />

          {/* Load More */}
          {data.pagination?.hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                className="min-w-[200px]"
              >
                Load More Debates
              </Button>
            </div>
          )}

          {/* Pagination Info */}
          {!data.pagination?.hasMore && data.pagination?.total > limit && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
              You've reached the end of the list
            </p>
          )}
        </>
      )}
    </div>
  );
}
