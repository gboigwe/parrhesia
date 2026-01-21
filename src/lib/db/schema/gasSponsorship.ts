/**
 * Gas Sponsorship Schema
 * Tracks paymaster-sponsored transactions for monitoring and analytics
 */

import { pgTable, uuid, text, timestamp, bigint, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { debates } from "./debates";

/**
 * Gas sponsorship tracking table
 * Records all paymaster-sponsored transactions
 */
export const gasSponsorship = pgTable(
  "gas_sponsorship",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Transaction details
    transactionHash: text("transaction_hash").notNull().unique(),
    userOperationHash: text("user_operation_hash"),

    // User and debate references
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    debateId: uuid("debate_id").references(() => debates.id, { onDelete: "set null" }),

    // Operation details
    operationType: text("operation_type").notNull(), // debate_creation, debate_join, etc.

    // Gas tracking
    gasUsed: bigint("gas_used", { mode: "bigint" }).notNull(),
    gasPrice: bigint("gas_price", { mode: "bigint" }),
    totalGasCost: bigint("total_gas_cost", { mode: "bigint" }).notNull(), // in wei

    // Paymaster details
    paymasterAddress: text("paymaster_address"),
    entryPoint: text("entry_point").notNull(),

    // Blockchain details
    blockNumber: bigint("block_number", { mode: "bigint" }).notNull(),
    chainId: bigint("chain_id", { mode: "bigint" }).notNull().default(8453n), // Base mainnet

    // Metadata
    metadata: text("metadata"), // JSON string for additional data

    // Timestamps
    sponsoredAt: timestamp("sponsored_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("gas_sponsorship_user_id_idx").on(table.userId),
    debateIdIdx: index("gas_sponsorship_debate_id_idx").on(table.debateId),
    operationTypeIdx: index("gas_sponsorship_operation_type_idx").on(table.operationType),
    sponsoredAtIdx: index("gas_sponsorship_sponsored_at_idx").on(table.sponsoredAt),
    chainIdIdx: index("gas_sponsorship_chain_id_idx").on(table.chainId),
  })
);

/**
 * Gas sponsorship summary view (for analytics)
 * Aggregates gas costs by user, debate, and operation type
 */
export const gasSponsorshipSummary = pgTable(
  "gas_sponsorship_summary",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Aggregation key
    summaryType: text("summary_type").notNull(), // user, debate, operation
    summaryKey: text("summary_key").notNull(), // userId, debateId, or operationType

    // Aggregated metrics
    totalTransactions: bigint("total_transactions", { mode: "bigint" }).notNull().default(0n),
    totalGasSponsored: bigint("total_gas_sponsored", { mode: "bigint" }).notNull().default(0n), // in wei

    // Time period
    periodStart: timestamp("period_start").notNull(),
    periodEnd: timestamp("period_end").notNull(),

    // Timestamps
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    summaryTypeKeyIdx: index("gas_summary_type_key_idx").on(table.summaryType, table.summaryKey),
    periodIdx: index("gas_summary_period_idx").on(table.periodStart, table.periodEnd),
  })
);

export type GasSponsorship = typeof gasSponsorship.$inferSelect;
export type NewGasSponsorship = typeof gasSponsorship.$inferInsert;
export type GasSponsorshipSummary = typeof gasSponsorshipSummary.$inferSelect;
export type NewGasSponsorshipSummary = typeof gasSponsorshipSummary.$inferInsert;
