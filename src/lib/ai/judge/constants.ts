/**
 * AI Judge Constants
 */

export const AI_JUDGE_CONFIG = {
  MODEL: "claude-sonnet-4-5-20250929",
  TEMPERATURE: 0.3,
  MAX_TOKENS: 4096,
  ENABLE_FACT_CHECKING: true,
  ENABLE_FALLACY_DETECTION: true,
} as const;

export const SCORING_CRITERIA = {
  ARGUMENT_QUALITY: {
    weight: 0.3,
    description: "Logical coherence and strength of arguments",
  },
  REBUTTAL_STRENGTH: {
    weight: 0.25,
    description: "Effectiveness of counterarguments",
  },
  CLARITY: {
    weight: 0.2,
    description: "Clear communication and organization",
  },
  EVIDENCE: {
    weight: 0.15,
    description: "Quality and relevance of sources",
  },
  PERSUASIVENESS: {
    weight: 0.1,
    description: "Overall convincingness",
  },
} as const;

export const LOGICAL_FALLACIES = [
  "ad_hominem",
  "straw_man",
  "false_dilemma",
  "slippery_slope",
  "circular_reasoning",
  "appeal_to_authority",
  "red_herring",
  "bandwagon",
  "hasty_generalization",
  "post_hoc",
] as const;

export const FALLACY_DESCRIPTIONS: Record<string, string> = {
  ad_hominem: "Attacking the person instead of the argument",
  straw_man: "Misrepresenting opponent's argument",
  false_dilemma: "Presenting only two options when more exist",
  slippery_slope: "Claiming one action leads to extreme consequences",
  circular_reasoning: "Using conclusion as premise",
  appeal_to_authority: "Relying on authority without evidence",
  red_herring: "Introducing irrelevant topics",
  bandwagon: "Arguing something is true because it's popular",
  hasty_generalization: "Drawing conclusions from insufficient data",
  post_hoc: "Assuming causation from correlation",
};

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.8,
  MEDIUM: 0.6,
  LOW: 0.4,
} as const;
