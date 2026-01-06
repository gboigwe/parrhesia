"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ArgumentSubmissionFormProps {
  debateId: string;
  onSubmit: (content: string, sources?: string[]) => Promise<void>;
  isSubmitting?: boolean;
  minWords?: number;
  maxWords?: number;
  roundNumber: number;
  side: "pro" | "con";
}

export function ArgumentSubmissionForm({
  debateId,
  onSubmit,
  isSubmitting = false,
  minWords = 50,
  maxWords = 500,
  roundNumber,
  side,
}: ArgumentSubmissionFormProps) {
  const [content, setContent] = useState("");
  const [sources, setSources] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const isValid = wordCount >= minWords && wordCount <= maxWords;
  const canSubmit = isValid && !isSubmitting && content.trim().length > 0;

  const getWordCountColor = () => {
    if (wordCount < minWords) return "text-red-600 dark:text-red-400";
    if (wordCount > maxWords) return "text-red-600 dark:text-red-400";
    if (wordCount > maxWords * 0.9)
      return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setError(null);
    try {
      const validSources = sources.filter((s) => s.trim().length > 0);
      await onSubmit(content, validSources.length > 0 ? validSources : undefined);
      setContent("");
      setSources([""]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit argument");
    }
  };

  const addSource = () => {
    if (sources.length < 5) {
      setSources([...sources, ""]);
    }
  };

  const removeSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index));
  };

  const updateSource = (index: number, value: string) => {
    const newSources = [...sources];
    newSources[index] = value;
    setSources(newSources);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Submit Your Argument
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Round {roundNumber} •{" "}
                <span
                  className={
                    side === "pro"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  {side === "pro" ? "Proposition" : "Opposition"}
                </span>
              </p>
            </div>
            <Badge
              variant={isValid ? "default" : "outline"}
              className={getWordCountColor()}
            >
              {wordCount} / {maxWords} words
            </Badge>
          </div>

          {/* Argument Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Argument Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Make your case... (minimum ${minWords} words)`}
              className="w-full min-h-[200px] px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-y"
              disabled={isSubmitting}
            />
            {wordCount < minWords && wordCount > 0 && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Need {minWords - wordCount} more words to reach minimum
              </p>
            )}
            {wordCount > maxWords && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Exceeded maximum by {wordCount - maxWords} words
              </p>
            )}
          </div>

          {/* Sources */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sources & Citations (Optional)
              </label>
              {sources.length < 5 && (
                <button
                  onClick={addSource}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  type="button"
                >
                  + Add Source
                </button>
              )}
            </div>
            <div className="space-y-2">
              {sources.map((source, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={source}
                    onChange={(e) => updateSource(index, e.target.value)}
                    placeholder="https://example.com/article"
                    type="url"
                    className="flex-1"
                  />
                  {sources.length > 1 && (
                    <button
                      onClick={() => removeSource(index)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      type="button"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full"
            variant="primary"
            size="lg"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Argument"
            )}
          </Button>

          {/* Guidelines */}
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>💡 Guidelines:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Present clear, logical arguments with evidence</li>
              <li>Address opponent's points directly</li>
              <li>Cite credible sources when possible</li>
              <li>Maintain respectful and professional tone</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
