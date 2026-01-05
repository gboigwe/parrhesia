"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DebateCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "pending" | "approving" | "creating" | "success" | "error";
  debateId?: string;
  error?: string;
  transactionHash?: string;
}

export function DebateCreationModal({
  isOpen,
  onClose,
  status,
  debateId,
  error,
  transactionHash,
}: DebateCreationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {status === "pending" && "Creating Debate"}
            {status === "approving" && "Approving USDC"}
            {status === "creating" && "Creating Debate"}
            {status === "success" && "Debate Created!"}
            {status === "error" && "Creation Failed"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {status === "pending" && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Preparing to create debate...
              </p>
            </div>
          )}

          {status === "approving" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                <span className="text-sm text-gray-900 dark:text-white">
                  Step 1/2: Approving USDC
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please confirm the USDC approval transaction in your wallet.
              </p>
            </div>
          )}

          {status === "creating" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs"></span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  USDC approved
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                <span className="text-sm text-gray-900 dark:text-white">
                  Step 2/2: Creating debate on-chain
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please confirm the debate creation transaction in your wallet.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Debate Created Successfully!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your debate has been created and is now live on Parrhesia.
                </p>
              </div>

              {transactionHash && (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Transaction Hash
                  </p>
                  <a
                    href={`https://basescan.org/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                  </a>
                </div>
              )}

              <div className="flex gap-3">
                {debateId && (
                  <Link href={`/debates/${debateId}`} className="flex-1">
                    <Button variant="primary" className="w-full">
                      View Debate
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
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
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Creation Failed
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error || "An error occurred while creating the debate"}
                </p>
              </div>
              <Button variant="outline" onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
