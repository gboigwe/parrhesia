import { NextRequest, NextResponse } from "next/server";
import { getDebateById } from "@/lib/db/queries";
import { db } from "@/lib/db";
import { debates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/debates/[id] - Get a specific debate by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const debate = await getDebateById(params.id);

    if (!debate) {
      return NextResponse.json(
        { error: "Debate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ debate });
  } catch (error) {
    console.error("Error fetching debate:", error);
    return NextResponse.json(
      { error: "Failed to fetch debate" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/debates/[id] - Update debate (e.g., when opponent joins)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { challengerId, transactionHash } = body;

    if (!challengerId) {
      return NextResponse.json(
        { error: "Challenger ID is required" },
        { status: 400 }
      );
    }

    // Update debate
    const [updatedDebate] = await db
      .update(debates)
      .set({
        challengerId,
        status: "active",
        updatedAt: new Date(),
      })
      .where(eq(debates.id, params.id))
      .returning();

    if (!updatedDebate) {
      return NextResponse.json(
        { error: "Debate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Successfully joined debate",
      debate: updatedDebate,
    });
  } catch (error) {
    console.error("Error updating debate:", error);
    return NextResponse.json(
      { error: "Failed to update debate" },
      { status: 500 }
    );
  }
}
