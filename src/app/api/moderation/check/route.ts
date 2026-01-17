/**
 * Moderation Check API Endpoint
 * POST /api/moderation/check
 */

import { NextRequest, NextResponse } from "next/server";
import { moderateContent } from "@/lib/ai/moderator/moderatorAgent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      contentId,
      userId,
      content,
      debateTopic,
      previousContent,
      userHistory,
    } = body;

    if (!contentId || !userId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await moderateContent(contentId, userId, content, {
      debateTopic,
      previousContent,
      userHistory,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Moderation error:", error);
    return NextResponse.json(
      { error: "Failed to moderate content" },
      { status: 500 }
    );
  }
}
