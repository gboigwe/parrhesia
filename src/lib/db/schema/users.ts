import { pgTable, text, timestamp, integer, decimal, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  basename: text("basename").notNull().unique(),
  walletAddress: text("wallet_address").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  // Reputation scores
  debaterReputation: decimal("debater_reputation", { precision: 5, scale: 2 }).default("0").notNull(),
  voterReputation: decimal("voter_reputation", { precision: 5, scale: 2 }).default("0").notNull(),

  // Statistics
  totalDebates: integer("total_debates").default(0).notNull(),
  totalVotes: integer("total_votes").default(0).notNull(),
  totalWins: integer("total_wins").default(0).notNull(),
  totalLosses: integer("total_losses").default(0).notNull(),

  // Profile
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
});

// Export User type for use in other files
export type User = typeof users.$inferSelect;
