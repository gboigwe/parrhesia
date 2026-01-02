import { pgTable, text, timestamp, integer, uuid, jsonb } from "drizzle-orm/pg-core";
import { debates } from "./debates";
import { users } from "./users";

export const debateArguments = pgTable("arguments", {
  id: uuid("id").defaultRandom().primaryKey(),
  debateId: uuid("debate_id").references(() => debates.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),

  // Content
  content: text("content").notNull(),
  contentIpfsHash: text("content_ipfs_hash"),
  wordCount: integer("word_count").notNull(),
  citations: jsonb("citations").$type<string[]>(),

  // Metadata
  roundNumber: integer("round_number").notNull(),
  postedAt: timestamp("posted_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  // Blockchain
  transactionHash: text("transaction_hash"),
});
