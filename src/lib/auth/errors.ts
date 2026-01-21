/**
 * Authentication Error Handling
 */

export enum AuthErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  INVALID_SIGNATURE = "INVALID_SIGNATURE",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  WALLET_NOT_CONNECTED = "WALLET_NOT_CONNECTED",
  SIGNATURE_REJECTED = "SIGNATURE_REJECTED",
  UNKNOWN = "UNKNOWN",
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code: AuthErrorCode,
    public details?: unknown
  ) {
    super(message);
    this.name = "AuthError";
  }
}

const ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  [AuthErrorCode.UNAUTHORIZED]: "You must be signed in to perform this action",
  [AuthErrorCode.INVALID_SIGNATURE]: "Invalid wallet signature",
  [AuthErrorCode.SESSION_EXPIRED]: "Your session has expired. Please sign in again",
  [AuthErrorCode.WALLET_NOT_CONNECTED]: "Please connect your wallet first",
  [AuthErrorCode.SIGNATURE_REJECTED]: "Signature request was rejected",
  [AuthErrorCode.UNKNOWN]: "Authentication error occurred",
};

export function getAuthErrorMessage(code: AuthErrorCode): string {
  return ERROR_MESSAGES[code];
}

export function parseAuthError(error: unknown): AuthError {
  if (error instanceof AuthError) return error;

  const errorString = String(error).toLowerCase();

  if (errorString.includes("unauthorized")) {
    return new AuthError(
      getAuthErrorMessage(AuthErrorCode.UNAUTHORIZED),
      AuthErrorCode.UNAUTHORIZED,
      error
    );
  }

  if (errorString.includes("signature")) {
    return new AuthError(
      getAuthErrorMessage(AuthErrorCode.INVALID_SIGNATURE),
      AuthErrorCode.INVALID_SIGNATURE,
      error
    );
  }

  if (errorString.includes("expired")) {
    return new AuthError(
      getAuthErrorMessage(AuthErrorCode.SESSION_EXPIRED),
      AuthErrorCode.SESSION_EXPIRED,
      error
    );
  }

  return new AuthError(
    getAuthErrorMessage(AuthErrorCode.UNKNOWN),
    AuthErrorCode.UNKNOWN,
    error
  );
}
