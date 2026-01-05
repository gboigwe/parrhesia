"use client";

import { useState, useEffect } from "react";

interface ArgumentDraft {
  content: string;
  lastSaved: string;
}

const STORAGE_KEY_PREFIX = "debate_argument_draft_";

export function useArgumentDraft(debateId: string) {
  const storageKey = `${STORAGE_KEY_PREFIX}${debateId}`;
  const [draft, setDraft] = useState<ArgumentDraft | null>(null);

  // Load draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setDraft(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load draft:", error);
    }
  }, [storageKey]);

  // Save draft
  const saveDraft = (content: string) => {
    try {
      const draft: ArgumentDraft = {
        content,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(draft));
      setDraft(draft);
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  };

  // Clear draft
  const clearDraft = () => {
    try {
      localStorage.removeItem(storageKey);
      setDraft(null);
    } catch (error) {
      console.error("Failed to clear draft:", error);
    }
  };

  // Auto-save with debounce
  const autoSaveDraft = (content: string) => {
    if (!content.trim()) return;
    saveDraft(content);
  };

  return {
    draft,
    saveDraft,
    clearDraft,
    autoSaveDraft,
    hasDraft: !!draft?.content,
  };
}
