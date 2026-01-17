/**
 * AI Judge API Endpoint
 * POST /api/debates/[id]/judge
 */

import { NextRequest, NextResponse } from "next/server";
import {
  analyzeAllRounds,
  calculateAverageScores,
  determineWinner,
} from "@/lib/ai/judge/analyzer";
import { detectAllFallacies } from "@/lib/ai/judge/fallacyDetector";
import { factCheckArgument } from "@/lib/ai/judge/factChecker";
import type { DebateArgument } from "@/lib/ai/judge/types";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const debateId = params.id;
    const body = await req.json();

    const {
      creatorArguments,
      challengerArguments,
      debateTopic,
    }: {
      creatorArguments: DebateArgument[];
      challengerArguments: DebateArgument[];
      debateTopic: string;
    } = body;

    if (!creatorArguments || !challengerArguments || !debateTopic) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { creatorAnalyses, challengerAnalyses } = await analyzeAllRounds(
      creatorArguments,
      challengerArguments,
      debateTopic
    );

    const creatorFallacies = creatorArguments.flatMap((arg) =>
      detectAllFallacies(arg.content)
    );
    const challengerFallacies = challengerArguments.flatMap((arg) =>
      detectAllFallacies(arg.content)
    );

    const creatorFactChecks = await Promise.all(
      creatorArguments.map((arg) =>
        factCheckArgument(arg.content, arg.sources)
      )
    );
    const challengerFactChecks = await Promise.all(
      challengerArguments.map((arg) =>
        factCheckArgument(arg.content, arg.sources)
      )
    );

    const creatorAverage = calculateAverageScores(creatorAnalyses);
    const challengerAverage = calculateAverageScores(challengerAnalyses);

    creatorAverage.fallaciesDetected = Array.from(
      new Set(creatorFallacies.map((f) => f.type))
    );
    challengerAverage.fallaciesDetected = Array.from(
      new Set(challengerFallacies.map((f) => f.type))
    );

    creatorAverage.factCheckResults = creatorFactChecks.flat();
    challengerAverage.factCheckResults = challengerFactChecks.flat();

    const verdict = await determineWinner(
      debateId,
      creatorAverage,
      challengerAverage,
      debateTopic
    );

    return NextResponse.json({
      verdict,
      creatorFallacies,
      challengerFallacies,
    });
  } catch (error) {
    console.error("AI Judge error:", error);
    return NextResponse.json(
      { error: "Failed to analyze debate" },
      { status: 500 }
    );
  }
}
