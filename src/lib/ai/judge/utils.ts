/**
 * AI Judge Utility Functions
 * Helper functions for AI judge operations
 */

import type { AIJudgeAnalysis, AIJudgeVerdict } from "./types";

export function formatScoreAsPercentage(score: number): string {
  return `${Math.round((score / 10) * 100)}%`;
}

export function getScoreColor(score: number): string {
  if (score >= 8) return "text-green-600";
  if (score >= 6) return "text-blue-600";
  if (score >= 4) return "text-yellow-600";
  return "text-red-600";
}

export function getScoreBadgeColor(score: number): string {
  if (score >= 8) return "bg-green-100 text-green-800";
  if (score >= 6) return "bg-blue-100 text-blue-800";
  if (score >= 4) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return "text-green-600";
  if (confidence >= 0.6) return "text-yellow-600";
  return "text-orange-600";
}

export function getWinnerLabel(
  winner: "creator" | "challenger" | "tie"
): string {
  return winner === "creator"
    ? "Creator Wins"
    : winner === "challenger"
    ? "Challenger Wins"
    : "Tie";
}

export function calculateScoreDifference(
  score1: number,
  score2: number
): {
  difference: number;
  percentage: number;
  isSignificant: boolean;
} {
  const diff = Math.abs(score1 - score2);
  const avg = (score1 + score2) / 2;
  const percentage = avg > 0 ? (diff / avg) * 100 : 0;

  return {
    difference: Math.round(diff * 100) / 100,
    percentage: Math.round(percentage * 100) / 100,
    isSignificant: diff >= 1.0,
  };
}

export function getPerformanceLevel(score: number): string {
  if (score >= 9) return "Outstanding";
  if (score >= 8) return "Excellent";
  if (score >= 7) return "Good";
  if (score >= 6) return "Satisfactory";
  if (score >= 5) return "Fair";
  return "Needs Improvement";
}

export function summarizeAnalysis(analysis: AIJudgeAnalysis): {
  topStrength: string;
  mainWeakness: string;
  criticalFallacies: number;
  verifiedClaims: number;
} {
  return {
    topStrength: analysis.strengths[0] || "None identified",
    mainWeakness: analysis.weaknesses[0] || "None identified",
    criticalFallacies: analysis.fallaciesDetected.length,
    verifiedClaims: analysis.factCheckResults?.filter(
      (fc) => fc.verdict === "true"
    ).length || 0,
  };
}

export function compareAnalyses(
  analysis1: AIJudgeAnalysis,
  analysis2: AIJudgeAnalysis
): {
  argumentQualityGap: number;
  rebuttalGap: number;
  clarityGap: number;
  evidenceGap: number;
  persuasivenessGap: number;
  overallGap: number;
  leader: "first" | "second" | "tied";
} {
  const gaps = {
    argumentQualityGap: analysis1.argumentQuality - analysis2.argumentQuality,
    rebuttalGap: analysis1.rebuttalStrength - analysis2.rebuttalStrength,
    clarityGap: analysis1.clarity - analysis2.clarity,
    evidenceGap: analysis1.evidence - analysis2.evidence,
    persuasivenessGap: analysis1.persuasiveness - analysis2.persuasiveness,
    overallGap: analysis1.overallScore - analysis2.overallScore,
  };

  let leader: "first" | "second" | "tied" = "tied";
  if (Math.abs(gaps.overallGap) >= 0.3) {
    leader = gaps.overallGap > 0 ? "first" : "second";
  }

  return { ...gaps, leader };
}

export function formatVerdict(verdict: AIJudgeVerdict): {
  title: string;
  description: string;
  winnerScore: number;
  loserScore: number;
} {
  const creatorScore = verdict.creatorAnalysis.overallScore;
  const challengerScore = verdict.challengerAnalysis.overallScore;

  const title = getWinnerLabel(verdict.winner);

  let description = "";
  if (verdict.winner === "tie") {
    description = `Both debaters performed similarly with scores of ${creatorScore.toFixed(1)} and ${challengerScore.toFixed(1)}.`;
  } else {
    const winnerScore =
      verdict.winner === "creator" ? creatorScore : challengerScore;
    const loserScore =
      verdict.winner === "creator" ? challengerScore : creatorScore;
    description = `Winner scored ${winnerScore.toFixed(1)}/10 vs opponent's ${loserScore.toFixed(1)}/10.`;
  }

  return {
    title,
    description,
    winnerScore: verdict.winner === "creator" ? creatorScore : challengerScore,
    loserScore: verdict.winner === "creator" ? challengerScore : creatorScore,
  };
}

export function extractKeyInsights(verdict: AIJudgeVerdict): {
  decisiveFactor: string;
  closestCategory: string;
  biggestGap: string;
} {
  const creator = verdict.creatorAnalysis;
  const challenger = verdict.challengerAnalysis;

  const categories = [
    { name: "Argument Quality", gap: Math.abs(creator.argumentQuality - challenger.argumentQuality) },
    { name: "Rebuttal Strength", gap: Math.abs(creator.rebuttalStrength - challenger.rebuttalStrength) },
    { name: "Clarity", gap: Math.abs(creator.clarity - challenger.clarity) },
    { name: "Evidence", gap: Math.abs(creator.evidence - challenger.evidence) },
    { name: "Persuasiveness", gap: Math.abs(creator.persuasiveness - challenger.persuasiveness) },
  ];

  const sorted = [...categories].sort((a, b) => b.gap - a.gap);

  return {
    decisiveFactor: sorted[0].name,
    closestCategory: sorted[sorted.length - 1].name,
    biggestGap: `${sorted[0].name} (${sorted[0].gap.toFixed(1)} point difference)`,
  };
}
