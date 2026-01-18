/**
 * Retry Mechanism for Failed Claims
 */

import { RETRY_CONFIG } from "./constants";
import { isRetryableError, PrizeClaimError } from "./errors";

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number;
    initialDelay?: number;
    backoffMultiplier?: number;
    maxDelay?: number;
  }
): Promise<T> {
  const maxRetries = options?.maxRetries ?? RETRY_CONFIG.MAX_RETRIES;
  const initialDelay = options?.initialDelay ?? RETRY_CONFIG.INITIAL_DELAY;
  const backoffMultiplier = options?.backoffMultiplier ?? RETRY_CONFIG.BACKOFF_MULTIPLIER;
  const maxDelay = options?.maxDelay ?? RETRY_CONFIG.MAX_DELAY;

  let lastError: Error | undefined;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (
        attempt === maxRetries ||
        (error instanceof PrizeClaimError && !isRetryableError(error))
      ) {
        throw error;
      }

      await sleep(Math.min(delay, maxDelay));
      delay *= backoffMultiplier;

      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
    }
  }

  throw lastError || new Error("Max retries exceeded");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retryClaimTransaction<T>(
  claimFn: () => Promise<T>
): Promise<T> {
  return retryWithBackoff(claimFn, {
    maxRetries: 3,
    initialDelay: 2000,
    backoffMultiplier: 2,
    maxDelay: 10000,
  });
}

export async function retryVerification<T>(
  verifyFn: () => Promise<T>
): Promise<T> {
  return retryWithBackoff(verifyFn, {
    maxRetries: 5,
    initialDelay: 1000,
    backoffMultiplier: 1.5,
    maxDelay: 5000,
  });
}
