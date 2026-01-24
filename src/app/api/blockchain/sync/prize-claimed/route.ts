/**
 * POST /api/blockchain/sync/prize-claimed
 * Syncs PrizeClaimed event from blockchain to database
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
      winner,
      amount,
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

    if (!winner) {
      return NextResponse.json(
        { error: "Winner address is required" },
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

    // Update debate with prize claim information
    await db
      .update(debates)
      .set({
        prizeClaimed: new Date(), // Timestamp when prize was claimed
        prizeClaimTxHash: transactionHash,
        prizeClaimBlockNumber: blockNumber.toString(),
        transactionHash, // Latest transaction hash
        blockNumber: blockNumber,
        syncStatus: "confirmed",
        lastSyncedAt: new Date(),
        lastSyncedBlock: blockNumber,
        updatedAt: new Date(),
      })
      .where(eq(debates.id, debateId));

    console.log(`Synced PrizeClaimed event for debate ${debateId}`);
    console.log(`  Winner: ${winner}`);
    console.log(`  Amount: ${amount}`);
    console.log(`  Transaction: ${transactionHash}`);
    console.log(`  Block: ${blockNumber}`);
    console.log(`  Prize claimed at: ${timestamp || new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      message: "PrizeClaimed event synced successfully",
      debateId,
      winner,
      amount,
    });
  } catch (error) {
    console.error("Error syncing PrizeClaimed event:", error);
    return NextResponse.json(
      {
        error: "Failed to sync PrizeClaimed event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
