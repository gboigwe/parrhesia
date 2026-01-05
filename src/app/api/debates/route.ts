import { NextRequest, NextResponse } from "next/server";
import { createDebate, getActiveDebates } from "@/lib/db/queries";
import { DEBATE_CONFIG } from "@/lib/constants";

/**
 * GET /api/debates - Get all active debates
 */
export async function GET() {
  try {
    const debates = await getActiveDebates();
    return NextResponse.json({ debates });
  } catch (error) {
    console.error("Error fetching debates:", error);
    return NextResponse.json(
      { error: "Failed to fetch debates" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/debates - Create a new debate
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, format, stakeAmount, creatorId } = body;

    // Validation
    if (!title || title.length < 10) {
      return NextResponse.json(
        { error: "Title must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (!description || description.length < 50) {
      return NextResponse.json(
        { error: "Description must be at least 50 characters" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!format || !["live", "async"].includes(format)) {
      return NextResponse.json(
        { error: "Valid format is required (live or async)" },
        { status: 400 }
      );
    }

    if (
      !stakeAmount ||
      stakeAmount < DEBATE_CONFIG.MIN_STAKE_USDC ||
      stakeAmount > DEBATE_CONFIG.MAX_STAKE_USDC
    ) {
      return NextResponse.json(
        {
          error: `Stake must be between ${DEBATE_CONFIG.MIN_STAKE_USDC} and ${DEBATE_CONFIG.MAX_STAKE_USDC} USDC`,
        },
        { status: 400 }
      );
    }

    if (!creatorId) {
      return NextResponse.json(
        { error: "Creator ID is required" },
        { status: 400 }
      );
    }

    // Map format: "live" -> "timed" for database
    const dbFormat = format === "live" ? "timed" : "async";

    // Create debate in database
    const debate = await createDebate({
      topic: title,
      resolution: description,
      category,
      format: dbFormat,
      stakeAmount: stakeAmount.toString(),
      creatorId,
      status: "pending", // Waiting for opponent
    });

    return NextResponse.json(
      {
        debateId: debate.id,
        message: "Debate created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating debate:", error);
    return NextResponse.json(
      { error: "Failed to create debate" },
      { status: 500 }
    );
  }
}
