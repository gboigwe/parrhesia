"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Avatar, Address, EthBalance, Identity } from "@coinbase/onchainkit/identity";
import { AuthGuard } from "@/components/auth/AuthGuard";

export function UserProfile() {
  return (
    <AuthGuard requireAuth requireBasename>
      <UserProfileContent />
    </AuthGuard>
  );
}

function UserProfileContent() {
  const { user, basename, walletAddress } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-400">No user data found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-start gap-6">
          {walletAddress && (
            <Identity address={walletAddress as `0x${string}`} schemaId="0x1" hasCopyAddressOnClick>
              <Avatar className="w-24 h-24" />
            </Identity>
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{basename}</h1>

            {walletAddress && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Address address={walletAddress as `0x${string}`} />
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Debates" value={user.totalDebates || 0} />
              <StatCard label="Wins" value={user.totalWins || 0} />
              <StatCard label="Losses" value={user.totalLosses || 0} />
              <StatCard label="Votes Cast" value={user.totalVotes || 0} />
            </div>
          </div>
        </div>
      </div>

      {/* Reputation Scores */}
      <div className="grid md:grid-cols-2 gap-6">
        <ReputationCard
          title="Debater Reputation"
          score={parseFloat(user.debaterReputation || "0")}
          icon="⚔️"
        />
        <ReputationCard
          title="Voter Reputation"
          score={parseFloat(user.voterReputation || "0")}
          icon="🗳️"
        />
      </div>

      {/* Balance */}
      {walletAddress && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Wallet Balance</h2>
          <EthBalance address={walletAddress as `0x${string}`} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function ReputationCard({ title, score, icon }: { title: string; score: number; icon: string }) {
  const scoreColor =
    score >= 75 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-gray-600";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className={`text-4xl font-bold ${scoreColor}`}>{score.toFixed(1)}</span>
        <span className="text-gray-500 dark:text-gray-400">/ 100</span>
      </div>

      <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
