/**
 * AI Judge Argument Analyzer
 * Core logic for analyzing debate arguments with Claude
 */

import Anthropic from "@anthropic-ai/sdk";
import { AI_JUDGE_CONFIG } from "./constants";
import { SYSTEM_PROMPT, generateArgumentPrompt } from "./prompts";
import type { DebateArgument, AIJudgeAnalysis } from "./types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeArgument(
  argument: DebateArgument,
  opponentArguments: DebateArgument[],
  debateContext: {
    topic: string;
    side: "creator" | "challenger";
    roundNumber: number;
  }
): Promise<AIJudgeAnalysis> {
  const userPrompt = generateArgumentPrompt(
    argument,
    opponentArguments,
    debateContext
  );

  const message = await anthropic.messages.create({
    model: AI_JUDGE_CONFIG.MODEL,
    max_tokens: AI_JUDGE_CONFIG.MAX_TOKENS,
    temperature: AI_JUDGE_CONFIG.TEMPERATURE,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const responseText = message.content[0].type === "text"
    ? message.content[0].text
    : "";

  const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
  const jsonContent = jsonMatch ? jsonMatch[1] : responseText;

  const analysis = JSON.parse(jsonContent);

  return {
    argumentQuality: analysis.argumentQuality,
    rebuttalStrength: analysis.rebuttalStrength,
    clarity: analysis.clarity,
    evidence: analysis.evidence,
    persuasiveness: analysis.persuasiveness,
    overallScore: analysis.overallScore,
    explanation: analysis.explanation,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    fallaciesDetected: analysis.fallaciesDetected || [],
    factCheckResults: analysis.factCheckResults || [],
  };
}

export async function analyzeBothSides(
  creatorArguments: DebateArgument[],
  challengerArguments: DebateArgument[],
  debateTopic: string
): Promise<{
  creatorAnalysis: AIJudgeAnalysis;
  challengerAnalysis: AIJudgeAnalysis;
}> {
  const latestCreatorArg = creatorArguments[creatorArguments.length - 1];
  const latestChallengerArg = challengerArguments[challengerArguments.length - 1];

  const [creatorAnalysis, challengerAnalysis] = await Promise.all([
    analyzeArgument(latestCreatorArg, challengerArguments, {
      topic: debateTopic,
      side: "creator",
      roundNumber: latestCreatorArg.roundNumber,
    }),
    analyzeArgument(latestChallengerArg, creatorArguments, {
      topic: debateTopic,
      side: "challenger",
      roundNumber: latestChallengerArg.roundNumber,
    }),
  ]);

  return { creatorAnalysis, challengerAnalysis };
}

export async function analyzeAllRounds(
  creatorArguments: DebateArgument[],
  challengerArguments: DebateArgument[],
  debateTopic: string
): Promise<{
  creatorAnalyses: AIJudgeAnalysis[];
  challengerAnalyses: AIJudgeAnalysis[];
}> {
  const creatorAnalyses: AIJudgeAnalysis[] = [];
  const challengerAnalyses: AIJudgeAnalysis[] = [];

  for (let i = 0; i < creatorArguments.length; i++) {
    const creatorArg = creatorArguments[i];
    const relevantChallengerArgs = challengerArguments.filter(
      (arg) => arg.roundNumber <= creatorArg.roundNumber
    );

    const analysis = await analyzeArgument(creatorArg, relevantChallengerArgs, {
      topic: debateTopic,
      side: "creator",
      roundNumber: creatorArg.roundNumber,
    });

    creatorAnalyses.push(analysis);
  }

  for (let i = 0; i < challengerArguments.length; i++) {
    const challengerArg = challengerArguments[i];
    const relevantCreatorArgs = creatorArguments.filter(
      (arg) => arg.roundNumber <= challengerArg.roundNumber
    );

    const analysis = await analyzeArgument(
      challengerArg,
      relevantCreatorArgs,
      {
        topic: debateTopic,
        side: "challenger",
        roundNumber: challengerArg.roundNumber,
      }
    );

    challengerAnalyses.push(analysis);
  }

  return { creatorAnalyses, challengerAnalyses };
}
