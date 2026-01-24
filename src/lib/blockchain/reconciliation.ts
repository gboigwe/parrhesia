/**
 * Blockchain Reconciliation Service
 * Periodically checks for database/blockchain mismatches and fixes them
 */

import { verifyDebateOnChain } from "./verification";
import { db } from "@/lib/db";
import { debates } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

/**
 * Result of a single debate reconciliation
 */
export interface ReconciliationResult {
  synced: boolean;
  fixed: number;
  discrepancies: string[];
  error?: string;
}

/**
 * Report of full reconciliation sweep
 */
export interface ReconciliationReport {
  total: number;
  outOfSync: number;
  fixed: number;
  errors: Array<{ debateId: string; error: string }>;
}

/**
 * Interval reference for the reconciliation service
 */
let reconciliationInterval: NodeJS.Timeout | null = null;

/**
 * Reconcile a single debate with blockchain
 * Verifies data and updates database to match blockchain if mismatches found
 * 
 * @param debateId - Debate ID to reconcile
 * @returns Reconciliation result
 */
export async function reconcileDebate(
  debateId: string
): Promise<ReconciliationResult> {
  try {
    console.log(`[Reconciliation] Checking debate ${debateId}...`);

    // Verify debate against blockchain
    const verification = await verifyDebateOnChain(debateId);

    // If verified or no contract address, nothing to do
    if (verification.verified) {
      console.log(`[Reconciliation] Debate ${debateId} is in sync`);
      return {
        synced: true,
        fixed: 0,
        discrepancies: [],
      };
    }

    // If verification failed without discrepancies (e.g., contract read error)
    if (verification.discrepancies.length === 0) {
      console.log(`[Reconciliation] Debate ${debateId} verification failed: ${verification.reason}`);
      return {
        synced: false,
        fixed: 0,
        discrepancies: [],
        error: verification.reason,
      };
    }

    // Debate is out of sync - fix it
    console.log(`[Reconciliation] Debate ${debateId} out of sync with Base`);
    console.log(`  Found ${verification.discrepancies.length} discrepancies`);

    const updates: any = {};
    const discrepancyDescriptions: string[] = [];

    // Process each discrepancy
    for (const discrepancy of verification.discrepancies) {
      console.log(`  Fixing ${discrepancy.field}: ${discrepancy.database} -> ${discrepancy.blockchain}`);
      discrepancyDescriptions.push(`${discrepancy.field}: ${discrepancy.database} -> ${discrepancy.blockchain}`);

      // Map discrepancy field to database field
      switch (discrepancy.field) {
        case "creator":
          updates.creatorId = discrepancy.blockchain;
          break;
        case "opponent":
          updates.challengerId = discrepancy.blockchain;
          break;
        case "stake":
          updates.stakeAmount = discrepancy.blockchain;
          break;
        case "winner":
          updates.onChainWinner = discrepancy.blockchain;
          updates.winnerId = discrepancy.blockchain;
          break;
        case "status":
          updates.status = discrepancy.blockchain;
          updates.onChainStatus = discrepancy.blockchain;
          break;
        case "prizeClaimed":
          if (discrepancy.blockchain === "false") {
            updates.prizeClaimed = null; // Clear false claim
          }
          break;
      }
    }

    // Update last synced time
    updates.lastSyncedAt = new Date();
    updates.syncStatus = "confirmed";
    updates.updatedAt = new Date();

    // Add sync error entry
    const existingDebate = await db.query.debates.findFirst({
      where: eq(debates.id, debateId),
    });

    if (existingDebate) {
      const existingErrors = (existingDebate.syncErrors as any[]) || [];
      const newError = {
        timestamp: new Date().toISOString(),
        type: "reconciliation",
        message: `Fixed ${verification.discrepancies.length} discrepancies`,
        discrepancies: verification.discrepancies,
      };
      updates.syncErrors = [...existingErrors, newError];
    }

    // Update database
    await db
      .update(debates)
      .set(updates)
      .where(eq(debates.id, debateId));

    console.log(`[Reconciliation] Debate ${debateId} reconciled - ${verification.discrepancies.length} fields updated`);

    return {
      synced: true,
      fixed: verification.discrepancies.length,
      discrepancies: discrepancyDescriptions,
    };
  } catch (error) {
    console.error(`[Reconciliation] Error reconciling debate ${debateId}:`, error);
    return {
      synced: false,
      fixed: 0,
      discrepancies: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Reconcile all active debates with blockchain
 * Checks and fixes any mismatches found
 * 
 * @returns Reconciliation report
 */
export async function reconcileAllDebates(): Promise<ReconciliationReport> {
  try {
    console.log(`[Reconciliation] Starting reconciliation sweep...`);

    // Fetch debates that need reconciliation
    // Include active, voting, completed status
    const debatesToCheck = await db.query.debates.findMany({
      where: inArray(debates.status, ["active", "voting", "completed"]),
    });

    // Filter out debates without contract address
    const debatesWithContracts = debatesToCheck.filter(
      (d) => d.contractAddress && d.contractAddress.length > 0
    );

    console.log(`[Reconciliation] Checking ${debatesWithContracts.length} debates (${debatesToCheck.length - debatesWithContracts.length} skipped - no contract)`);

    const report: ReconciliationReport = {
      total: debatesWithContracts.length,
      outOfSync: 0,
      fixed: 0,
      errors: [],
    };

    // Reconcile each debate
    for (const debate of debatesWithContracts) {
      const result = await reconcileDebate(debate.id);

      if (result.error) {
        report.errors.push({
          debateId: debate.id,
          error: result.error,
        });
      } else if (!result.synced || result.fixed > 0) {
        report.outOfSync++;
        report.fixed += result.fixed;
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log(`[Reconciliation] Sweep complete:`);
    console.log(`  Total checked: ${report.total}`);
    console.log(`  Out of sync: ${report.outOfSync}`);
    console.log(`  Fields fixed: ${report.fixed}`);
    console.log(`  Errors: ${report.errors.length}`);

    return report;
  } catch (error) {
    console.error(`[Reconciliation] Error during reconciliation sweep:`, error);
    return {
      total: 0,
      outOfSync: 0,
      fixed: 0,
      errors: [
        {
          debateId: "all",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      ],
    };
  }
}

/**
 * Start the automatic reconciliation service
 * Runs reconciliation sweep at regular intervals
 * 
 * @param intervalMinutes - How often to run reconciliation (default: 5 minutes)
 */
export function startReconciliationService(intervalMinutes: number = 5): void {
  // Don't start if already running
  if (reconciliationInterval) {
    console.log(`[Reconciliation] Service already running`);
    return;
  }

  // Only run on server
  if (typeof window !== "undefined") {
    console.log(`[Reconciliation] Skipping service start - running in browser`);
    return;
  }

  console.log(`[Reconciliation] Starting reconciliation service (every ${intervalMinutes} minutes)`);

  const intervalMs = intervalMinutes * 60 * 1000;

  // Run immediately on start
  reconcileAllDebates().catch((error) => {
    console.error(`[Reconciliation] Initial sweep error:`, error);
  });

  // Then run at intervals
  reconciliationInterval = setInterval(async () => {
    try {
      await reconcileAllDebates();
    } catch (error) {
      console.error(`[Reconciliation] Scheduled sweep error:`, error);
      // Don't stop the service on error - keep trying
    }
  }, intervalMs);

  console.log(`[Reconciliation] Service started successfully`);
}

/**
 * Stop the automatic reconciliation service
 */
export function stopReconciliationService(): void {
  if (!reconciliationInterval) {
    console.log(`[Reconciliation] Service not running`);
    return;
  }

  console.log(`[Reconciliation] Stopping reconciliation service...`);
  clearInterval(reconciliationInterval);
  reconciliationInterval = null;
  console.log(`[Reconciliation] Service stopped`);
}

/**
 * Check if reconciliation service is running
 */
export function isReconciliationServiceRunning(): boolean {
  return reconciliationInterval !== null;
}
