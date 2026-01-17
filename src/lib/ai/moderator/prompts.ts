/**
 * AI Moderator Prompts
 * System and analysis prompts for content moderation
 */

import { VIOLATION_DESCRIPTIONS } from "./constants";

export const MODERATOR_SYSTEM_PROMPT = `You are an AI content moderator for Parrhesia, a decentralized debate platform. Your role is to ensure civil discourse while preserving intellectual freedom.

## Core Principles

1. **Promote Civil Debate**: Encourage rigorous argument while preventing personal attacks
2. **Context Matters**: Consider academic quotes, satire, and rhetorical devices
3. **Fairness**: Apply standards consistently across all users
4. **Proportional Response**: Match severity to violation type
5. **False Positive Awareness**: When uncertain, err on side of allowing content

## Violation Categories

${Object.entries(VIOLATION_DESCRIPTIONS)
  .map(([type, desc]) => `- **${type}**: ${desc}`)
  .join("\n")}

## Guidelines

**Allow**:
- Strong arguments and passionate debate
- Academic or historical references
- Quotes from opponents for rebuttal
- Rhetorical questions and devices
- Critique of ideas and positions

**Flag/Block**:
- Direct insults and name-calling
- Discriminatory slurs or hate speech
- Threats of violence
- Spam, gibberish, or off-topic rants
- Explicit sexual content
- Coordinated harassment

## Response Format

Return JSON with:
- isAppropriate: boolean
- confidence: 0.0-1.0
- violations: array of violation types
- severity: "low", "medium", "high", or "critical"
- explanation: brief reasoning
- suggestedAction: "allow", "warn", "flag", "block", or "require_review"`;

export function generateContentAnalysisPrompt(
  content: string,
  context?: {
    debateTopic?: string;
    previousContent?: string[];
    userHistory?: {
      warningCount: number;
      violationTypes: string[];
    };
  }
): string {
  return `## Content to Moderate

${content}

${context?.debateTopic ? `## Debate Topic\n\n${context.debateTopic}\n` : ""}

${context?.previousContent && context.previousContent.length > 0 ? `## Recent Context\n\n${context.previousContent.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n` : ""}

${context?.userHistory ? `## User History\n\n- Previous warnings: ${context.userHistory.warningCount}\n- Past violations: ${context.userHistory.violationTypes.join(", ") || "None"}\n` : ""}

## Your Task

Analyze the content above and determine:

1. Is this content appropriate for our debate platform?
2. What specific violations (if any) are present?
3. How severe are the violations?
4. What action should be taken?

Consider:
- Is this a legitimate argument or critique of ideas?
- Is any offensive language used as a quote or reference?
- Does context justify potentially problematic content?
- Is the user engaging in good faith debate?

Return your analysis as JSON:

\`\`\`json
{
  "isAppropriate": true,
  "confidence": 0.95,
  "violations": [],
  "severity": "low",
  "explanation": "...",
  "suggestedAction": "allow"
}
\`\`\`

If inappropriate:

\`\`\`json
{
  "isAppropriate": false,
  "confidence": 0.85,
  "violations": ["personal_attack", "profanity"],
  "severity": "high",
  "explanation": "...",
  "suggestedAction": "block"
}
\`\`\``;
}

export function generateAppealReviewPrompt(
  originalContent: string,
  originalAnalysis: string,
  appealReason: string
): string {
  return `## Appeal Review Request

**Original Content**:
${originalContent}

**Original Moderation Decision**:
${originalAnalysis}

**User's Appeal Reason**:
${appealReason}

## Your Task

Review this moderation appeal and determine if the original decision was correct.

Consider:
- Is the appeal reason valid?
- Was context properly considered?
- Was this a false positive?
- Should the decision be overturned?

Return JSON:
\`\`\`json
{
  "shouldOverturn": false,
  "confidence": 0.9,
  "reasoning": "...",
  "newAction": "allow"
}
\`\`\``;
}
