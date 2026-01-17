/**
 * AI Judge Type Definitions
 */

export interface AIJudgeConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  enableFactChecking: boolean;
  enableFallacyDetection: boolean;
}

export interface DebateArgument {
  id: string;
  content: string;
  userId: string;
  side: "creator" | "challenger";
  roundNumber: number;
  sources?: string[];
  createdAt: Date;
}

export interface AIJudgeAnalysis {
  argumentQuality: number;
  rebuttalStrength: number;
  clarity: number;
  evidence: number;
  persuasiveness: number;
  overallScore: number;
  explanation: string;
  strengths: string[];
  weaknesses: string[];
  fallaciesDetected: string[];
  factCheckResults?: FactCheckResult[];
}

export interface FactCheckResult {
  claim: string;
  verdict: "true" | "false" | "partially_true" | "unverified";
  confidence: number;
  sources: string[];
}

export interface AIJudgeVerdict {
  debateId: string;
  winner: "creator" | "challenger" | "tie";
  creatorAnalysis: AIJudgeAnalysis;
  challengerAnalysis: AIJudgeAnalysis;
  reasoning: string;
  confidence: number;
  judgedAt: Date;
}

export interface LogicalFallacy {
  type: string;
  description: string;
  location: string;
  severity: "low" | "medium" | "high";
}
