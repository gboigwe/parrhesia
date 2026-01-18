/**
 * Test Utilities
 * Helper functions for testing
 */

import { QueryClient } from "@tanstack/react-query";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function mockDebateData() {
  return {
    id: "test-debate-1",
    topic: "Is AI beneficial for humanity?",
    description: "Test debate description",
    category: "technology",
    creator: "0x1234567890123456789012345678901234567890",
    challenger: "0x0987654321098765432109876543210987654321",
    stake: "100",
    status: "active",
    createdAt: new Date(),
    endTime: new Date(Date.now() + 86400000),
  };
}

export function mockArgumentData() {
  return {
    id: "arg-1",
    content: "This is a test argument with valid reasoning and evidence.",
    userId: "0x1234567890123456789012345678901234567890",
    side: "creator" as const,
    roundNumber: 1,
    sources: ["https://example.com/source1"],
    createdAt: new Date(),
  };
}

export function mockUserData() {
  return {
    id: "user-1",
    address: "0x1234567890123456789012345678901234567890",
    username: "testuser",
    reputation: 50,
    debatesWon: 5,
    debatesLost: 3,
    totalDebates: 8,
    badges: ["first_win"],
    createdAt: new Date(),
  };
}

export function mockVoteData() {
  return {
    id: "vote-1",
    debateId: "test-debate-1",
    userId: "0x1111111111111111111111111111111111111111",
    winner: "creator" as const,
    argumentQuality: 8,
    rebuttalStrength: 7,
    clarity: 9,
    evidence: 6,
    persuasiveness: 8,
    comment: "Well argued position",
    createdAt: new Date(),
  };
}

export function mockModerationResult() {
  return {
    contentId: "content-1",
    userId: "0x1234567890123456789012345678901234567890",
    content: "This is appropriate content for testing",
    analysis: {
      isAppropriate: true,
      confidence: 0.95,
      violations: [],
      severity: "low" as const,
      explanation: "Content is appropriate",
      suggestedAction: "allow" as const,
    },
    action: "allow" as const,
    moderatedAt: new Date(),
    appealable: false,
  };
}

export function mockAIJudgeVerdict() {
  return {
    debateId: "test-debate-1",
    winner: "creator" as const,
    creatorAnalysis: {
      argumentQuality: 8.5,
      rebuttalStrength: 7.5,
      clarity: 9.0,
      evidence: 7.0,
      persuasiveness: 8.0,
      overallScore: 8.1,
      explanation: "Strong arguments with good evidence",
      strengths: ["Clear logic", "Good sources", "Strong rebuttals"],
      weaknesses: ["Could use more examples"],
      fallaciesDetected: [],
      factCheckResults: [],
    },
    challengerAnalysis: {
      argumentQuality: 7.0,
      rebuttalStrength: 6.5,
      clarity: 7.5,
      evidence: 6.0,
      persuasiveness: 7.0,
      overallScore: 6.9,
      explanation: "Decent arguments but lacking depth",
      strengths: ["Good effort", "Clear writing"],
      weaknesses: ["Weak evidence", "Few rebuttals", "Limited depth"],
      fallaciesDetected: ["hasty_generalization"],
      factCheckResults: [],
    },
    reasoning: "Creator provided stronger arguments with better evidence",
    confidence: 0.85,
    judgedAt: new Date(),
  };
}

export async function waitFor(
  callback: () => boolean,
  timeout = 1000
): Promise<void> {
  const start = Date.now();
  while (!callback()) {
    if (Date.now() - start > timeout) {
      throw new Error("Timeout waiting for condition");
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

export function mockFetch(response: any, ok = true) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    } as Response)
  );
}

export function createMockWallet(address: string) {
  return {
    address,
    chainId: 8453,
    isConnected: true,
    connector: {
      id: "mock",
      name: "Mock Wallet",
    },
  };
}
