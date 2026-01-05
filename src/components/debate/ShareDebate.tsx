"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface ShareDebateProps {
  debateId: string;
  topic: string;
  className?: string;
}

export function ShareDebate({ debateId, topic, className }: ShareDebateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/debates/${debateId}`
    : "";

  const shareText = `Check out this debate: ${topic}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Debate link copied to clipboard",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "error",
      });
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const shareToWarpcast = () => {
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(warpcastUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className={cn("", className)}
      >
        <span className="mr-2">=</span>
        Share
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent onClose={() => setIsOpen(false)}>
          <DialogHeader>
            <DialogTitle>Share Debate</DialogTitle>
            <DialogDescription>
              Share this debate with others on social media
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Share URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Debate Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                />
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  Copy
                </Button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Share on
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={shareToTwitter}
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Twitter
                </Button>
                <Button
                  onClick={shareToWarpcast}
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                >
                  <span className="text-lg">=á</span>
                  Warpcast
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
