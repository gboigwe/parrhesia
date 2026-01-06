"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { DebateResults } from "@/components/results/DebateResults";
import { CriteriaBreakdown } from "@/components/results/CriteriaBreakdown";
import { PrizeBreakdown } from "@/components/results/PrizeBreakdown";
import { ClaimPrizeButton } from "@/components/results/ClaimPrizeButton";
import { VoterRewards } from "@/components/results/VoterRewards";
import { ClaimSuccessState } from "@/components/results/ClaimSuccessState";
import { usePrizeClaim } from "@/hooks/usePrizeClaim";
import { REPUTATION_REWARDS } from "@/lib/voting/constants";
import { determineWinner } from "@/lib/voting/utils";

export default function DebateResultsPage() {
  const params = useParams();
  const debateId = params.id as string;

  const { data: debateData, isLoading } = useQuery({
    queryKey: ["debate", debateId],
    queryFn: async () => {
      const response = await fetch(`/api/debates/${debateId}`);
      if (!response.ok) throw new Error("Failed to fetch debate");
      return response.json();
    },
  });

  const { data: votesData } = useQuery({
    queryKey: ["votes", debateId],
    queryFn: async () => {
      const response = await fetch(`/api/debates/${debateId}/votes`);
      if (!response.ok) throw new Error("Failed to fetch votes");
      return response.json();
    },
    enabled: !!debateData,
  });

  const {
    claimPrizeAsync,
    isClaiming,
    isSuccess: claimSuccess,
    data: claimData,
  } = usePrizeClaim();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!debateData || !votesData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Failed to load debate results
          </p>
        </div>
      </div>
    );
  }

  const { debate } = debateData;
  const { votes } = votesData;

  // Determine winner
  const winnerResult = determineWinner(
    votes,
    debate.creator.id,
    debate.challenger.id
  );

  // Check if current user is winner or voted
  const currentUser = debateData.currentUser;
  const isWinner = currentUser && winnerResult.winnerId === currentUser.id;
  const userVote = votes.find((v: any) => v.userId === currentUser?.id);
  const userVotedCorrectly =
    userVote && userVote.winnerId === winnerResult.winnerId;

  // Calculate rewards
  const prizePool = parseFloat(debate.prizePool || "0");
  const platformFee = (prizePool * 5) / 100;
  const voterRewardPool = (prizePool * 10) / 100;
  const winnerPrize = prizePool - platformFee - voterRewardPool;
  const perVoterReward =
    votes.length > 0 ? voterRewardPool / votes.length : 0;

  const handleClaimPrize = async () => {
    if (!currentUser) return;
    await claimPrizeAsync({
      debateId,
      userId: currentUser.id,
      type: "winner",
    });
  };

  const handleClaimVoterReward = async () => {
    if (!currentUser) return;
    await claimPrizeAsync({
      debateId,
      userId: currentUser.id,
      type: "voter",
    });
  };

  // Show success state if prize was claimed
  if (claimSuccess && claimData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <ClaimSuccessState
          prizeAmount={claimData.amountClaimed}
          transactionHash={claimData.transactionHash}
          reputationEarned={claimData.reputationEarned}
          debateId={debateId}
          type={isWinner ? "winner" : "voter"}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Debate Results
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{debate.topic}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Results Overview */}
          <DebateResults
            votes={votes}
            creator={debate.creator}
            challenger={debate.challenger}
            winnerId={winnerResult.winnerId}
            isTie={winnerResult.isTie}
          />

          {/* Criteria Breakdown */}
          <CriteriaBreakdown
            votes={votes}
            creatorId={debate.creator.id}
            challengerId={debate.challenger.id}
            creatorName={debate.creator.basename}
            challengerName={debate.challenger.basename}
          />

          {/* Voter Rewards (if user voted) */}
          {userVote && (
            <VoterRewards
              userVoted={true}
              userVotedCorrectly={!!userVotedCorrectly}
              rewardAmount={perVoterReward.toFixed(2)}
              reputationEarned={REPUTATION_REWARDS.VOTE_CAST}
              hasClaimed={userVote.rewardClaimed || false}
              onClaimReward={handleClaimVoterReward}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Prize Breakdown */}
          <PrizeBreakdown
            prizePool={debate.prizePool}
            totalVotes={votes.length}
            winnerId={winnerResult.winnerId}
            winnerName={
              winnerResult.winnerId === debate.creator.id
                ? debate.creator.basename
                : debate.challenger.basename
            }
            isTie={winnerResult.isTie}
          />

          {/* Claim Prize Button (if user is winner) */}
          {isWinner && (
            <div className="sticky top-6">
              <ClaimPrizeButton
                debateId={debateId}
                prizeAmount={winnerPrize.toFixed(2)}
                isWinner={true}
                hasClaimed={debate.prizeClaimed || false}
                onClaim={handleClaimPrize}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
