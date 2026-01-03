import { pgTable, text, timestamp, decimal, uuid, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { debates } from "./debates";

export const reputationEventTypeEnum = pgEnum("reputation_event_type", [
  "debate_win",
  "debate_loss",
  "vote_cast",
  "badge_earned",
  "penalty",
  "bonus",
]);

export const reputationEvents = pgTable("reputation_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  eventType: reputationEventTypeEnum("event_type").notNull(),

  // Reputation change
  delta: decimal("delta", { precision: 5, scale: 2 }).notNull(),
  previousScore: decimal("previous_score", { precision: 5, scale: 2 }).notNull(),
  newScore: decimal("new_score", { precision: 5, scale: 2 }).notNull(),

  // Context
  debateId: uuid("debate_id").references(() => debates.id),
  reason: text("reason"),

  // Metadata
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
