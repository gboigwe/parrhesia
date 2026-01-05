"use client";

import { AlertCircle, Wallet, UserCheck } from "lucide-react";

interface AuthErrorProps {
  type: "no-wallet" | "no-basename" | "not-registered" | "generic";
  message?: string;
  onRetry?: () => void;
}

export function AuthError({ type, message, onRetry }: AuthErrorProps) {
  const errorConfig = {
    "no-wallet": {
      icon: <Wallet className="w-12 h-12" />,
      title: "Wallet Not Connected",
      description: message || "Please connect your Smart Wallet to continue.",
      action: "Connect Wallet",
      color: "blue",
    },
    "no-basename": {
      icon: <UserCheck className="w-12 h-12" />,
      title: "Basename Required",
      description:
        message || "You need a Basename to participate in debates. Register one to continue.",
      action: "Get Basename",
      color: "indigo",
    },
    "not-registered": {
      icon: <AlertCircle className="w-12 h-12" />,
      title: "Registration Required",
      description: message || "Complete your profile setup to access this feature.",
      action: "Complete Setup",
      color: "purple",
    },
    generic: {
      icon: <AlertCircle className="w-12 h-12" />,
      title: "Authentication Error",
      description: message || "There was a problem with authentication. Please try again.",
      action: "Retry",
      color: "red",
    },
  };

  const config = errorConfig[type];
  const colorClasses = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950",
      border: "border-blue-200 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950",
      border: "border-indigo-200 dark:border-indigo-800",
      icon: "text-indigo-600 dark:text-indigo-400",
      button: "bg-indigo-600 hover:bg-indigo-700",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950",
      border: "border-purple-200 dark:border-purple-800",
      icon: "text-purple-600 dark:text-purple-400",
      button: "bg-purple-600 hover:bg-purple-700",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-950",
      border: "border-red-200 dark:border-red-800",
      icon: "text-red-600 dark:text-red-400",
      button: "bg-red-600 hover:bg-red-700",
    },
  };

  const colors = colorClasses[config.color as keyof typeof colorClasses];

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div
        className={`max-w-md w-full ${colors.bg} ${colors.border} border rounded-lg shadow-lg p-8 text-center`}
      >
        <div className={`flex justify-center mb-4 ${colors.icon}`}>{config.icon}</div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{config.title}</h2>

        <p className="text-gray-600 dark:text-gray-300 mb-6">{config.description}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            className={`w-full ${colors.button} text-white font-semibold py-3 px-6 rounded-lg transition-colors`}
          >
            {config.action}
          </button>
        )}
      </div>
    </div>
  );
}
