/**
 * Debate Library Barrel Exports
 * Import debate utilities and constants from this file
 */

// Constants
export {
  DEBATE_TIMING,
  DEBATE_FORMATS,
  PLATFORM_ECONOMICS,
  VOTING_CONFIG,
  STATUS_CONFIG,
  ARGUMENT_CONFIG,
  CONTRACT_ADDRESSES,
  NETWORK_CONFIG,
} from "./constants";

// Utilities
export {
  getTimeRemaining,
  isDebateActive,
  isVotingOpen,
  getDebateStatusLabel,
  calculatePrizeDistribution,
  formatUSDC,
  getDebateProgress,
  canJoinDebate,
  getRoundLabel,
  calculateDebateDuration,
} from "./utils";

// Filter utilities
export {
  filterBySearch,
  filterByCategory,
  filterByStatus,
  filterByStakeRange,
  sortDebates,
  applyFiltersAndSort,
  paginateDebates,
  hasActiveFilters,
  getDefaultFilters,
} from "./filters";
