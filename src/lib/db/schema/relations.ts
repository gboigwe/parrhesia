import { relations } from "drizzle-orm";
import { users } from "./users";
import { debates } from "./debates";
import { debateArguments } from "./arguments";
import { votes } from "./votes";
import { badges } from "./badges";
import { reputationEvents } from "./reputation";

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  createdDebates: many(debates, { relationName: "creator" }),
  challengedDebates: many(debates, { relationName: "challenger" }),
  wonDebates: many(debates, { relationName: "winner" }),
  arguments: many(debateArguments),
  votes: many(votes),
  badges: many(badges),
  reputationEvents: many(reputationEvents),
}));

// Debate relations
export const debatesRelations = relations(debates, ({ one, many }) => ({
  creator: one(users, {
    fields: [debates.creatorId],
    references: [users.id],
    relationName: "creator",
  }),
  challenger: one(users, {
    fields: [debates.challengerId],
    references: [users.id],
    relationName: "challenger",
  }),
  winner: one(users, {
    fields: [debates.winnerId],
    references: [users.id],
    relationName: "winner",
  }),
  arguments: many(debateArguments),
  votes: many(votes),
  reputationEvents: many(reputationEvents),
}));

// Arguments relations
export const argumentsRelations = relations(debateArguments, ({ one }) => ({
  debate: one(debates, {
    fields: [debateArguments.debateId],
    references: [debates.id],
  }),
  user: one(users, {
    fields: [debateArguments.userId],
    references: [users.id],
  }),
}));

// Votes relations
export const votesRelations = relations(votes, ({ one }) => ({
  debate: one(debates, {
    fields: [votes.debateId],
    references: [debates.id],
  }),
  voter: one(users, {
    fields: [votes.voterId],
    references: [users.id],
  }),
  winner: one(users, {
    fields: [votes.winnerId],
    references: [users.id],
  }),
}));

// Badges relations
export const badgesRelations = relations(badges, ({ one }) => ({
  user: one(users, {
    fields: [badges.userId],
    references: [users.id],
  }),
}));

// Reputation events relations
export const reputationEventsRelations = relations(reputationEvents, ({ one }) => ({
  user: one(users, {
    fields: [reputationEvents.userId],
    references: [users.id],
  }),
  debate: one(debates, {
    fields: [reputationEvents.debateId],
    references: [debates.id],
  }),
}));
