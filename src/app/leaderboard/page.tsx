"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { ReputationStats } from "@/components/leaderboard/ReputationStats";
import { CategoryFilter } from "@/components/leaderboard/CategoryFilter";

export default function LeaderboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ["leaderboard", selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.set("category", selectedCategory);

      const response = await fetch(`/api/leaderboard?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      return response.json();
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!leaderboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Failed to load leaderboard
          </p>
        </div>
      </div>
    );
  }

  const { debaters, voters, stats } = leaderboardData;
  const categories = categoriesData?.categories || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Leaderboards
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Top debaters and voters ranked by reputation
        </p>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <ReputationStats
          totalDebaters={stats?.totalDebaters || 0}
          totalVoters={stats?.totalVoters || 0}
          avgDebaterReputation={stats?.avgDebaterReputation || 0}
          avgVoterReputation={stats?.avgVoterReputation || 0}
          topDebaterReputation={stats?.topDebaterReputation || 0}
          topVoterReputation={stats?.topVoterReputation || 0}
        />
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      )}

      {/* Tabs for Debaters vs Voters */}
      <Tabs defaultValue="debaters" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="debaters">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Debaters
          </TabsTrigger>
          <TabsTrigger value="voters">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            Voters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="debaters" className="mt-6">
          <LeaderboardTable
            entries={debaters || []}
            type="debaters"
            category={selectedCategory || undefined}
          />
        </TabsContent>

        <TabsContent value="voters" className="mt-6">
          <LeaderboardTable
            entries={voters || []}
            type="voters"
            category={selectedCategory || undefined}
          />
        </TabsContent>
      </Tabs>

      {/* Info Section */}
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-medium mb-2">How Reputation Works</p>
            <ul className="space-y-1 text-xs">
              <li>
                • <strong>Debaters</strong>: Reputation based on win rate (25%),
                average scores (30%), participation (10%), topic variety (10%),
                consistency (15%), and engagement (10%)
              </li>
              <li>
                • <strong>Voters</strong>: Reputation based on accuracy (40%),
                participation (25%), vote quality (20%), and consistency (15%)
              </li>
              <li>
                • Rankings update in real-time after each debate conclusion
              </li>
              <li>
                • Reputation changes show movement since last update
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
