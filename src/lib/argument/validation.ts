import { DEBATE_CONFIG } from "@/lib/constants";

export interface ArgumentValidationError {
  field: string;
  message: string;
}

/**
 * Validate argument content
 */
export function validateArgument(content: string): ArgumentValidationError[] {
  const errors: ArgumentValidationError[] = [];

  if (!content || !content.trim()) {
    errors.push({ field: "content", message: "Argument content is required" });
    return errors;
  }

  const words = content.trim().split(/\s+/).filter((word) => word.length > 0);
  const wordCount = words.length;

  if (wordCount < DEBATE_CONFIG.MIN_ARGUMENT_LENGTH) {
    errors.push({
      field: "content",
      message: `Argument must be at least ${DEBATE_CONFIG.MIN_ARGUMENT_LENGTH} words`,
    });
  }

  if (wordCount > DEBATE_CONFIG.MAX_ARGUMENT_LENGTH) {
    errors.push({
      field: "content",
      message: `Argument must not exceed ${DEBATE_CONFIG.MAX_ARGUMENT_LENGTH} words`,
    });
  }

  return errors;
}

/**
 * Count words in content
 */
export function countWords(content: string): number {
  if (!content || !content.trim()) return 0;
  return content.trim().split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Check if user can submit argument (turn-based logic)
 */
export function canSubmitArgument(
  userId: string,
  creatorId: string,
  challengerId: string | null | undefined,
  arguments: any[]
): { canSubmit: boolean; reason?: string } {
  if (!challengerId) {
    return { canSubmit: false, reason: "Waiting for opponent to join" };
  }

  if (userId !== creatorId && userId !== challengerId) {
    return { canSubmit: false, reason: "Only debate participants can submit arguments" };
  }

  // Get last argument
  const lastArg = arguments.length > 0 ? arguments[arguments.length - 1] : null;

  // If no arguments yet, creator goes first
  if (!lastArg) {
    if (userId === creatorId) {
      return { canSubmit: true };
    }
    return { canSubmit: false, reason: "Waiting for creator to submit first argument" };
  }

  // Turn-based: if last argument was from this user, they must wait
  if (lastArg.userId === userId) {
    return { canSubmit: false, reason: "Wait for opponent's response" };
  }

  return { canSubmit: true };
}

/**
 * Get next round number for user
 */
export function getNextRoundNumber(userId: string, arguments: any[]): number {
  const userArgs = arguments.filter((arg) => arg.userId === userId);
  return userArgs.length + 1;
}

/**
 * Check if debate has minimum arguments for voting
 */
export function hasMinimumArguments(arguments: any[], minPerUser: number = 2): boolean {
  if (arguments.length === 0) return false;

  const userIds = [...new Set(arguments.map((arg) => arg.userId))];
  if (userIds.length < 2) return false;

  return userIds.every((userId) => {
    const userArgs = arguments.filter((arg) => arg.userId === userId);
    return userArgs.length >= minPerUser;
  });
}
