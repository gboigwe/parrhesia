import { eq, desc, and, sql } from "drizzle-orm";
import { db } from "./index";
import { users, debates, debateArguments, votes, badges, reputationEvents } from "./schema";

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

export async function createDebate(data: typeof debates.$inferInsert) {
  const [debate] = await db.insert(debates).values(data).returning();
  return debate;
}

/**
 * Argument Queries
 */
export async function getDebateArguments(debateId: string) {
  return db.query.debateArguments.findMany({
    where: eq(debateArguments.debateId, debateId),
    orderBy: [debateArguments.roundNumber, debateArguments.postedAt],
    with: {
      user: true,
    },
  });
}

export async function createArgument(data: typeof debateArguments.$inferInsert) {
  const [argument] = await db.insert(debateArguments).values(data).returning();
  return argument;
}

export async function getArgumentsByRound(debateId: string, roundNumber: number) {
  return db.query.debateArguments.findMany({
    where: and(
      eq(debateArguments.debateId, debateId),
      eq(debateArguments.roundNumber, roundNumber)
    ),
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

export async function createVote(data: typeof votes.$inferInsert) {
  const [vote] = await db.insert(votes).values(data).returning();
  return vote;
}

export async function getUserVote(debateId: string, voterId: string) {
  return db.query.votes.findFirst({
    where: and(eq(votes.debateId, debateId), eq(votes.voterId, voterId)),
    with: {
      winner: true,
    },
  });
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
