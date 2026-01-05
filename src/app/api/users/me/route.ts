import { NextRequest, NextResponse } from "next/server";
import { getUserByBasename, getUserByWallet, createUser } from "@/lib/db/queries";
import { isValidBasename } from "@/hooks/useBasename";

/**
 * POST /api/users/me
 * Get or create user by wallet address and basename
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, basename } = body;

    // Validate inputs
    if (!walletAddress || !basename) {
      return NextResponse.json(
        { error: "Wallet address and basename are required" },
        { status: 400 }
      );
    }

    if (!isValidBasename(basename)) {
      return NextResponse.json({ error: "Invalid basename format" }, { status: 400 });
    }

    // Check if user exists by basename
    let user = await getUserByBasename(basename);

    if (!user) {
      // Check if wallet address is already associated with another basename
      const existingUser = await getUserByWallet(walletAddress);

      if (existingUser && existingUser.basename !== basename) {
        return NextResponse.json(
          { error: "Wallet address already associated with a different basename" },
          { status: 409 }
        );
      }

      // Create new user
      user = await createUser({
        basename,
        walletAddress,
        debaterReputation: "0",
        voterReputation: "0",
      });
    } else {
      // User exists - verify wallet address matches
      if (user.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return NextResponse.json(
          { error: "Basename is associated with a different wallet address" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error in /api/users/me:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
