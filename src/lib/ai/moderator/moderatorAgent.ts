/**
 * AI Moderator Agent
 * Core moderation logic using Claude for content analysis
 */

import Anthropic from "@anthropic-ai/sdk";
import { MODERATOR_CONFIG, ACTION_THRESHOLDS } from "./constants";
import {
  MODERATOR_SYSTEM_PROMPT,
  generateContentAnalysisPrompt,
} from "./prompts";
import { quickScan } from "./detectors";
import type { ContentAnalysis, ModerationAction } from "./types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeContent(
  content: string,
  context?: {
    debateTopic?: string;
    previousContent?: string[];
    userHistory?: {
      warningCount: number;
      violationTypes: string[];
    };
  }
): Promise<ContentAnalysis> {
  const preScan = quickScan(content);

  if (preScan.highestSeverity >= 0.8) {
    return {
      isAppropriate: false,
      confidence: preScan.highestSeverity,
      violations: preScan.violations,
      severity: "critical",
      explanation: "Automated detection flagged critical violations",
      suggestedAction: "block",
    };
  }

  const userPrompt = generateContentAnalysisPrompt(content, context);

  const message = await anthropic.messages.create({
    model: MODERATOR_CONFIG.MODEL,
    max_tokens: MODERATOR_CONFIG.MAX_TOKENS,
    temperature: MODERATOR_CONFIG.TEMPERATURE,
    system: MODERATOR_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
  const jsonContent = jsonMatch ? jsonMatch[1] : responseText;

  const analysis = JSON.parse(jsonContent);

  return {
    isAppropriate: analysis.isAppropriate,
    confidence: analysis.confidence,
    violations: analysis.violations || [],
    severity: analysis.severity || "low",
    explanation: analysis.explanation,
    suggestedAction: analysis.suggestedAction,
  };
}

export function determineModerationAction(
  analysis: ContentAnalysis,
  userHistory?: {
    warningCount: number;
    recentViolations: number;
  }
): ModerationAction {
  if (!analysis.isAppropriate) {
    if (analysis.confidence >= ACTION_THRESHOLDS.BLOCK) {
      return "block";
    }

    if (analysis.confidence >= ACTION_THRESHOLDS.REQUIRE_REVIEW) {
      return "require_review";
    }

    if (
      userHistory &&
      userHistory.warningCount >= 3 &&
      analysis.confidence >= ACTION_THRESHOLDS.FLAG
    ) {
      return "block";
    }

    if (analysis.confidence >= ACTION_THRESHOLDS.FLAG) {
      return "flag";
    }

    if (analysis.confidence >= ACTION_THRESHOLDS.WARN) {
      return "warn";
    }
  }

  return "allow";
}

export async function moderateContent(
  contentId: string,
  userId: string,
  content: string,
  context?: {
    debateTopic?: string;
    previousContent?: string[];
    userHistory?: {
      warningCount: number;
      violationTypes: string[];
      recentViolations: number;
    };
  }
) {
  const analysis = await analyzeContent(content, context);

  const action = determineModerationAction(analysis, context?.userHistory);

  return {
    contentId,
    userId,
    content,
    analysis,
    action,
    moderatedAt: new Date(),
    appealable: action === "block" || action === "flag",
  };
}
