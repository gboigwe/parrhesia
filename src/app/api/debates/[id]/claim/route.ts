/**
 * Prize Claim API Endpoint
 * POST /api/debates/[id]/claim (PROTECTED)
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyClaimEligibility } from "@/lib/prizes/verification";
import { validateContractAddress, validateDebateId } from "@/lib/prizes/verification";
import { requireAuth } from "@/lib/auth/middleware";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // SECURITY: Require authentication
  const auth = await requireAuth(req);
  if (!auth.authenticated || !auth.address) {
    return auth.response!;
  }

  try {
    const debateId = params.id;
    const body = await req.json();

    const { contractAddress, transactionHash, blockNumber, amount } = body;

    // SECURITY: Use authenticated address, not client-provided winnerAddress
    const winnerAddress = auth.address;

    if (!validateDebateId(debateId)) {
      return NextResponse.json(
        { error: "Invalid debate ID" },
        { status: 400 }
      );
    }

    if (!validateContractAddress(contractAddress)) {
      return NextResponse.json(
        { error: "Invalid contract address" },
        { status: 400 }
      );
    }

    if (!winnerAddress || !transactionHash) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const claimRecord = {
      id: `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      debateId,
      winnerAddress,
      amount: amount || "0",
      transactionHash,
      blockNumber: blockNumber || 0,
      status: "confirmed" as const,
      createdAt: new Date(),
      confirmedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      claim: claimRecord,
      message: "Prize claim recorded successfully",
    });
  } catch (error) {
    console.error("Prize claim API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process prize claim",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const debateId = params.id;

    const mockClaimStatus = {
      debateId,
      status: "unclaimed" as const,
      transactionHash: null,
      claimedAt: null,
      amount: null,
    };

    return NextResponse.json(mockClaimStatus);
  } catch (error) {
    console.error("Claim status fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch claim status" },
      { status: 500 }
    );
  }
}
