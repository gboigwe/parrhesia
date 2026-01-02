import { eq, desc, and, sql } from "drizzle-orm";
import { db } from "./index";
import { users, debates, arguments as args, votes, badges, reputationEvents } from "./schema";

/**
 * User Queries
 */
export async function getUserByBasename(basename: string) {
  return db.query.users.findFirst({
    where: eq(users.basename, basename),
  });
}

export async function getUserByWallet(walletAddress: string) {
  return db.query.users.findFirst({
    where: eq(users.walletAddress, walletAddress),
  });
}

export async function createUser(data: typeof users.$inferInsert) {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

/**
 * Debate Queries
 */
export async function getDebateById(id: string) {
  return db.query.debates.findFirst({
    where: eq(debates.id, id),
    with: {
      creator: true,
      challenger: true,
    },
  });
}

export async function getActiveDebates(limit = 20) {
  return db.query.debates.findMany({
    where: eq(debates.status, "active"),
    orderBy: [desc(debates.createdAt)],
    limit,
    with: {
      creator: true,
      challenger: true,
    },
  });
}

export async function getUserDebates(userId: string) {
  return db.query.debates.findMany({
    where: sql`${debates.creatorId} = ${userId} OR ${debates.challengerId} = ${userId}`,
    orderBy: [desc(debates.createdAt)],
    with: {
      creator: true,
      challenger: true,
    },
  });
}

/**
 * Argument Queries
 */
export async function getDebateArguments(debateId: string) {
  return db.query.arguments.findMany({
    where: eq(args.debateId, debateId),
    orderBy: [args.roundNumber, args.postedAt],
    with: {
      user: true,
    },
  });
}

/**
 * Vote Queries
 */
export async function getDebateVotes(debateId: string) {
  return db.query.votes.findMany({
    where: eq(votes.debateId, debateId),
    with: {
      voter: true,
      winner: true,
    },
  });
}

export async function hasUserVoted(debateId: string, voterId: string) {
  const vote = await db.query.votes.findFirst({
    where: and(eq(votes.debateId, debateId), eq(votes.voterId, voterId)),
  });
  return !!vote;
}

/**
 * Badge Queries
 */
export async function getUserBadges(userId: string) {
  return db.query.badges.findMany({
    where: eq(badges.userId, userId),
    orderBy: [desc(badges.earnedAt)],
  });
}

/**
 * Reputation Queries
 */
export async function getUserReputationHistory(userId: string, limit = 50) {
  return db.query.reputationEvents.findMany({
    where: eq(reputationEvents.userId, userId),
    orderBy: [desc(reputationEvents.timestamp)],
    limit,
  });
}
