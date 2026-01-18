/**
 * Sentry Client Configuration
 * Error tracking for browser
 */

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    integrations: [
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    beforeSend(event, hint) {
      if (event.exception) {
        console.error(hint.originalException || hint.syntheticException);
      }
      return event;
    },
    ignoreErrors: [
      "Non-Error promise rejection captured",
      "ResizeObserver loop limit exceeded",
      "cancelled",
    ],
  });
}
