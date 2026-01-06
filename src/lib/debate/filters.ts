/**
 * Debate filtering and sorting utilities
 */

import type { DebateFiltersState } from "@/components/debate/DebateDiscovery";

interface Debate {
  id: string;
  topic: string;
  resolution: string;
  category: string;
  status: string;
  stakeAmount: string;
  createdAt: Date;
  challenger?: { basename: string } | null;
}

/**
 * Filter debates based on search text
 */
export function filterBySearch(debates: Debate[], search: string): Debate[] {
  if (!search) return debates;

  const searchLower = search.toLowerCase();
  return debates.filter(
    (debate) =>
      debate.topic.toLowerCase().includes(searchLower) ||
      debate.resolution.toLowerCase().includes(searchLower)
  );
}

/**
 * Filter debates by category
 */
export function filterByCategory(
  debates: Debate[],
  category: string
): Debate[] {
  if (category === "all") return debates;
  return debates.filter((debate) => debate.category === category);
}

/**
 * Filter debates by status
 */
export function filterByStatus(debates: Debate[], status: string): Debate[] {
  if (status === "all") return debates;
  return debates.filter((debate) => debate.status === status);
}

/**
 * Filter debates by stake range
 */
export function filterByStakeRange(
  debates: Debate[],
  minStake: number,
  maxStake: number
): Debate[] {
  return debates.filter((debate) => {
    const stake = parseFloat(debate.stakeAmount);
    return stake >= minStake && stake <= maxStake;
  });
}

/**
 * Sort debates based on sort option
 */
export function sortDebates(
  debates: Debate[],
  sortBy: DebateFiltersState["sortBy"]
): Debate[] {
  const sorted = [...debates];

  switch (sortBy) {
    case "newest":
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "popular":
      sorted.sort((a, b) => {
        const aPopularity = a.challenger ? 2 : 1;
        const bPopularity = b.challenger ? 2 : 1;
        return bPopularity - aPopularity;
      });
      break;
    case "stake":
      sorted.sort(
        (a, b) => parseFloat(b.stakeAmount) - parseFloat(a.stakeAmount)
      );
      break;
    case "ending":
      sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
  }

  return sorted;
}

/**
 * Apply all filters and sorting to debates
 */
export function applyFiltersAndSort(
  debates: Debate[],
  filters: DebateFiltersState
): Debate[] {
  let filtered = debates;

  // Apply filters
  filtered = filterBySearch(filtered, filters.search);
  filtered = filterByCategory(filtered, filters.category);
  filtered = filterByStatus(filtered, filters.status);
  filtered = filterByStakeRange(filtered, filters.minStake, filters.maxStake);

  // Apply sorting
  filtered = sortDebates(filtered, filters.sortBy);

  return filtered;
}

/**
 * Paginate debates
 */
export function paginateDebates(
  debates: Debate[],
  page: number,
  limit: number
): {
  debates: Debate[];
  hasMore: boolean;
  total: number;
} {
  const total = debates.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedDebates = debates.slice(startIndex, endIndex);

  return {
    debates: paginatedDebates,
    hasMore: endIndex < total,
    total,
  };
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: DebateFiltersState): boolean {
  return (
    filters.search !== "" ||
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.minStake > 0 ||
    filters.maxStake < 10000
  );
}

/**
 * Get default filter state
 */
export function getDefaultFilters(): DebateFiltersState {
  return {
    search: "",
    category: "all",
    status: "all",
    minStake: 0,
    maxStake: 10000,
    sortBy: "newest",
  };
}
