/**
 * Moderation Utility Functions
 */

import type {
  ContentAnalysis,
  ModerationAction,
  ModerationStats,
  ViolationType,
} from "./types";
import { WARNING_MESSAGES } from "./constants";

export function getSeverityColor(
  severity: "low" | "medium" | "high" | "critical"
): string {
  const colors = {
    low: "text-yellow-600",
    medium: "text-orange-600",
    high: "text-red-600",
    critical: "text-red-800",
  };
  return colors[severity];
}

export function getSeverityBadge(
  severity: "low" | "medium" | "high" | "critical"
): string {
  const badges = {
    low: "bg-yellow-100 text-yellow-800",
    medium: "bg-orange-100 text-orange-800",
    high: "bg-red-100 text-red-800",
    critical: "bg-red-200 text-red-900",
  };
  return badges[severity];
}

export function getActionLabel(action: ModerationAction): string {
  const labels = {
    allow: "Allowed",
    warn: "Warning Issued",
    flag: "Flagged for Review",
    block: "Blocked",
    require_review: "Pending Review",
  };
  return labels[action];
}

export function getActionColor(action: ModerationAction): string {
  const colors = {
    allow: "text-green-600",
    warn: "text-yellow-600",
    flag: "text-orange-600",
    block: "text-red-600",
    require_review: "text-blue-600",
  };
  return colors[action];
}

export function getWarningMessage(violation: ViolationType): string {
  return WARNING_MESSAGES[violation] || "Your content violates community guidelines";
}

export function calculateModerationScore(analysis: ContentAnalysis): number {
  if (analysis.isAppropriate) {
    return 100;
  }

  let score = 100;

  const severityPenalties = {
    low: 10,
    medium: 25,
    high: 50,
    critical: 100,
  };

  score -= severityPenalties[analysis.severity];

  score -= analysis.violations.length * 10;

  return Math.max(score, 0);
}

export function shouldEscalate(
  userHistory: {
    warningCount: number;
    recentViolations: number;
    violationTypes: ViolationType[];
  },
  newViolation: ViolationType
): boolean {
  if (userHistory.warningCount >= 5) return true;

  if (userHistory.recentViolations >= 3) return true;

  const criticalViolations: ViolationType[] = [
    "hate_speech",
    "threatening",
    "harassment",
  ];
  if (criticalViolations.includes(newViolation)) return true;

  const repeatedViolation = userHistory.violationTypes.filter(
    (v) => v === newViolation
  ).length;
  if (repeatedViolation >= 2) return true;

  return false;
}

export function formatViolationType(violation: ViolationType): string {
  return violation
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function aggregateModerationStats(
  results: Array<{
    analysis: ContentAnalysis;
    action: ModerationAction;
  }>
): ModerationStats {
  const totalChecks = results.length;
  const blocked = results.filter((r) => r.action === "block").length;
  const warned = results.filter((r) => r.action === "warn").length;
  const flagged = results.filter((r) => r.action === "flag").length;

  const falsePositives = results.filter(
    (r) => r.analysis.isAppropriate && r.action !== "allow"
  ).length;

  const accuracy =
    totalChecks > 0 ? ((totalChecks - falsePositives) / totalChecks) * 100 : 0;

  const violationBreakdown: Record<ViolationType, number> = {
    profanity: 0,
    hate_speech: 0,
    personal_attack: 0,
    spam: 0,
    gibberish: 0,
    off_topic: 0,
    threatening: 0,
    explicit_content: 0,
    harassment: 0,
  };

  results.forEach((result) => {
    result.analysis.violations.forEach((violation) => {
      if (violation in violationBreakdown) {
        violationBreakdown[violation]++;
      }
    });
  });

  return {
    totalChecks,
    blocked,
    warned,
    flagged,
    falsePositives,
    accuracy: Math.round(accuracy * 100) / 100,
    violationBreakdown,
  };
}

export function isAppealWorthy(
  analysis: ContentAnalysis,
  action: ModerationAction
): boolean {
  if (action === "allow" || action === "warn") return false;

  if (analysis.confidence < 0.7) return true;

  if (analysis.violations.length === 1 && analysis.severity === "low")
    return true;

  return false;
}

export function generateModerationSummary(analysis: ContentAnalysis): string {
  if (analysis.isAppropriate) {
    return "Content approved - no violations detected";
  }

  const violationList = analysis.violations
    .map((v) => formatViolationType(v))
    .join(", ");

  return `${analysis.severity.toUpperCase()} severity: ${violationList}. ${analysis.explanation}`;
}
