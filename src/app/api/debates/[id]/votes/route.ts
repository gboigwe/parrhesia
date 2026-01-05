import { NextRequest, NextResponse } from "next/server";
import { getDebateVotes, createVote, hasUserVoted, getDebateById } from "@/lib/db/queries";
import { VOTING_WEIGHTS } from "@/lib/constants";

/**
 * GET /api/debates/[id]/votes - Get all votes for a debate
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const votes = await getDebateVotes(params.id);
    return NextResponse.json({ votes });
  } catch (error) {
    console.error("Error fetching votes:", error);
    return NextResponse.json(
      { error: "Failed to fetch votes" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/debates/[id]/votes - Submit a vote
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      voterId,
      winnerId,
      argumentQuality,
      rebuttalStrength,
      clarity,
      evidence,
      persuasiveness,
      feedback,
    } = body;

    // Validation
    if (!voterId) {
      return NextResponse.json(
        { error: "Voter ID is required" },
        { status: 400 }
      );
    }

    if (!winnerId) {
      return NextResponse.json(
        { error: "Winner selection is required" },
        { status: 400 }
      );
    }

    // Validate scores (1-10)
    const scores = { argumentQuality, rebuttalStrength, clarity, evidence, persuasiveness };
    for (const [key, value] of Object.entries(scores)) {
      if (typeof value !== "number" || value < 1 || value > 10) {
        return NextResponse.json(
          { error: `${key} must be between 1 and 10` },
          { status: 400 }
        );
      }
    }

    // Check if debate exists and is in voting phase
    const debate = await getDebateById(params.id);
    if (!debate) {
      return NextResponse.json(
        { error: "Debate not found" },
        { status: 404 }
      );
    }

    if (debate.status !== "voting") {
      return NextResponse.json(
        { error: "Debate is not in voting phase" },
        { status: 400 }
      );
    }

    // Check if user is a participant (participants can't vote)
    if (debate.creatorId === voterId || debate.challengerId === voterId) {
      return NextResponse.json(
        { error: "Debate participants cannot vote" },
        { status: 403 }
      );
    }

    // Check if user has already voted
    const alreadyVoted = await hasUserVoted(params.id, voterId);
    if (alreadyVoted) {
      return NextResponse.json(
        { error: "You have already voted on this debate" },
        { status: 400 }
      );
    }

    // Calculate weighted total score
    const totalScore =
      (argumentQuality * VOTING_WEIGHTS.ARGUMENT_QUALITY +
        rebuttalStrength * VOTING_WEIGHTS.REBUTTAL_STRENGTH +
        clarity * VOTING_WEIGHTS.CLARITY +
        evidence * VOTING_WEIGHTS.EVIDENCE +
        persuasiveness * VOTING_WEIGHTS.PERSUASIVENESS) /
      100;

    // Create vote
    const vote = await createVote({
      debateId: params.id,
      voterId,
      winnerId,
      argumentQuality,
      rebuttalStrength,
      clarity,
      evidence,
      persuasiveness,
      totalScore: totalScore.toString(),
      feedback: feedback?.trim() || null,
    });

    return NextResponse.json(
      {
        message: "Vote submitted successfully",
        vote,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { error: "Failed to submit vote" },
      { status: 500 }
    );
  }
}
