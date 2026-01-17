/**
 * AI Judge Evaluation Prompts
 * System and user prompts for Claude-based debate judging
 */

import { SCORING_CRITERIA, LOGICAL_FALLACIES, FALLACY_DESCRIPTIONS } from "./constants";
import type { DebateArgument } from "./types";

export const SYSTEM_PROMPT = `You are an expert debate judge with extensive experience in competitive debate, argumentation theory, and critical thinking. Your role is to provide impartial, rigorous analysis of debate arguments.

## Judging Criteria

Evaluate arguments across these weighted criteria:

1. **Argument Quality (30%)** - ${SCORING_CRITERIA.ARGUMENT_QUALITY.description}
   - Logical structure and coherence
   - Validity of reasoning
   - Depth of analysis

2. **Rebuttal Strength (25%)** - ${SCORING_CRITERIA.REBUTTAL_STRENGTH.description}
   - Direct engagement with opponent's points
   - Quality of counterarguments
   - Defensive responses

3. **Clarity (20%)** - ${SCORING_CRITERIA.CLARITY.description}
   - Organization and flow
   - Language precision
   - Accessibility of arguments

4. **Evidence (15%)** - ${SCORING_CRITERIA.EVIDENCE.description}
   - Source credibility
   - Relevance to claims
   - Proper citation

5. **Persuasiveness (10%)** - ${SCORING_CRITERIA.PERSUASIVENESS.description}
   - Rhetorical effectiveness
   - Emotional appeal appropriateness
   - Overall impact

## Logical Fallacies to Detect

Be vigilant for these common fallacies:
${LOGICAL_FALLACIES.map((f) => `- ${f}: ${FALLACY_DESCRIPTIONS[f]}`).join("\n")}

## Response Format

Provide analysis as JSON with:
- Individual scores (0-10) for each criterion
- Overall weighted score (0-10)
- Detailed explanation (2-3 paragraphs)
- List of strengths (3-5 points)
- List of weaknesses (3-5 points)
- Detected fallacies with locations
- Fact-check results for verifiable claims

## Principles

- Maintain strict impartiality
- Judge arguments on merit, not personal agreement
- Separate argument quality from topic opinion
- Reward intellectual honesty and nuance
- Penalize bad faith reasoning
- Consider context and debate format`;

export function generateArgumentPrompt(
  argument: DebateArgument,
  opponentArguments: DebateArgument[],
  debateContext: {
    topic: string;
    side: "creator" | "challenger";
    roundNumber: number;
  }
): string {
  const opponentSide = debateContext.side === "creator" ? "challenger" : "creator";

  return `## Debate Context

**Topic**: ${debateContext.topic}
**Debater Side**: ${debateContext.side}
**Round**: ${debateContext.roundNumber}

## Argument to Evaluate

${argument.content}

${argument.sources && argument.sources.length > 0 ? `**Sources Cited**:\n${argument.sources.map((s, i) => `${i + 1}. ${s}`).join("\n")}` : ""}

${opponentArguments.length > 0 ? `## Opponent's Arguments (${opponentSide})

${opponentArguments.map((arg, i) => `### Argument ${i + 1} (Round ${arg.roundNumber})
${arg.content}
${arg.sources?.length ? `Sources: ${arg.sources.join(", ")}` : ""}`).join("\n\n")}` : ""}

## Your Task

Analyze the argument above and provide:

1. **Scores** (0-10 for each criterion):
   - argumentQuality
   - rebuttalStrength (if applicable to this round)
   - clarity
   - evidence
   - persuasiveness

2. **Explanation**: 2-3 paragraph analysis of overall argument quality

3. **Strengths**: 3-5 specific strong points

4. **Weaknesses**: 3-5 specific areas for improvement

5. **Fallacies**: Any logical fallacies detected with specific quotes

6. **Fact Checks**: Verify factual claims if sources provided

Return response as valid JSON matching this structure:
\`\`\`json
{
  "argumentQuality": 8.5,
  "rebuttalStrength": 7.0,
  "clarity": 9.0,
  "evidence": 6.5,
  "persuasiveness": 8.0,
  "overallScore": 7.8,
  "explanation": "...",
  "strengths": ["...", "...", "..."],
  "weaknesses": ["...", "...", "..."],
  "fallaciesDetected": ["straw_man", "appeal_to_authority"],
  "factCheckResults": [
    {
      "claim": "...",
      "verdict": "true",
      "confidence": 0.85,
      "sources": ["..."]
    }
  ]
}
\`\`\``;
}

export function generateVerdictPrompt(
  creatorScore: number,
  challengerScore: number,
  creatorAnalysis: string,
  challengerAnalysis: string,
  debateTopic: string
): string {
  return `## Final Verdict Request

**Debate Topic**: ${debateTopic}

**Creator Overall Score**: ${creatorScore.toFixed(2)}/10
**Challenger Overall Score**: ${challengerScore.toFixed(2)}/10

**Creator Analysis Summary**:
${creatorAnalysis}

**Challenger Analysis Summary**:
${challengerAnalysis}

## Your Task

Determine the debate winner based on the overall scores and analysis quality. Provide:

1. **Winner**: "creator", "challenger", or "tie" (tie only if scores within 0.3 points)
2. **Reasoning**: 2-3 paragraph explanation of decision
3. **Confidence**: 0.0-1.0 confidence level in verdict

Consider:
- Score differential
- Consistency across rounds
- Quality of rebuttals
- Evidence strength
- Fallacy frequency

Return as JSON:
\`\`\`json
{
  "winner": "creator",
  "reasoning": "...",
  "confidence": 0.85
}
\`\`\``;
}
