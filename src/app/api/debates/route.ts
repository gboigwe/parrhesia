import { NextRequest, NextResponse } from "next/server";
import { createDebate, getActiveDebates } from "@/lib/db/queries";
import { DEBATE_CONFIG } from "@/lib/constants";

/**
 * GET /api/debates - Get debates with filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const status = searchParams.get("status") || "all";
    const minStake = parseFloat(searchParams.get("minStake") || "0");
    const maxStake = parseFloat(searchParams.get("maxStake") || "10000");
    const sortBy = searchParams.get("sortBy") || "newest";

    // Get all debates first
    let debates = await getActiveDebates();

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      debates = debates.filter(
        (d) =>
          d.topic.toLowerCase().includes(searchLower) ||
          d.resolution.toLowerCase().includes(searchLower)
      );
    }

    if (category !== "all") {
      debates = debates.filter((d) => d.category === category);
    }

    if (status !== "all") {
      debates = debates.filter((d) => d.status === status);
    }

    // Apply stake range filter
    debates = debates.filter((d) => {
      const stake = parseFloat(d.stakeAmount);
      return stake >= minStake && stake <= maxStake;
    });

    // Apply sorting
    switch (sortBy) {
      case "newest":
        debates.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "popular":
        // Sort by number of participants/views (placeholder)
        debates.sort((a, b) => {
          const aPopularity = a.challenger ? 2 : 1;
          const bPopularity = b.challenger ? 2 : 1;
          return bPopularity - aPopularity;
        });
        break;
      case "stake":
        debates.sort(
          (a, b) => parseFloat(b.stakeAmount) - parseFloat(a.stakeAmount)
        );
        break;
      case "ending":
        // Sort by created date for now (most recent first)
        debates.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
    }

    // Apply pagination
    const total = debates.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDebates = debates.slice(startIndex, endIndex);

    return NextResponse.json({
      debates: paginatedDebates,
      pagination: {
        page,
        limit,
        total,
        hasMore: endIndex < total,
      },
    });
  } catch (error) {
    console.error("Error fetching debates:", error);
    return NextResponse.json(
      { error: "Failed to fetch debates" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/debates - Create a new debate
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, format, stakeAmount, creatorId } = body;

    // Validation
    if (!title || title.length < 10) {
      return NextResponse.json(
        { error: "Title must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (!description || description.length < 50) {
      return NextResponse.json(
        { error: "Description must be at least 50 characters" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!format || !["live", "async"].includes(format)) {
      return NextResponse.json(
        { error: "Valid format is required (live or async)" },
        { status: 400 }
      );
    }

    if (
      !stakeAmount ||
      stakeAmount < DEBATE_CONFIG.MIN_STAKE_USDC ||
      stakeAmount > DEBATE_CONFIG.MAX_STAKE_USDC
    ) {
      return NextResponse.json(
        {
          error: `Stake must be between ${DEBATE_CONFIG.MIN_STAKE_USDC} and ${DEBATE_CONFIG.MAX_STAKE_USDC} USDC`,
        },
        { status: 400 }
      );
    }

    if (!creatorId) {
      return NextResponse.json(
        { error: "Creator ID is required" },
        { status: 400 }
      );
    }

    // Map format: "live" -> "timed" for database
    const dbFormat = format === "live" ? "timed" : "async";

    // Create debate in database
    const debate = await createDebate({
      topic: title,
      resolution: description,
      category,
      format: dbFormat,
      stakeAmount: stakeAmount.toString(),
      creatorId,
      status: "pending", // Waiting for opponent
    });

    return NextResponse.json(
      {
        debateId: debate.id,
        message: "Debate created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating debate:", error);
    return NextResponse.json(
      { error: "Failed to create debate" },
      { status: 500 }
    );
  }
}
