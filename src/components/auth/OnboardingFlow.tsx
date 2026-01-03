"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, Circle, ExternalLink } from "lucide-react";
import { ConnectWallet } from "./ConnectWallet";

export function OnboardingFlow() {
  const { walletAddress, hasBasename, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Connect Wallet",
      description: "Connect your Smart Wallet to get started",
      completed: !!walletAddress,
      component: <ConnectWallet />,
    },
    {
      id: 2,
      title: "Register Basename",
      description: "Get your unique identity on Base",
      completed: hasBasename,
      component: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Your Basename is your onchain identity. It works across all Base applications.
          </p>
          <a
            href="https://www.base.org/names"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <span>Register Basename</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ),
    },
    {
      id: 3,
      title: "Complete Setup",
      description: "Your profile has been created automatically",
      completed: isAuthenticated,
      component: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Once you have your Basename, reconnect your wallet to complete setup.
          </p>
        </div>
      ),
    },
  ];

  const allComplete = steps.every((step) => step.completed);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to Parrhesia
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Let's get you set up in a few simple steps
        </p>

        {/* Progress Steps */}
        <div className="space-y-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`border rounded-lg p-6 transition-all ${
                step.completed
                  ? "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-950"
                  : currentStep === step.id
                    ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" />
                  ) : (
                    <Circle
                      className={`w-8 h-8 ${
                        currentStep === step.id
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-400 dark:text-gray-600"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{step.description}</p>

                  {!step.completed && currentStep === step.id && (
                    <div className="mt-4">{step.component}</div>
                  )}

                  {step.completed && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      ✓ Completed
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Complete Message */}
        {allComplete && (
          <div className="mt-8 p-6 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-center">
            <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
              🎉 You're all set!
            </h3>
            <p className="text-green-700 dark:text-green-300 mb-4">
              You can now create debates, vote, and earn reputation.
            </p>
            <a
              href="/debates"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Debates
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
