import { pgTable, text, timestamp, integer, uuid, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const badgeTypeEnum = pgEnum("badge_type", [
  // Debater badges
  "first_win",
  "win_streak_10",
  "giant_slayer",
  "specialist",
  "undefeated",
  // Voter badges
  "votes_100",
  "consensus_builder",
  "early_adopter",
  "category_expert",
  // Special badges
  "tournament_winner",
  "pioneer",
  "community_favorite",
]);

export const badges = pgTable("badges", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  badgeType: badgeTypeEnum("badge_type").notNull(),

  // NFT details
  tokenId: integer("token_id").notNull().unique(),
  metadataUri: text("metadata_uri").notNull(),
  contractAddress: text("contract_address"),

  // Metadata
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  transactionHash: text("transaction_hash"),

  // Description
  title: text("title").notNull(),
  description: text("description").notNull(),
});
