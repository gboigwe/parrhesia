/**
 * AI Judge Scoring Service
 * Calculates weighted scores and determines debate winners
 */

import { SCORING_CRITERIA, CONFIDENCE_THRESHOLDS } from "./constants";
import { generateVerdictPrompt } from "./prompts";
import type { AIJudgeAnalysis, AIJudgeVerdict } from "./types";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export function calculateWeightedScore(analysis: AIJudgeAnalysis): number {
  const weights = {
    argumentQuality: SCORING_CRITERIA.ARGUMENT_QUALITY.weight,
    rebuttalStrength: SCORING_CRITERIA.REBUTTAL_STRENGTH.weight,
    clarity: SCORING_CRITERIA.CLARITY.weight,
    evidence: SCORING_CRITERIA.EVIDENCE.weight,
    persuasiveness: SCORING_CRITERIA.PERSUASIVENESS.weight,
  };

  const weightedScore =
    analysis.argumentQuality * weights.argumentQuality +
    analysis.rebuttalStrength * weights.rebuttalStrength +
    analysis.clarity * weights.clarity +
    analysis.evidence * weights.evidence +
    analysis.persuasiveness * weights.persuasiveness;

  return Math.round(weightedScore * 100) / 100;
}

export function calculateAverageScores(
  analyses: AIJudgeAnalysis[]
): AIJudgeAnalysis {
  if (analyses.length === 0) {
    throw new Error("No analyses provided");
  }

  const totals = analyses.reduce(
    (acc, analysis) => ({
      argumentQuality: acc.argumentQuality + analysis.argumentQuality,
      rebuttalStrength: acc.rebuttalStrength + analysis.rebuttalStrength,
      clarity: acc.clarity + analysis.clarity,
      evidence: acc.evidence + analysis.evidence,
      persuasiveness: acc.persuasiveness + analysis.persuasiveness,
    }),
    {
      argumentQuality: 0,
      rebuttalStrength: 0,
      clarity: 0,
      evidence: 0,
      persuasiveness: 0,
    }
  );

  const count = analyses.length;

  const avgAnalysis: AIJudgeAnalysis = {
    argumentQuality: Math.round((totals.argumentQuality / count) * 100) / 100,
    rebuttalStrength: Math.round((totals.rebuttalStrength / count) * 100) / 100,
    clarity: Math.round((totals.clarity / count) * 100) / 100,
    evidence: Math.round((totals.evidence / count) * 100) / 100,
    persuasiveness: Math.round((totals.persuasiveness / count) * 100) / 100,
    overallScore: 0,
    explanation: analyses.map((a) => a.explanation).join("\n\n"),
    strengths: Array.from(new Set(analyses.flatMap((a) => a.strengths))),
    weaknesses: Array.from(new Set(analyses.flatMap((a) => a.weaknesses))),
    fallaciesDetected: Array.from(
      new Set(analyses.flatMap((a) => a.fallaciesDetected))
    ),
    factCheckResults: analyses.flatMap((a) => a.factCheckResults || []),
  };

  avgAnalysis.overallScore = calculateWeightedScore(avgAnalysis);

  return avgAnalysis;
}

export async function determineWinner(
  debateId: string,
  creatorAnalysis: AIJudgeAnalysis,
  challengerAnalysis: AIJudgeAnalysis,
  debateTopic: string
): Promise<AIJudgeVerdict> {
  const creatorScore = creatorAnalysis.overallScore;
  const challengerScore = challengerAnalysis.overallScore;

  const verdictPrompt = generateVerdictPrompt(
    creatorScore,
    challengerScore,
    creatorAnalysis.explanation,
    challengerAnalysis.explanation,
    debateTopic
  );

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2048,
    temperature: 0.3,
    messages: [
      {
        role: "user",
        content: verdictPrompt,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
  const jsonContent = jsonMatch ? jsonMatch[1] : responseText;

  const verdict = JSON.parse(jsonContent);

  return {
    debateId,
    winner: verdict.winner,
    creatorAnalysis,
    challengerAnalysis,
    reasoning: verdict.reasoning,
    confidence: verdict.confidence,
    judgedAt: new Date(),
  };
}

export function getConfidenceLevel(
  confidence: number
): "high" | "medium" | "low" {
  if (confidence >= CONFIDENCE_THRESHOLDS.HIGH) return "high";
  if (confidence >= CONFIDENCE_THRESHOLDS.MEDIUM) return "medium";
  return "low";
}

export function calculateScoreDifferential(
  creatorScore: number,
  challengerScore: number
): {
  differential: number;
  percentage: number;
  isClose: boolean;
} {
  const differential = Math.abs(creatorScore - challengerScore);
  const avgScore = (creatorScore + challengerScore) / 2;
  const percentage = (differential / avgScore) * 100;

  return {
    differential: Math.round(differential * 100) / 100,
    percentage: Math.round(percentage * 100) / 100,
    isClose: differential < 0.5,
  };
}
