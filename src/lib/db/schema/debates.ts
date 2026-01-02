import { pgTable, text, timestamp, decimal, uuid, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const debateStatusEnum = pgEnum("debate_status", [
  "pending",
  "active",
  "voting",
  "completed",
  "cancelled",
]);

export const debateFormatEnum = pgEnum("debate_format", ["async", "timed"]);

export const debateCategoryEnum = pgEnum("debate_category", [
  "crypto",
  "tech",
  "policy",
  "economics",
  "social",
  "entertainment",
  "dao",
  "custom",
]);

export const debates = pgTable("debates", {
  id: uuid("id").defaultRandom().primaryKey(),
  topic: text("topic").notNull(),
  resolution: text("resolution").notNull(),
  category: debateCategoryEnum("category").notNull(),
  format: debateFormatEnum("format").notNull(),
  status: debateStatusEnum("status").default("pending").notNull(),

  // Participants
  creatorId: uuid("creator_id").references(() => users.id).notNull(),
  challengerId: uuid("challenger_id").references(() => users.id),

  // Stakes and prizes
  stakeAmount: decimal("stake_amount", { precision: 18, scale: 6 }).notNull(), // USDC has 6 decimals
  prizePool: decimal("prize_pool", { precision: 18, scale: 6 }).default("0").notNull(),

  // Timing
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  votingEndsAt: timestamp("voting_ends_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  // Blockchain
  contractAddress: text("contract_address"),
  transactionHash: text("transaction_hash"),

  // Winner
  winnerId: uuid("winner_id").references(() => users.id),
});
