/**
 * POST /api/blockchain/sync/debate-finalized
 * Syncs DebateFinalized event from blockchain to database
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { debates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      debateId,
      onChainWinner,
      totalVotes,
      transactionHash,
      blockNumber,
      timestamp,
    } = body;

    // Validate required fields
    if (!debateId) {
      return NextResponse.json(
        { error: "Debate ID is required" },
        { status: 400 }
      );
    }

    if (!onChainWinner) {
      return NextResponse.json(
        { error: "On-chain winner address is required" },
        { status: 400 }
      );
    }

    if (!transactionHash) {
      return NextResponse.json(
        { error: "Transaction hash is required" },
        { status: 400 }
      );
    }

    if (blockNumber === undefined) {
      return NextResponse.json(
        { error: "Block number is required" },
        { status: 400 }
      );
    }

    // Check if debate exists
    const existingDebate = await db.query.debates.findFirst({
      where: eq(debates.id, debateId),
    });

    if (!existingDebate) {
      return NextResponse.json(
        { error: `Debate ${debateId} not found` },
        { status: 404 }
      );
    }

    // Update debate with finalization information
    // The on-chain winner is the source of truth
    await db
      .update(debates)
      .set({
        status: "completed", // Debate is now completed
        onChainWinner, // Winner according to blockchain (source of truth)
        onChainStatus: "finalized", // Status according to blockchain
        winnerId: onChainWinner, // Set winner ID to on-chain winner
        endTime: new Date(), // Debate ends when finalized
        transactionHash, // Latest transaction hash
        blockNumber: blockNumber,
        syncStatus: "confirmed",
        lastSyncedAt: new Date(),
        lastSyncedBlock: blockNumber,
        updatedAt: new Date(),
      })
      .where(eq(debates.id, debateId));

    console.log(`Synced DebateFinalized event for debate ${debateId}`);
    console.log(`  On-chain winner (source of truth): ${onChainWinner}`);
    console.log(`  Total votes: ${totalVotes}`);
    console.log(`  Status: completed`);
    console.log(`  Transaction: ${transactionHash}`);
    console.log(`  Block: ${blockNumber}`);

    return NextResponse.json({
      success: true,
      message: "DebateFinalized event synced successfully",
      debateId,
      onChainWinner,
      totalVotes,
    });
  } catch (error) {
    console.error("Error syncing DebateFinalized event:", error);
    return NextResponse.json(
      {
        error: "Failed to sync DebateFinalized event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
