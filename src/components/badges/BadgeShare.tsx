"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BADGE_METADATA } from "@/lib/badges/constants";

interface BadgeShareProps {
  badgeType: string;
  earnedAt: Date;
}

export function BadgeShare({ badgeType, earnedAt }: BadgeShareProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const metadata = BADGE_METADATA[badgeType as keyof typeof BADGE_METADATA];

  if (!metadata) return null;

  const shareText = `I just unlocked the "${metadata.name}" badge on Parrhesia! ${metadata.description}`;
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleShare = async (platform: string) => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(shareText);

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowShareDialog(true)}
      >
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
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        Share
      </Button>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Badge</DialogTitle>
            <DialogDescription>
              Share your achievement with the community
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-900 dark:text-white mb-2">
                {shareText}
              </p>
              <p className="text-xs text-gray-500">
                Earned {earnedAt.toLocaleDateString()}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => handleShare("twitter")}
                className="bg-[#1DA1F2] hover:bg-[#1a8cd8]"
              >
                <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </Button>

              <Button
                onClick={() => handleShare("facebook")}
                className="bg-[#4267B2] hover:bg-[#365899]"
              >
                <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </Button>

              <Button
                onClick={() => handleShare("linkedin")}
                className="bg-[#0077B5] hover:bg-[#006396]"
              >
                <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="w-full"
            >
              {copied ? "Copied!" : "Copy Share Text"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
