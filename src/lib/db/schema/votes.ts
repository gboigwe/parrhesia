import { pgTable, text, timestamp, integer, decimal, uuid } from "drizzle-orm/pg-core";
import { debates } from "./debates";
import { users } from "./users";

export const votes = pgTable("votes", {
  id: uuid("id").defaultRandom().primaryKey(),
  debateId: uuid("debate_id").references(() => debates.id, { onDelete: "cascade" }).notNull(),
  voterId: uuid("voter_id").references(() => users.id).notNull(),
  winnerId: uuid("winner_id").references(() => users.id).notNull(),

  // Voting criteria scores (1-10)
  argumentQuality: integer("argument_quality").notNull(),
  rebuttalStrength: integer("rebuttal_strength").notNull(),
  clarity: integer("clarity").notNull(),
  evidence: integer("evidence").notNull(),
  persuasiveness: integer("persuasiveness").notNull(),

  // Calculated
  totalScore: decimal("total_score", { precision: 5, scale: 2 }).notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }).default("1").notNull(),

  // Feedback
  feedback: text("feedback"),

  // Metadata
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  transactionHash: text("transaction_hash"),

  // Rewards
  rewardAmount: decimal("reward_amount", { precision: 18, scale: 6 }),
  rewardClaimed: timestamp("reward_claimed"),
});
