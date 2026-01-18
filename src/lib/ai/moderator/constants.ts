/**
 * AI Moderator Constants
 */

export const MODERATOR_CONFIG = {
  MODEL: "claude-sonnet-4-5-20250929",
  TEMPERATURE: 0.2,
  MAX_TOKENS: 2048,
  ENABLE_PROFANITY_FILTER: true,
  ENABLE_HATE_SPEECH_DETECTION: true,
  ENABLE_SPAM_DETECTION: true,
  ENABLE_ATTACK_DETECTION: true,
} as const;

export const VIOLATION_TYPES = {
  PROFANITY: "profanity",
  HATE_SPEECH: "hate_speech",
  PERSONAL_ATTACK: "personal_attack",
  SPAM: "spam",
  GIBBERISH: "gibberish",
  OFF_TOPIC: "off_topic",
  THREATENING: "threatening",
  EXPLICIT_CONTENT: "explicit_content",
  HARASSMENT: "harassment",
} as const;

export const VIOLATION_DESCRIPTIONS: Record<string, string> = {
  profanity: "Contains inappropriate or offensive language",
  hate_speech: "Contains discriminatory or hateful content",
  personal_attack: "Attacks the person rather than their argument",
  spam: "Low-quality, repetitive, or irrelevant content",
  gibberish: "Unintelligible or nonsensical text",
  off_topic: "Not relevant to the debate topic",
  threatening: "Contains threats or violent language",
  explicit_content: "Contains sexually explicit material",
  harassment: "Constitutes harassment or bullying",
};

export const SEVERITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export const SEVERITY_THRESHOLDS = {
  CRITICAL: 0.9,
  HIGH: 0.7,
  MEDIUM: 0.5,
  LOW: 0.3,
} as const;

export const MODERATION_ACTIONS = {
  ALLOW: "allow",
  WARN: "warn",
  FLAG: "flag",
  BLOCK: "block",
  REQUIRE_REVIEW: "require_review",
} as const;

export const ACTION_THRESHOLDS = {
  BLOCK: 0.8,
  REQUIRE_REVIEW: 0.6,
  FLAG: 0.5,
  WARN: 0.3,
} as const;

export const PROFANITY_PATTERNS = [
  /\bf+u+c+k+/gi,
  /\bs+h+i+t+/gi,
  /\ba+s+s+h+o+l+e+/gi,
  /\bb+i+t+c+h+/gi,
  /\bd+a+m+n+/gi,
  /\bc+r+a+p+/gi,
];

export const SPAM_INDICATORS = {
  MIN_WORD_COUNT: 10,
  MAX_REPETITION_RATIO: 0.5,
  MAX_CAPS_RATIO: 0.7,
  MAX_SPECIAL_CHAR_RATIO: 0.3,
  MIN_UNIQUE_WORDS: 5,
} as const;

export const WARNING_MESSAGES = {
  profanity: "Your content contains inappropriate language",
  hate_speech: "Your content contains hateful or discriminatory language",
  personal_attack:
    "Please focus on arguments, not personal attacks",
  spam: "Your content appears to be spam or low quality",
  gibberish: "Your content is not intelligible",
  off_topic: "Please keep your arguments relevant to the debate topic",
  threatening: "Threatening language is not allowed",
  explicit_content: "Explicit content is not permitted",
  harassment: "Harassment and bullying are not tolerated",
} as const;

export const APPEAL_REASONS = [
  "False positive - content is appropriate",
  "Context was misunderstood",
  "Technical error in detection",
  "Quote or reference to violation",
  "Satire or rhetorical device",
] as const;
