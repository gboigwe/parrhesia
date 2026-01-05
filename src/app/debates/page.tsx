"use client";

import { useEffect, useState } from "react";
import { DebateCard } from "@/components/debate/DebateCard";
import { CreateDebateForm } from "@/components/debate/CreateDebateForm";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

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

      {!isLoading && debates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {debates.map((debate) => (
            <DebateCard key={debate.id} debate={debate} />
          ))}
        </div>
      )}
    </div>
  );
}
