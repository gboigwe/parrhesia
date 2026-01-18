/**
 * Content Flagging API Endpoint
 * POST /api/moderation/flag
 */

import { NextRequest, NextResponse } from "next/server";
import type { ViolationType } from "@/lib/ai/moderator/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      contentId,
      reportedBy,
      reason,
      description,
    }: {
      contentId: string;
      reportedBy: string;
      reason: ViolationType;
      description: string;
    } = body;

    if (!contentId || !reportedBy || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const flag = {
      id: `flag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      contentId,
      reportedBy,
      reason,
      description: description || "",
      status: "pending" as const,
      createdAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      flag,
      message: "Content flagged for review",
    });
  } catch (error) {
    console.error("Flagging error:", error);
    return NextResponse.json(
      { error: "Failed to flag content" },
      { status: 500 }
    );
  }
}
