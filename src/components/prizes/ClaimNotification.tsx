/**
 * Claim Notification Toast Component
 * Shows success/error notifications for prize claims
 */

"use client";

import { useEffect, useState } from "react";

interface ClaimNotificationProps {
  type: "success" | "error" | "info";
  message: string;
  transactionHash?: string;
  amount?: string;
  onClose?: () => void;
  duration?: number;
}

export function ClaimNotification({
  type,
  message,
  transactionHash,
  amount,
  onClose,
  duration = 5000,
}: ClaimNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(onClose, 300);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-400 text-green-800";
      case "error":
        return "bg-red-100 border-red-400 text-red-800";
      case "info":
        return "bg-blue-100 border-blue-400 text-blue-800";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✗";
      case "info":
        return "ℹ";
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed top-4 right-4 max-w-md border-2 rounded-lg p-4 shadow-lg transition-all ${getStyles()} ${
        isVisible ? "animate-slide-in" : "animate-slide-out"
      }`}
      style={{
        zIndex: 9999,
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{getIcon()}</span>

        <div className="flex-1">
          <p className="font-bold mb-1">{message}</p>

          {amount && (
            <p className="text-sm">
              Amount: {parseFloat(amount) / 1e6} USDC
            </p>
          )}

          {transactionHash && (
            <a
              href={`https://basescan.org/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline hover:no-underline mt-2 inline-block"
            >
              View on Basescan ↗
            </a>
          )}
        </div>

        <button
          onClick={() => {
            setIsVisible(false);
            if (onClose) setTimeout(onClose, 300);
          }}
          className="text-xl hover:opacity-70 transition-opacity"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
