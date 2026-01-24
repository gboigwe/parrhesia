/**
 * POST /api/blockchain/sync/debate-created
 * Syncs DebateCreated event from blockchain to database
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
      creator,
      stake,
      contractAddress,
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

    if (!creator) {
      return NextResponse.json(
        { error: "Creator address is required" },
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

    if (existingDebate) {
      // Update existing debate with blockchain metadata
      await db
        .update(debates)
        .set({
          contractAddress,
          transactionHash,
          blockNumber: blockNumber,
          syncStatus: "confirmed",
          lastSyncedAt: new Date(),
          lastSyncedBlock: blockNumber,
          updatedAt: new Date(),
        })
        .where(eq(debates.id, debateId));

      console.log(`Synced DebateCreated event for debate ${debateId}`);
      console.log(`  Updated existing debate with blockchain metadata`);
    } else {
      // Insert new debate
      await db.insert(debates).values({
        id: debateId,
        topic: `Debate ${debateId}`, // Placeholder - will be updated
        resolution: `Debate created on-chain`, // Placeholder
        category: "custom",
        format: "async",
        status: "pending",
        stakeAmount: stake,
        prizePool: (parseFloat(stake) * 2).toString(),
        creatorId: creator,
        contractAddress,
        transactionHash,
        blockNumber: blockNumber,
        chainId: 8453, // Base mainnet
        syncStatus: "confirmed",
        lastSyncedAt: new Date(),
        lastSyncedBlock: blockNumber,
        syncErrors: [],
      });

      console.log(`Synced DebateCreated event for debate ${debateId}`);
      console.log(`  Created new debate record`);
    }

    console.log(`  Creator: ${creator}`);
    console.log(`  Stake: ${stake}`);
    console.log(`  Contract: ${contractAddress}`);
    console.log(`  Transaction: ${transactionHash}`);
    console.log(`  Block: ${blockNumber}`);

    return NextResponse.json({
      success: true,
      message: "DebateCreated event synced successfully",
      debateId,
    });
  } catch (error) {
    console.error("Error syncing DebateCreated event:", error);
    return NextResponse.json(
      {
        error: "Failed to sync DebateCreated event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
