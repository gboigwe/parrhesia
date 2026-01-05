"use client";

import Link from "next/link";
import { DEBATE_CATEGORIES } from "@/lib/constants";

interface Debate {
  id: string;
  topic: string;
  resolution: string;
  category: string;
  format: string;
  status: string;
  stakeAmount: string;
  createdAt: Date;
  creator: {
    basename: string;
  };
  challenger?: {
    basename: string;
  } | null;
}

interface DebateCardProps {
  debate: Debate;
}

export function DebateCard({ debate }: DebateCardProps) {
  const category = DEBATE_CATEGORIES.find((c) => c.id === debate.category);
  const categoryEmoji = category?.emoji || "✨";
  const categoryLabel = category?.label || debate.category;

  const statusColors = {
    pending: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
    active: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    voting: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
    completed: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    cancelled: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
  };

  const statusColor = statusColors[debate.status as keyof typeof statusColors] || statusColors.pending;

  const formatDisplay = debate.format === "timed" ? "⚡ Live" : "📝 Async";

  return (
    <Link href={`/debates/${debate.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryEmoji}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{categoryLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {debate.status}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDisplay}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {debate.topic}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {debate.resolution}
        </p>

        {/* Participants */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400">Creator:</span>
            <span className="font-medium text-gray-900 dark:text-white">{debate.creator.basename}</span>
          </div>
          {debate.challenger ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400">vs</span>
              <span className="font-medium text-gray-900 dark:text-white">{debate.challenger.basename}</span>
            </div>
          ) : (
            <span className="text-yellow-600 dark:text-yellow-400 font-medium">Waiting for opponent</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {parseFloat(debate.stakeAmount).toFixed(0)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">USDC at stake</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(debate.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
