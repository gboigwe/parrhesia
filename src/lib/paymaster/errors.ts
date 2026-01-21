/**
 * Paymaster Error Handling
 * Custom error types and handlers for paymaster operations
 */

/**
 * Paymaster error codes
 */
export enum PaymasterErrorCode {
  NOT_CONFIGURED = "PAYMASTER_NOT_CONFIGURED",
  REQUEST_FAILED = "PAYMASTER_REQUEST_FAILED",
  SPONSORSHIP_DENIED = "SPONSORSHIP_DENIED",
  INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
  INVALID_USER_OP = "INVALID_USER_OPERATION",
  GAS_LIMIT_EXCEEDED = "GAS_LIMIT_EXCEEDED",
  RATE_LIMIT = "RATE_LIMIT_EXCEEDED",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN = "UNKNOWN_ERROR",
}

/**
 * Custom paymaster error class
 */
export class PaymasterError extends Error {
  constructor(
    message: string,
    public code: PaymasterErrorCode,
    public details?: unknown
  ) {
    super(message);
    this.name = "PaymasterError";
  }
}

/**
 * User-friendly error messages
 */
const ERROR_MESSAGES: Record<PaymasterErrorCode, string> = {
  [PaymasterErrorCode.NOT_CONFIGURED]:
    "Gasless transactions are not configured. Please add NEXT_PUBLIC_PAYMASTER_URL to your environment.",
  [PaymasterErrorCode.REQUEST_FAILED]:
    "Unable to connect to paymaster service. Please try again.",
  [PaymasterErrorCode.SPONSORSHIP_DENIED]:
    "Transaction sponsorship was denied. You may need to pay gas fees manually.",
  [PaymasterErrorCode.INSUFFICIENT_FUNDS]:
    "Paymaster has insufficient funds to sponsor this transaction.",
  [PaymasterErrorCode.INVALID_USER_OP]:
    "Invalid transaction parameters. Please check your inputs.",
  [PaymasterErrorCode.GAS_LIMIT_EXCEEDED]:
    "Transaction requires too much gas to be sponsored.",
  [PaymasterErrorCode.RATE_LIMIT]:
    "Too many sponsored transactions. Please wait a moment and try again.",
  [PaymasterErrorCode.NETWORK_ERROR]:
    "Network error occurred. Please check your connection.",
  [PaymasterErrorCode.UNKNOWN]:
    "An unexpected error occurred. Please try again.",
};

/**
 * Get user-friendly error message
 */
export function getPaymasterErrorMessage(code: PaymasterErrorCode): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[PaymasterErrorCode.UNKNOWN];
}

/**
 * Parse error from paymaster response
 */
export function parsePaymasterError(error: unknown): PaymasterError {
  if (error instanceof PaymasterError) {
    return error;
  }

  const errorString = String(error).toLowerCase();

  if (errorString.includes("not configured") || errorString.includes("no paymaster")) {
    return new PaymasterError(
      getPaymasterErrorMessage(PaymasterErrorCode.NOT_CONFIGURED),
      PaymasterErrorCode.NOT_CONFIGURED,
      error
    );
  }

  if (errorString.includes("denied") || errorString.includes("rejected")) {
    return new PaymasterError(
      getPaymasterErrorMessage(PaymasterErrorCode.SPONSORSHIP_DENIED),
      PaymasterErrorCode.SPONSORSHIP_DENIED,
      error
    );
  }

  if (errorString.includes("insufficient")) {
    return new PaymasterError(
      getPaymasterErrorMessage(PaymasterErrorCode.INSUFFICIENT_FUNDS),
      PaymasterErrorCode.INSUFFICIENT_FUNDS,
      error
    );
  }

  if (errorString.includes("gas") && errorString.includes("limit")) {
    return new PaymasterError(
      getPaymasterErrorMessage(PaymasterErrorCode.GAS_LIMIT_EXCEEDED),
      PaymasterErrorCode.GAS_LIMIT_EXCEEDED,
      error
    );
  }

  if (errorString.includes("rate limit") || errorString.includes("too many")) {
    return new PaymasterError(
      getPaymasterErrorMessage(PaymasterErrorCode.RATE_LIMIT),
      PaymasterErrorCode.RATE_LIMIT,
      error
    );
  }

  if (errorString.includes("network") || errorString.includes("timeout")) {
    return new PaymasterError(
      getPaymasterErrorMessage(PaymasterErrorCode.NETWORK_ERROR),
      PaymasterErrorCode.NETWORK_ERROR,
      error
    );
  }

  return new PaymasterError(
    getPaymasterErrorMessage(PaymasterErrorCode.UNKNOWN),
    PaymasterErrorCode.UNKNOWN,
    error
  );
}

/**
 * Handle paymaster error with fallback
 */
export function handlePaymasterError(
  error: unknown,
  fallback?: () => void
): PaymasterError {
  const paymasterError = parsePaymasterError(error);

  console.error("Paymaster error:", {
    code: paymasterError.code,
    message: paymasterError.message,
    details: paymasterError.details,
  });

  // Execute fallback (e.g., switch to manual gas payment)
  if (fallback) {
    fallback();
  }

  return paymasterError;
}

/**
 * Check if error is retryable
 */
export function isRetryablePaymasterError(error: PaymasterError): boolean {
  const retryableCodes = [
    PaymasterErrorCode.REQUEST_FAILED,
    PaymasterErrorCode.NETWORK_ERROR,
    PaymasterErrorCode.RATE_LIMIT,
  ];

  return retryableCodes.includes(error.code);
}
