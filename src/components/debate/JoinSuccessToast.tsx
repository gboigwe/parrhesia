/**
 * Join Success Toast Notification
 * Shows success message after joining debate
 */

"use client";

import { useEffect, useState } from "react";
import { TransactionHashDisplay } from "./TransactionHashDisplay";

interface JoinSuccessToastProps {
  isVisible: boolean;
  transactionHash?: string;
  debateTopic: string;
  onClose: () => void;
  duration?: number;
}

export function JoinSuccessToast({
  isVisible,
  transactionHash,
  debateTopic,
  onClose,
  duration = 5000,
}: JoinSuccessToastProps) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);

    if (isVisible) {
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
      <div className="bg-white border-2 border-green-500 rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🎉</div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 mb-1">
              Successfully Joined!
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              You've joined: {debateTopic}
            </p>
            {transactionHash && (
              <TransactionHashDisplay hash={transactionHash} />
            )}
          </div>
          <button
            onClick={() => {
              setShow(false);
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
