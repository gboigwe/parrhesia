/**
 * Argument utility functions
 */

/**
 * Extract citations from argument content
 */
export function extractCitations(content: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = content.match(urlRegex);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Calculate argument reading time
 */
export function getReadingTime(wordCount: number): string {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Format argument timestamp
 */
export function formatArgumentTime(postedAt: Date): string {
  const now = new Date();
  const posted = new Date(postedAt);
  const diffMs = now.getTime() - posted.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return posted.toLocaleDateString();
}

/**
 * Truncate argument preview
 */
export function truncateContent(content: string, maxLength: number = 200): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + "...";
}

/**
 * Check if argument has citations
 */
export function hasCitations(content: string): boolean {
  return extractCitations(content).length > 0;
}

/**
 * Get argument quality score (basic heuristic)
 */
export function getArgumentQuality(content: string, wordCount: number): {
  score: number;
  factors: string[];
} {
  const factors: string[] = [];
  let score = 50; // Base score

  // Word count factor
  if (wordCount >= 300 && wordCount <= 600) {
    score += 10;
    factors.push("Good length");
  } else if (wordCount < 200) {
    score -= 10;
    factors.push("Too brief");
  }

  // Citations factor
  if (hasCitations(content)) {
    score += 15;
    factors.push("Includes sources");
  }

  // Paragraph structure
  const paragraphs = content.split("\n\n").filter((p) => p.trim().length > 0);
  if (paragraphs.length >= 3) {
    score += 10;
    factors.push("Well structured");
  }

  // Question marks (engagement)
  const questions = (content.match(/\?/g) || []).length;
  if (questions > 0 && questions <= 3) {
    score += 5;
    factors.push("Engaging");
  }

  return { score: Math.min(100, Math.max(0, score)), factors };
}
