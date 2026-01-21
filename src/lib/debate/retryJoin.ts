/**
 * Retry Join Transaction Logic
 * Handles retry with exponential backoff
 */

export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

export async function retryJoinTransaction<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const { maxRetries, initialDelay, maxDelay, backoffMultiplier } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config,
  };

  let delay = initialDelay;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        break;
      }

      if (!isRetryableError(error)) {
        throw error;
      }

      await sleep(Math.min(delay, maxDelay));
      delay *= backoffMultiplier;
    }
  }

  throw lastError;
}

function isRetryableError(error: unknown): boolean {
  const errorString = String(error).toLowerCase();

  const nonRetryablePatterns = [
    "insufficient balance",
    "already joined",
    "not pending",
    "expired",
    "user rejected",
    "user denied",
  ];

  return !nonRetryablePatterns.some((pattern) =>
    errorString.includes(pattern)
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
