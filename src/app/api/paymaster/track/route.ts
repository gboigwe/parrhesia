/**
 * Gas Sponsorship Tracking API
 * Records paymaster-sponsored transactions in the database
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gasSponsorship } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      transactionHash,
      userOperationHash,
      userId,
      debateId,
      operationType,
      gasUsed,
      gasPrice,
      totalGasCost,
      paymasterAddress,
      entryPoint,
      blockNumber,
      chainId,
      metadata,
    } = body;

    // Validation
    if (!transactionHash || !userId || !operationType || !gasUsed || !totalGasCost) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert sponsorship record
    const record = await db.insert(gasSponsorship).values({
      transactionHash,
      userOperationHash: userOperationHash || null,
      userId,
      debateId: debateId || null,
      operationType,
      gasUsed: BigInt(gasUsed),
      gasPrice: gasPrice ? BigInt(gasPrice) : null,
      totalGasCost: BigInt(totalGasCost),
      paymasterAddress: paymasterAddress || null,
      entryPoint,
      blockNumber: BigInt(blockNumber),
      chainId: BigInt(chainId),
      metadata: metadata || null,
    }).returning();

    return NextResponse.json({
      success: true,
      record: record[0],
    });
  } catch (error) {
    console.error("Error tracking gas sponsorship:", error);

    return NextResponse.json(
      { error: "Failed to track gas sponsorship" },
      { status: 500 }
    );
  }
}
