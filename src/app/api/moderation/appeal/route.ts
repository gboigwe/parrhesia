/**
 * Moderation Appeal API Endpoint
 * POST /api/moderation/appeal
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { userId, moderationResultId, reason } = body;

    if (!userId || !moderationResultId || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const appeal = {
      id: `appeal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      moderationResultId,
      reason,
      status: "pending" as const,
      submittedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      appeal,
      message: "Appeal submitted for review",
    });
  } catch (error) {
    console.error("Appeal error:", error);
    return NextResponse.json(
      { error: "Failed to submit appeal" },
      { status: 500 }
    );
  }
}
