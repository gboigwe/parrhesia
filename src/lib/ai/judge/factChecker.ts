/**
 * AI Judge Fact Checking Integration
 * Verifies factual claims in debate arguments
 */

import type { FactCheckResult } from "./types";

export async function extractClaims(argumentText: string): Promise<string[]> {
  const claims: string[] = [];

  const factualPatterns = [
    /(?:studies show|research indicates|data shows|according to|statistics reveal|evidence suggests)\s+([^.!?]+[.!?])/gi,
    /\d+%\s+of\s+[^.!?]+[.!?]/gi,
    /in\s+\d{4}[,\s]+[^.!?]+[.!?]/gi,
  ];

  for (const pattern of factualPatterns) {
    const matches = argumentText.matchAll(pattern);
    for (const match of matches) {
      claims.push(match[0].trim());
    }
  }

  return claims;
}

export async function verifyClaimWithSources(
  claim: string,
  providedSources: string[]
): Promise<FactCheckResult> {
  const hasNumericData = /\d+%|\d+\s+(million|billion|thousand)/.test(claim);
  const hasDateReference = /\d{4}|recent|latest|current/.test(claim);

  if (providedSources.length === 0) {
    return {
      claim,
      verdict: "unverified",
      confidence: 0.3,
      sources: [],
    };
  }

  const hasCredibleSource = providedSources.some(
    (source) =>
      source.includes(".gov") ||
      source.includes(".edu") ||
      source.includes("scholar.google") ||
      source.includes("pubmed") ||
      source.includes("nature.com") ||
      source.includes("science.org")
  );

  if (hasCredibleSource && (hasNumericData || hasDateReference)) {
    return {
      claim,
      verdict: "true",
      confidence: 0.85,
      sources: providedSources.filter(
        (s) =>
          s.includes(".gov") ||
          s.includes(".edu") ||
          s.includes("scholar.google")
      ),
    };
  }

  if (hasCredibleSource) {
    return {
      claim,
      verdict: "partially_true",
      confidence: 0.7,
      sources: providedSources,
    };
  }

  return {
    claim,
    verdict: "unverified",
    confidence: 0.5,
    sources: providedSources,
  };
}

export async function factCheckArgument(
  argumentText: string,
  providedSources?: string[]
): Promise<FactCheckResult[]> {
  const claims = await extractClaims(argumentText);

  if (claims.length === 0) {
    return [];
  }

  const sources = providedSources || [];

  const results = await Promise.all(
    claims.map((claim) => verifyClaimWithSources(claim, sources))
  );

  return results;
}

export function calculateFactCheckScore(
  results: FactCheckResult[]
): {
  score: number;
  totalClaims: number;
  verifiedClaims: number;
  averageConfidence: number;
} {
  if (results.length === 0) {
    return {
      score: 0,
      totalClaims: 0,
      verifiedClaims: 0,
      averageConfidence: 0,
    };
  }

  const verdictScores = {
    true: 1.0,
    partially_true: 0.6,
    unverified: 0.3,
    false: 0.0,
  };

  const verifiedClaims = results.filter((r) => r.verdict === "true").length;
  const totalScore = results.reduce(
    (sum, result) => sum + verdictScores[result.verdict] * result.confidence,
    0
  );
  const avgConfidence =
    results.reduce((sum, result) => sum + result.confidence, 0) /
    results.length;

  return {
    score: Math.round((totalScore / results.length) * 100) / 100,
    totalClaims: results.length,
    verifiedClaims,
    averageConfidence: Math.round(avgConfidence * 100) / 100,
  };
}

export function getFactCheckSummary(
  results: FactCheckResult[]
): {
  hasFactualClaims: boolean;
  allVerified: boolean;
  mostlyVerified: boolean;
  needsMoreSources: boolean;
  credibilityScore: number;
} {
  if (results.length === 0) {
    return {
      hasFactualClaims: false,
      allVerified: false,
      mostlyVerified: false,
      needsMoreSources: false,
      credibilityScore: 0,
    };
  }

  const stats = calculateFactCheckScore(results);
  const verificationRate = stats.verifiedClaims / stats.totalClaims;

  return {
    hasFactualClaims: true,
    allVerified: verificationRate === 1.0,
    mostlyVerified: verificationRate >= 0.7,
    needsMoreSources: stats.score < 0.5,
    credibilityScore: stats.score,
  };
}
