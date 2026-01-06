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

// Forms and Creation Flow
export { CreateDebateForm } from "./CreateDebateForm";
export { DebateCreationModal } from "./DebateCreationModal";
export { DebateCreatedSuccess } from "./DebateCreatedSuccess";
export { StakeSelector } from "./StakeSelector";
export { FormatSelector } from "./FormatSelector";
export { CategorySelector } from "./CategorySelector";

// Discovery and List components
export { DebateDiscovery } from "./DebateDiscovery";
export { DebateFilters } from "./DebateFilters";
export { DebateList } from "./DebateList";
export { DebateSkeleton } from "./DebateSkeleton";
export { EmptyDebates } from "./EmptyDebates";
export type { DebateFiltersState } from "./DebateDiscovery";

// Detail Page components
export { DebateHeader } from "./DebateHeader";
export { ArgumentList } from "./ArgumentList";
export { ArgumentSubmissionForm } from "./ArgumentSubmissionForm";
export { DebateInfoSidebar } from "./DebateInfoSidebar";
export { DebateDetailSkeleton } from "./DebateDetailSkeleton";
export { DebateErrorState } from "./DebateErrorState";
export { ArgumentMetadata } from "./ArgumentMetadata";
export { ArgumentSources } from "./ArgumentSources";
export { DebateActions } from "./DebateActions";
export { DebateProgress } from "./DebateProgress";

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
