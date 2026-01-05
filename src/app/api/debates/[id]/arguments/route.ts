import { NextRequest, NextResponse } from "next/server";
import { getDebateArguments, createArgument, getDebateById } from "@/lib/db/queries";
import { DEBATE_CONFIG } from "@/lib/constants";

/**
 * GET /api/debates/[id]/arguments - Get all arguments for a debate
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const arguments = await getDebateArguments(params.id);
    return NextResponse.json({ arguments });
  } catch (error) {
    console.error("Error fetching arguments:", error);
    return NextResponse.json(
      { error: "Failed to fetch arguments" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/debates/[id]/arguments - Submit a new argument
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { content, userId, roundNumber } = body;

    // Validation
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Argument content is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!roundNumber || roundNumber < 1) {
      return NextResponse.json(
        { error: "Valid round number is required" },
        { status: 400 }
      );
    }

    // Calculate word count
    const words = content.trim().split(/\s+/).filter((word: string) => word.length > 0);
    const wordCount = words.length;

    // Validate word count
    if (wordCount < DEBATE_CONFIG.MIN_ARGUMENT_LENGTH) {
      return NextResponse.json(
        {
          error: `Argument must be at least ${DEBATE_CONFIG.MIN_ARGUMENT_LENGTH} words`,
        },
        { status: 400 }
      );
    }

    if (wordCount > DEBATE_CONFIG.MAX_ARGUMENT_LENGTH) {
      return NextResponse.json(
        {
          error: `Argument must not exceed ${DEBATE_CONFIG.MAX_ARGUMENT_LENGTH} words`,
        },
        { status: 400 }
      );
    }

    // Check if debate exists and is active
    const debate = await getDebateById(params.id);
    if (!debate) {
      return NextResponse.json(
        { error: "Debate not found" },
        { status: 404 }
      );
    }

    if (debate.status !== "active") {
      return NextResponse.json(
        { error: "Debate is not active" },
        { status: 400 }
      );
    }

    // Check if user is a participant
    if (debate.creatorId !== userId && debate.challengerId !== userId) {
      return NextResponse.json(
        { error: "Only debate participants can submit arguments" },
        { status: 403 }
      );
    }

    // Create argument
    const argument = await createArgument({
      debateId: params.id,
      userId,
      content: content.trim(),
      wordCount,
      roundNumber,
    });

    return NextResponse.json(
      {
        message: "Argument submitted successfully",
        argument,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting argument:", error);
    return NextResponse.json(
      { error: "Failed to submit argument" },
      { status: 500 }
    );
  }
}
