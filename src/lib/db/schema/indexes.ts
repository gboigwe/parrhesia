import { index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { debates } from "./debates";
import { debateArguments } from "./arguments";
import { votes } from "./votes";
import { reputationEvents } from "./reputation";
import { badges } from "./badges";

// User indexes
export const usersBasenameIdx = index("users_basename_idx").on(users.basename);
export const usersWalletIdx = index("users_wallet_idx").on(users.walletAddress);

// Debate indexes
export const debatesStatusIdx = index("debates_status_idx").on(debates.status);
export const debatesCategoryIdx = index("debates_category_idx").on(debates.category);
export const debatesCreatorIdx = index("debates_creator_idx").on(debates.creatorId);
export const debatesChallengerIdx = index("debates_challenger_idx").on(debates.challengerId);
export const debatesCreatedAtIdx = index("debates_created_at_idx").on(debates.createdAt);

// Arguments indexes
export const argsDebateIdx = index("args_debate_idx").on(debateArguments.debateId);
export const argsUserIdx = index("args_user_idx").on(debateArguments.userId);

// Votes indexes
export const votesDebateIdx = index("votes_debate_idx").on(votes.debateId);
export const votesVoterIdx = index("votes_voter_idx").on(votes.voterId);

// Reputation indexes
export const repUserIdx = index("rep_user_idx").on(reputationEvents.userId);
export const repDebateIdx = index("rep_debate_idx").on(reputationEvents.debateId);
export const repTimestampIdx = index("rep_timestamp_idx").on(reputationEvents.timestamp);

// Badge indexes
export const badgesUserIdx = index("badges_user_idx").on(badges.userId);
export const badgesTypeIdx = index("badges_type_idx").on(badges.badgeType);
