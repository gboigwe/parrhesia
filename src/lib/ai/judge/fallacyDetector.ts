/**
 * Logical Fallacy Detection
 * Pattern-based detection of common logical fallacies
 */

import { FALLACY_DESCRIPTIONS } from "./constants";
import type { LogicalFallacy } from "./types";

export function detectAdHominem(text: string): LogicalFallacy[] {
  const fallacies: LogicalFallacy[] = [];

  const patterns = [
    /\b(you're|you are)\s+(stupid|ignorant|biased|incompetent|foolish)\b/gi,
    /\b(your|the)\s+(lack of|limited)\s+(intelligence|education|understanding)\b/gi,
    /\bof course\s+\w+\s+would\s+say\s+that\b/gi,
  ];

  patterns.forEach((pattern) => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      fallacies.push({
        type: "ad_hominem",
        description: FALLACY_DESCRIPTIONS.ad_hominem,
        location: match[0],
        severity: "high",
      });
    }
  });

  return fallacies;
}

export function detectStrawMan(text: string): LogicalFallacy[] {
  const fallacies: LogicalFallacy[] = [];

  const patterns = [
    /\bso\s+you're\s+saying\s+(that\s+)?[^.!?]+\?/gi,
    /\byou\s+(claim|believe|think)\s+that\s+[^.!?]+\s+which\s+is\s+(absurd|ridiculous|wrong)/gi,
    /\bin\s+other\s+words,?\s+you\s+want\s+[^.!?]+/gi,
  ];

  patterns.forEach((pattern) => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      fallacies.push({
        type: "straw_man",
        description: FALLACY_DESCRIPTIONS.straw_man,
        location: match[0],
        severity: "high",
      });
    }
  });

  return fallacies;
}

export function detectFalseDilemma(text: string): LogicalFallacy[] {
  const fallacies: LogicalFallacy[] = [];

  const patterns = [
    /\b(either|only)\s+\w+\s+or\s+\w+\b/gi,
    /\bthere\s+are\s+(only\s+)?two\s+(options|choices|possibilities)\b/gi,
    /\byou\s+(must|have to)\s+choose\s+between\b/gi,
  ];

  patterns.forEach((pattern) => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      fallacies.push({
        type: "false_dilemma",
        description: FALLACY_DESCRIPTIONS.false_dilemma,
        location: match[0],
        severity: "medium",
      });
    }
  });

  return fallacies;
}

export function detectSlipperySlope(text: string): LogicalFallacy[] {
  const fallacies: LogicalFallacy[] = [];

  const patterns = [
    /\bif\s+we\s+\w+\s+[^,]+,\s+then\s+\w+\s+will\s+\w+\s+[^,]+,\s+(and\s+)?then/gi,
    /\bthis\s+will\s+lead\s+to\s+[^,]+,\s+(which\s+will|and\s+then)/gi,
    /\bonce\s+we\s+start\s+[^,]+,\s+there's\s+no\s+(stopping|going back)/gi,
  ];

  patterns.forEach((pattern) => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      fallacies.push({
        type: "slippery_slope",
        description: FALLACY_DESCRIPTIONS.slippery_slope,
        location: match[0],
        severity: "medium",
      });
    }
  });

  return fallacies;
}

export function detectCircularReasoning(text: string): LogicalFallacy[] {
  const fallacies: LogicalFallacy[] = [];

  const patterns = [
    /\b(\w+)\s+is\s+true\s+because\s+\1\b/gi,
    /\bwe\s+know\s+\w+\s+because\s+\w+\s+tells\s+us\s+(so|that)/gi,
    /\bit's\s+(right|true)\s+because\s+it's\s+(right|true)/gi,
  ];

  patterns.forEach((pattern) => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      fallacies.push({
        type: "circular_reasoning",
        description: FALLACY_DESCRIPTIONS.circular_reasoning,
        location: match[0],
        severity: "high",
      });
    }
  });

  return fallacies;
}

export function detectAppealToAuthority(text: string): LogicalFallacy[] {
  const fallacies: LogicalFallacy[] = [];

  const patterns = [
    /\b(experts|scientists|doctors|scholars)\s+say\s+[^.!?]+\s+(so\s+it\s+must\s+be|therefore\s+it's)/gi,
    /\baccording\s+to\s+\w+,?\s+who\s+is\s+(an\s+)?expert/gi,
  ];

  patterns.forEach((pattern) => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (!match[0].includes("study") && !match[0].includes("research")) {
        fallacies.push({
          type: "appeal_to_authority",
          description: FALLACY_DESCRIPTIONS.appeal_to_authority,
          location: match[0],
          severity: "medium",
        });
      }
    }
  });

  return fallacies;
}

export function detectRedHerring(text: string): LogicalFallacy[] {
  const fallacies: LogicalFallacy[] = [];

  const patterns = [
    /\bbut\s+what\s+about\s+[^?]+\?/gi,
    /\bthe\s+real\s+issue\s+is\s+[^.!?]+\s+not\s+\w+/gi,
  ];

  patterns.forEach((pattern) => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      fallacies.push({
        type: "red_herring",
        description: FALLACY_DESCRIPTIONS.red_herring,
        location: match[0],
        severity: "low",
      });
    }
  });

  return fallacies;
}

export function detectBandwagon(text: string): LogicalFallacy[] {
  const fallacies: LogicalFallacy[] = [];

  const patterns = [
    /\beveryone\s+(knows|agrees|believes)\s+(that\s+)?[^.!?]+/gi,
    /\bmost\s+people\s+(think|say|believe)\s+[^.!?]+\s+(so\s+it\s+must|therefore)/gi,
    /\b(the\s+)?majority\s+(of\s+people\s+)?can't\s+be\s+wrong/gi,
  ];

  patterns.forEach((pattern) => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      fallacies.push({
        type: "bandwagon",
        description: FALLACY_DESCRIPTIONS.bandwagon,
        location: match[0],
        severity: "medium",
      });
    }
  });

  return fallacies;
}

export function detectHastyGeneralization(text: string): LogicalFallacy[] {
  const fallacies: LogicalFallacy[] = [];

  const patterns = [
    /\bI\s+(know|met|saw)\s+(one|a)\s+\w+\s+who\s+[^,]+,\s+(so|therefore)\s+all\s+\w+/gi,
    /\b(this|that)\s+happened\s+(once|twice),?\s+(so|therefore|which\s+means)\s+(all|every)/gi,
  ];

  patterns.forEach((pattern) => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      fallacies.push({
        type: "hasty_generalization",
        description: FALLACY_DESCRIPTIONS.hasty_generalization,
        location: match[0],
        severity: "high",
      });
    }
  });

  return fallacies;
}

export function detectPostHoc(text: string): LogicalFallacy[] {
  const fallacies: LogicalFallacy[] = [];

  const patterns = [
    /\bafter\s+\w+\s+happened,\s+\w+\s+(happened|occurred),\s+(so|therefore)\s+\w+\s+caused/gi,
    /\bsince\s+\w+\s+started,\s+\w+\s+has\s+\w+,\s+(so|therefore|which\s+means)/gi,
  ];

  patterns.forEach((pattern) => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      fallacies.push({
        type: "post_hoc",
        description: FALLACY_DESCRIPTIONS.post_hoc,
        location: match[0],
        severity: "medium",
      });
    }
  });

  return fallacies;
}

export function detectAllFallacies(text: string): LogicalFallacy[] {
  const allFallacies: LogicalFallacy[] = [
    ...detectAdHominem(text),
    ...detectStrawMan(text),
    ...detectFalseDilemma(text),
    ...detectSlipperySlope(text),
    ...detectCircularReasoning(text),
    ...detectAppealToAuthority(text),
    ...detectRedHerring(text),
    ...detectBandwagon(text),
    ...detectHastyGeneralization(text),
    ...detectPostHoc(text),
  ];

  return allFallacies;
}

export function getFallacySeverityScore(
  fallacies: LogicalFallacy[]
): {
  totalFallacies: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
  penaltyScore: number;
} {
  const severityCounts = {
    high: fallacies.filter((f) => f.severity === "high").length,
    medium: fallacies.filter((f) => f.severity === "medium").length,
    low: fallacies.filter((f) => f.severity === "low").length,
  };

  const penaltyScore =
    severityCounts.high * 1.0 +
    severityCounts.medium * 0.5 +
    severityCounts.low * 0.25;

  return {
    totalFallacies: fallacies.length,
    highSeverity: severityCounts.high,
    mediumSeverity: severityCounts.medium,
    lowSeverity: severityCounts.low,
    penaltyScore: Math.round(penaltyScore * 100) / 100,
  };
}
