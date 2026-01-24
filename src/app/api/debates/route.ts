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
 * POST /api/debates - Create a new debate with blockchain metadata
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      debateId,
      topic,
      stakeAmount,
      duration,
      creatorAddress,
      transactionHash,
      contractAddress,
      blockNumber,
      chainId,
      syncStatus,
      category,
      format,
    } = body;

    // Validate required fields
    if (!debateId) {
      return NextResponse.json(
        { error: "Debate ID is required" },
        { status: 400 }
      );
    }

    if (!topic || topic.length < 10) {
      return NextResponse.json(
        { error: "Topic must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (!stakeAmount || stakeAmount < DEBATE_CONFIG.MIN_STAKE_USDC) {
      return NextResponse.json(
        {
          error: `Stake must be at least ${DEBATE_CONFIG.MIN_STAKE_USDC} USDC`,
        },
        { status: 400 }
      );
    }

    if (!transactionHash) {
      return NextResponse.json(
        { error: "Transaction hash is required" },
        { status: 400 }
      );
    }

    if (!blockNumber) {
      return NextResponse.json(
        { error: "Block number is required" },
        { status: 400 }
      );
    }

    if (!creatorAddress) {
      return NextResponse.json(
        { error: "Creator address is required" },
        { status: 400 }
      );
    }

    // Create debate in database with blockchain metadata
    const debate = await createDebate({
      id: debateId,
      topic,
      resolution: topic, // Using topic as resolution for now
      category: category || "custom",
      format: format || "async",
      stakeAmount: stakeAmount.toString(),
      creatorId: creatorAddress, // Using wallet address as creator ID for now
      status: "pending",
      prizePool: (stakeAmount * 2).toString(), // Prize pool is 2x stake (both parties)
      
      // Blockchain metadata
      contractAddress: contractAddress || null,
      transactionHash,
      blockNumber: blockNumber,
      chainId: chainId || 8453,
      syncStatus: syncStatus || "confirmed",
      lastSyncedAt: new Date(),
      lastSyncedBlock: blockNumber,
      syncErrors: [],
    });

    console.log(`Debate ${debateId} saved to database`);
    console.log(`  Topic: ${topic}`);
    console.log(`  Stake: ${stakeAmount} USDC`);
    console.log(`  Transaction: ${transactionHash}`);
    console.log(`  Block: ${blockNumber}`);
    console.log(`  Sync Status: ${syncStatus || "confirmed"}`);

    return NextResponse.json(
      {
        id: debate.id,
        debateId: debate.id,
        message: "Debate created successfully",
        debate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating debate:", error);
    return NextResponse.json(
      {
        error: "Failed to create debate",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
