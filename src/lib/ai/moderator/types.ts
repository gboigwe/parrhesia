/**
 * AI Moderator Type Definitions
 */

export interface ModerationConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  enableProfanityFilter: boolean;
  enableHateSpeechDetection: boolean;
  enableSpamDetection: boolean;
  enableAttackDetection: boolean;
}

export interface ContentAnalysis {
  isAppropriate: boolean;
  confidence: number;
  violations: ViolationType[];
  severity: "low" | "medium" | "high" | "critical";
  explanation: string;
  suggestedAction: ModerationAction;
  sanitizedContent?: string;
}

export type ViolationType =
  | "profanity"
  | "hate_speech"
  | "personal_attack"
  | "spam"
  | "gibberish"
  | "off_topic"
  | "threatening"
  | "explicit_content"
  | "harassment";

export type ModerationAction =
  | "allow"
  | "warn"
  | "flag"
  | "block"
  | "require_review";

export interface ModerationResult {
  contentId: string;
  userId: string;
  content: string;
  analysis: ContentAnalysis;
  action: ModerationAction;
  moderatedAt: Date;
  appealable: boolean;
}

export interface UserWarning {
  id: string;
  userId: string;
  violation: ViolationType;
  contentId: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  issuedAt: Date;
  acknowledged: boolean;
}

export interface ModerationAppeal {
  id: string;
  userId: string;
  moderationResultId: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  reviewedAt?: Date;
  reviewerNotes?: string;
}

export interface ModerationStats {
  totalChecks: number;
  blocked: number;
  warned: number;
  flagged: number;
  falsePositives: number;
  accuracy: number;
  violationBreakdown: Record<ViolationType, number>;
}

export interface ContentFlag {
  id: string;
  contentId: string;
  reportedBy: string;
  reason: ViolationType;
  description: string;
  status: "pending" | "confirmed" | "dismissed";
  createdAt: Date;
}
