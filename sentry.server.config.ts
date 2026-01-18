/**
 * Sentry Server Configuration
 * Error tracking for server-side
 */

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    beforeSend(event, hint) {
      if (event.exception) {
        console.error(hint.originalException || hint.syntheticException);
      }
      return event;
    },
  });
}
