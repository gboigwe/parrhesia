/**
 * Join Debate API Endpoint
 * Updates database when a user joins a debate
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { debates } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const debateId = params.id;
    const body = await req.json();

    const {
      challengerId,
      challengerAddress,
      transactionHash,
      blockNumber,
    } = body;

    // Validation
    if (!challengerId || !challengerAddress || !transactionHash) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check debate exists and is pending
    const [existingDebate] = await db
      .select()
      .from(debates)
      .where(eq(debates.id, debateId))
      .limit(1);

    if (!existingDebate) {
      return NextResponse.json(
        { error: "Debate not found" },
        { status: 404 }
      );
    }

    if (existingDebate.status !== "pending") {
      return NextResponse.json(
        { error: "Debate is not open for joining" },
        { status: 400 }
      );
    }

    if (existingDebate.challengerId) {
      return NextResponse.json(
        { error: "Debate already has a challenger" },
        { status: 400 }
      );
    }

    // Update debate with challenger
    const [updatedDebate] = await db
      .update(debates)
      .set({
        challengerId,
        challengerWallet: challengerAddress,
        status: "active",
        joinedAt: new Date(),
        joinTxHash: transactionHash,
        joinTxBlock: blockNumber?.toString(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(debates.id, debateId),
          eq(debates.status, "pending")
        )
      )
      .returning();

    if (!updatedDebate) {
      return NextResponse.json(
        { error: "Failed to update debate" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      debate: updatedDebate,
    });
  } catch (error) {
    console.error("Error joining debate:", error);

    return NextResponse.json(
      { error: "Failed to join debate" },
      { status: 500 }
    );
  }
}
