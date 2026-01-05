"use client";

import { useEffect, useState } from "react";
import { DebateCard } from "@/components/debate/DebateCard";
import { CreateDebateForm } from "@/components/debate/CreateDebateForm";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { DEBATE_CATEGORIES, DEBATE_STATUS } from "@/lib/constants";

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

export default function DebatesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [debates, setDebates] = useState<Debate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    fetchDebates();
  }, []);

  const fetchDebates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/debates");
      if (!response.ok) {
        throw new Error("Failed to fetch debates");
      }
      const data = await response.json();
      setDebates(data.debates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load debates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebateCreated = (debateId: string) => {
    setShowCreateForm(false);
    fetchDebates();
    router.push(`/debates/${debateId}`);
  };

  // Filter debates
  const filteredDebates = debates.filter((debate) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      debate.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      debate.resolution.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategory === "all" || debate.category === selectedCategory;

    // Status filter
    const matchesStatus = selectedStatus === "all" || debate.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Debates</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore ongoing debates or create your own
          </p>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {showCreateForm ? "Cancel" : "Create Debate"}
          </button>
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Create New Debate
          </h2>
          <CreateDebateForm onSuccess={handleDebateCreated} />
        </div>
      )}

      {/* Filters */}
      {!showCreateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search debates..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {DEBATE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value={DEBATE_STATUS.PENDING}>Pending</option>
                <option value={DEBATE_STATUS.ACTIVE}>Active</option>
                <option value={DEBATE_STATUS.VOTING}>Voting</option>
                <option value={DEBATE_STATUS.COMPLETED}>Completed</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Debates Grid */}
      {!isLoading && debates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No debates found. Be the first to create one!
          </p>
        </div>
      )}

      {!isLoading && filteredDebates.length === 0 && debates.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No debates match your filters. Try adjusting your search criteria.
          </p>
        </div>
      )}

      {!isLoading && filteredDebates.length > 0 && (
        <>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredDebates.length} of {debates.length} debates
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDebates.map((debate) => (
              <DebateCard key={debate.id} debate={debate} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
