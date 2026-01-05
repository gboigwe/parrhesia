/**
 * Debate Components Barrel Exports
 * Import debate components from this file for consistency
 */

// Core debate components
export { DebateCard } from "./DebateCard";
export { DebateStatus } from "./DebateStatus";
export { StakeDisplay } from "./StakeDisplay";

// Argument components
export { ArgumentCard } from "./ArgumentCard";
export { ArgumentForm } from "./ArgumentForm";
export { ArgumentThread } from "./ArgumentThread";
export { ArgumentStats } from "./ArgumentStats";
export { EmptyArguments } from "./EmptyArguments";

// Voting components
export { VotingPanel } from "./VotingPanel";
export type { VoteData } from "./VotingPanel";

// Participant components
export { ParticipantInfo } from "./ParticipantInfo";

// Utility components
export { TimerDisplay } from "./TimerDisplay";
export { CategoryBadge, DEBATE_CATEGORIES } from "./CategoryBadge";
export { ShareDebate } from "./ShareDebate";
export { TurnIndicator } from "./TurnIndicator";
export { DebateTimeline } from "./DebateTimeline";

// Forms
export { CreateDebateForm } from "./CreateDebateForm";

// Debate utilities and constants
export {
  DEBATE_TIMING,
  DEBATE_FORMATS,
  PLATFORM_ECONOMICS,
  VOTING_CONFIG,
  STATUS_CONFIG,
  ARGUMENT_CONFIG,
  CONTRACT_ADDRESSES,
  NETWORK_CONFIG,
} from "@/lib/debate/constants";

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
} from "@/lib/debate/utils";

// Debate types
export type {
  Debate,
  DebateWithParticipants,
  DebateStatus,
  DebateFormat,
  DebateCategory,
  CreateDebateInput,
  JoinDebateInput,
} from "@/types/debate";
