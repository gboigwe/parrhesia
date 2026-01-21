/**
 * Spend Permission UI Component
 * Allows users to grant session keys for pre-approved transactions
 */

"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import {
  createVotingSession,
  createArgumentSession,
  getRemainingTime,
  SessionKeyStorage,
} from "@/lib/permissions/session";
import { type Address } from "viem";

interface SpendPermissionUIProps {
  debatePoolAddress: Address;
  onPermissionGranted?: () => void;
}

export function SpendPermissionUI({
  debatePoolAddress,
  onPermissionGranted,
}: SpendPermissionUIProps) {
  const { address } = useAccount();
  const [isGranting, setIsGranting] = useState(false);
  const [activeSession, setActiveSession] = useState<{
    type: string;
    expiry: number;
  } | null>(null);

  // Check for existing session
  const checkExistingSession = () => {
    if (!address) return null;
    return SessionKeyStorage.get(address);
  };

  const handleGrantVotingSession = async () => {
    if (!address) return;

    setIsGranting(true);

    try {
      const session = createVotingSession(debatePoolAddress, 10, 24);

      // In production, this would call wallet_grantPermissions
      // For now, we'll store in localStorage
      SessionKeyStorage.save(
        address,
        "voting_session",
        session.expiry
      );

      setActiveSession({
        type: "voting",
        expiry: session.expiry,
      });

      onPermissionGranted?.();
    } catch (error) {
      console.error("Failed to grant voting session:", error);
    } finally {
      setIsGranting(false);
    }
  };

  const handleGrantArgumentSession = async () => {
    if (!address) return;

    setIsGranting(true);

    try {
      const session = createArgumentSession(debatePoolAddress, 5, 48);

      SessionKeyStorage.save(
        address,
        "argument_session",
        session.expiry
      );

      setActiveSession({
        type: "argument",
        expiry: session.expiry,
      });

      onPermissionGranted?.();
    } catch (error) {
      console.error("Failed to grant argument session:", error);
    } finally {
      setIsGranting(false);
    }
  };

  const handleRevokeSession = () => {
    if (!address) return;
    SessionKeyStorage.remove(address);
    setActiveSession(null);
  };

  const existingSession = checkExistingSession();
  const timeRemaining = existingSession
    ? getRemainingTime(existingSession.expiry)
    : null;

  if (existingSession && !timeRemaining?.isExpired) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">✓</div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 mb-1">
              Session Active
            </h3>
            <p className="text-sm text-green-700 mb-2">
              You have an active session for one-click transactions
            </p>
            <div className="text-xs text-green-600">
              Expires in: {timeRemaining?.hours}h {timeRemaining?.minutes}m
            </div>
          </div>
          <button
            onClick={handleRevokeSession}
            className="text-sm text-green-700 hover:text-green-900 underline"
          >
            Revoke
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Enable One-Click Transactions
        </h3>
        <p className="text-sm text-blue-700 mb-4">
          Grant permissions to reduce signature prompts and improve your experience
        </p>
      </div>

      <div className="grid gap-3">
        {/* Voting Session */}
        <div className="border rounded-lg p-4 hover:bg-gray-50 transition">
          <div className="flex items-start gap-3 mb-3">
            <div className="text-2xl">🗳️</div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">Voting Session</h4>
              <p className="text-sm text-gray-600 mb-2">
                Pre-approve up to 10 votes for 24 hours
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• No signature needed for each vote</li>
                <li>• Gasless transactions included</li>
                <li>• Automatically expires after 24h</li>
              </ul>
            </div>
          </div>
          <button
            onClick={handleGrantVotingSession}
            disabled={isGranting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGranting ? "Granting..." : "Enable Voting Session"}
          </button>
        </div>

        {/* Argument Session */}
        <div className="border rounded-lg p-4 hover:bg-gray-50 transition">
          <div className="flex items-start gap-3 mb-3">
            <div className="text-2xl">💬</div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">Argument Session</h4>
              <p className="text-sm text-gray-600 mb-2">
                Pre-approve up to 5 arguments for 48 hours
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Submit arguments without signing</li>
                <li>• Gasless submissions</li>
                <li>• Valid for 2 days</li>
              </ul>
            </div>
          </div>
          <button
            onClick={handleGrantArgumentSession}
            disabled={isGranting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGranting ? "Granting..." : "Enable Argument Session"}
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Sessions can be revoked at any time. Your wallet remains in full control.
      </div>
    </div>
  );
}
