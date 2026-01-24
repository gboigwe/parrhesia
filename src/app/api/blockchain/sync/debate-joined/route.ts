/**
 * POST /api/blockchain/sync/debate-joined
 * Syncs DebateJoined event from blockchain to database
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
      opponent,
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

    if (!opponent) {
      return NextResponse.json(
        { error: "Opponent address is required" },
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

    // Update debate with opponent and change status to active
    await db
      .update(debates)
      .set({
        challengerId: opponent,
        status: existingDebate.status === "pending" ? "active" : existingDebate.status,
        transactionHash, // Latest transaction hash
        blockNumber: blockNumber,
        syncStatus: "confirmed",
        lastSyncedAt: new Date(),
        lastSyncedBlock: blockNumber,
        startTime: new Date(), // Debate starts when opponent joins
        updatedAt: new Date(),
      })
      .where(eq(debates.id, debateId));

    console.log(`Synced DebateJoined event for debate ${debateId}`);
    console.log(`  Opponent: ${opponent}`);
    console.log(`  Status updated: ${existingDebate.status} -> active`);
    console.log(`  Transaction: ${transactionHash}`);
    console.log(`  Block: ${blockNumber}`);

    return NextResponse.json({
      success: true,
      message: "DebateJoined event synced successfully",
      debateId,
      opponent,
    });
  } catch (error) {
    console.error("Error syncing DebateJoined event:", error);
    return NextResponse.json(
      {
        error: "Failed to sync DebateJoined event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
