import { NextRequest, NextResponse } from "next/server";
import { getDebateById } from "@/lib/db/queries";

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
