/**
 * Content Detection Utilities
 * Pattern-based detection for various content violations
 */

import { PROFANITY_PATTERNS, SPAM_INDICATORS } from "./constants";
import type { ViolationType } from "./types";

export function detectProfanity(text: string): {
  found: boolean;
  matches: string[];
  severity: number;
} {
  const matches: string[] = [];

  PROFANITY_PATTERNS.forEach((pattern) => {
    const found = text.match(pattern);
    if (found) {
      matches.push(...found);
    }
  });

  const severity = Math.min(matches.length * 0.2, 1.0);

  return {
    found: matches.length > 0,
    matches: Array.from(new Set(matches)),
    severity,
  };
}

export function detectPersonalAttacks(text: string): {
  found: boolean;
  patterns: string[];
  severity: number;
} {
  const attackPatterns = [
    /\byou'?re\s+(stupid|ignorant|dumb|idiot|moron)\b/gi,
    /\bshut\s+up\b/gi,
    /\byou\s+don't\s+know\s+(anything|what|how)/gi,
    /\bstop\s+being\s+(stupid|dumb|ignorant)/gi,
    /\byour\s+(lack|limited)\s+of\s+(intelligence|brain)/gi,
  ];

  const matches: string[] = [];

  attackPatterns.forEach((pattern) => {
    const found = text.matchAll(pattern);
    for (const match of found) {
      matches.push(match[0]);
    }
  });

  return {
    found: matches.length > 0,
    patterns: matches,
    severity: Math.min(matches.length * 0.3, 1.0),
  };
}

export function detectHateSpeech(text: string): {
  found: boolean;
  categories: string[];
  severity: number;
} {
  const hateSpeechIndicators = [
    /\b(n|N)\*+(g|G)+(a|A)\b/gi,
    /\b(f|F)\*+(g|G)+(o|O)+(t|T)\b/gi,
    /\b(all|every)\s+(blacks|whites|jews|muslims|gays)\s+are\b/gi,
    /\b(inferior|superior)\s+(race|people)\b/gi,
    /\bdeport\s+(all|them)\b/gi,
  ];

  const categories: string[] = [];
  let matchCount = 0;

  hateSpeechIndicators.forEach((pattern, index) => {
    if (pattern.test(text)) {
      categories.push(`pattern_${index}`);
      matchCount++;
    }
  });

  return {
    found: categories.length > 0,
    categories,
    severity: matchCount > 0 ? 1.0 : 0,
  };
}

export function detectSpam(text: string): {
  isSpam: boolean;
  indicators: string[];
  score: number;
} {
  const indicators: string[] = [];
  let spamScore = 0;

  const words = text.split(/\s+/);
  const wordCount = words.length;

  if (wordCount < SPAM_INDICATORS.MIN_WORD_COUNT) {
    indicators.push("too_short");
    spamScore += 0.3;
  }

  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
  if (uniqueWords.size < SPAM_INDICATORS.MIN_UNIQUE_WORDS) {
    indicators.push("low_uniqueness");
    spamScore += 0.4;
  }

  const repetitionRatio =
    wordCount > 0 ? 1 - uniqueWords.size / wordCount : 0;
  if (repetitionRatio > SPAM_INDICATORS.MAX_REPETITION_RATIO) {
    indicators.push("high_repetition");
    spamScore += 0.5;
  }

  const uppercaseCount = (text.match(/[A-Z]/g) || []).length;
  const capsRatio = uppercaseCount / text.length;
  if (capsRatio > SPAM_INDICATORS.MAX_CAPS_RATIO) {
    indicators.push("excessive_caps");
    spamScore += 0.3;
  }

  const specialChars = (text.match(/[!@#$%^&*()]/g) || []).length;
  const specialRatio = specialChars / text.length;
  if (specialRatio > SPAM_INDICATORS.MAX_SPECIAL_CHAR_RATIO) {
    indicators.push("excessive_special_chars");
    spamScore += 0.2;
  }

  return {
    isSpam: spamScore >= 0.5,
    indicators,
    score: Math.min(spamScore, 1.0),
  };
}

export function detectGibberish(text: string): {
  isGibberish: boolean;
  confidence: number;
} {
  const words = text.split(/\s+/);

  let gibberishScore = 0;

  const avgWordLength =
    words.reduce((sum, w) => sum + w.length, 0) / words.length;
  if (avgWordLength < 2 || avgWordLength > 15) {
    gibberishScore += 0.3;
  }

  const consonantClusters = (
    text.match(/[bcdfghjklmnpqrstvwxyz]{5,}/gi) || []
  ).length;
  if (consonantClusters > 2) {
    gibberishScore += 0.4;
  }

  const vowelRatio = (text.match(/[aeiou]/gi) || []).length / text.length;
  if (vowelRatio < 0.2 || vowelRatio > 0.7) {
    gibberishScore += 0.3;
  }

  return {
    isGibberish: gibberishScore >= 0.5,
    confidence: Math.min(gibberishScore, 1.0),
  };
}

export function detectThreats(text: string): {
  found: boolean;
  patterns: string[];
  severity: number;
} {
  const threatPatterns = [
    /\b(kill|hurt|harm|attack|destroy)\s+you\b/gi,
    /\bI'?ll\s+(kill|hurt|harm|destroy)\b/gi,
    /\bwatch\s+your\s+back\b/gi,
    /\byou'?re\s+(dead|finished|done)\b/gi,
  ];

  const matches: string[] = [];

  threatPatterns.forEach((pattern) => {
    const found = text.matchAll(pattern);
    for (const match of found) {
      matches.push(match[0]);
    }
  });

  return {
    found: matches.length > 0,
    patterns: matches,
    severity: matches.length > 0 ? 1.0 : 0,
  };
}

export function quickScan(text: string): {
  violations: ViolationType[];
  highestSeverity: number;
} {
  const violations: ViolationType[] = [];
  let highestSeverity = 0;

  const profanity = detectProfanity(text);
  if (profanity.found) {
    violations.push("profanity");
    highestSeverity = Math.max(highestSeverity, profanity.severity);
  }

  const attacks = detectPersonalAttacks(text);
  if (attacks.found) {
    violations.push("personal_attack");
    highestSeverity = Math.max(highestSeverity, attacks.severity);
  }

  const hate = detectHateSpeech(text);
  if (hate.found) {
    violations.push("hate_speech");
    highestSeverity = Math.max(highestSeverity, hate.severity);
  }

  const spam = detectSpam(text);
  if (spam.isSpam) {
    violations.push("spam");
    highestSeverity = Math.max(highestSeverity, spam.score);
  }

  const gibberish = detectGibberish(text);
  if (gibberish.isGibberish) {
    violations.push("gibberish");
    highestSeverity = Math.max(highestSeverity, gibberish.confidence);
  }

  const threats = detectThreats(text);
  if (threats.found) {
    violations.push("threatening");
    highestSeverity = Math.max(highestSeverity, threats.severity);
  }

  return {
    violations,
    highestSeverity,
  };
}
