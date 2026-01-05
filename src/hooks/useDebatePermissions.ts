"use client";

import { useAuth } from "@/contexts/AuthContext";
import { canJoinDebate, canVoteOnDebate } from "@/lib/debate/validation";

interface Debate {
  status: string;
  creatorId: string;
  challengerId?: string | null;
}

export function useDebatePermissions(debate: Debate | null) {
  const { user } = useAuth();

  const canJoin = debate ? canJoinDebate(debate, user?.id) : false;
  const canVote = debate ? canVoteOnDebate(debate, user?.id) : false;
  const isParticipant =
    debate && user
      ? debate.creatorId === user.id || debate.challengerId === user.id
      : false;
  const isCreator = debate && user ? debate.creatorId === user.id : false;

  return {
    canJoin,
    canVote,
    isParticipant,
    isCreator,
  };
}
