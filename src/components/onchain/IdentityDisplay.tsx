/**
 * OnchainKit Identity Display Components
 * Shows user identity with Basename, avatar, and address
 */

"use client";

import {
  Avatar,
  Name,
  Address,
  Identity,
  Badge,
} from "@coinbase/onchainkit/identity";
import { type Address as AddressType } from "viem";

interface IdentityDisplayProps {
  address: AddressType;
  className?: string;
  showBadge?: boolean;
  hasCopy?: boolean;
}

/**
 * Full identity card with avatar, name, address
 */
export function IdentityCard({
  address,
  className,
  showBadge = false,
  hasCopy = true,
}: IdentityDisplayProps) {
  return (
    <Identity
      address={address}
      className={className}
      hasCopyAddressOnClick={hasCopy}
    >
      <Avatar address={address} className="h-12 w-12" />
      <div className="flex flex-col">
        <Name address={address} className="font-medium text-lg" />
        <Address address={address} className="text-sm text-gray-600" />
      </div>
      {showBadge && <Badge className="ml-auto" />}
    </Identity>
  );
}

/**
 * Compact identity display (avatar + name only)
 */
export function IdentityCompact({ address, className }: IdentityDisplayProps) {
  return (
    <Identity address={address} className={className}>
      <Avatar address={address} className="h-8 w-8" />
      <Name address={address} className="font-medium" />
    </Identity>
  );
}

/**
 * Mini identity (avatar only with tooltip)
 */
export function IdentityMini({ address }: { address: AddressType }) {
  return <Avatar address={address} className="h-6 w-6" />;
}

/**
 * User badge with Basename
 */
export function UserBadge({
  address,
  className,
}: {
  address: AddressType;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Avatar address={address} className="h-5 w-5" />
      <Name address={address} className="font-medium text-sm" />
      <Badge />
    </div>
  );
}

/**
 * Debate participant display
 */
export function DebateParticipant({
  address,
  role,
}: {
  address: AddressType;
  role: "creator" | "challenger";
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <Avatar address={address} className="h-10 w-10" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Name address={address} className="font-medium" />
          <Badge />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">{role === "creator" ? "Creator" : "Challenger"}</span>
          <Address address={address} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}

/**
 * Winner announcement with identity
 */
export function WinnerDisplay({ address }: { address: AddressType }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="text-2xl">🏆</div>
      <div className="flex-1">
        <div className="text-sm text-green-700 font-medium mb-1">
          Winner
        </div>
        <Identity address={address} hasCopyAddressOnClick>
          <Avatar address={address} className="h-8 w-8" />
          <Name address={address} className="font-semibold text-green-900" />
        </Identity>
      </div>
    </div>
  );
}

/**
 * Leaderboard entry with rank
 */
export function LeaderboardEntry({
  address,
  rank,
  score,
}: {
  address: AddressType;
  rank: number;
  score: number;
}) {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
      <div className="font-bold text-lg text-gray-400 w-8">
        #{rank}
      </div>
      <Avatar address={address} className="h-10 w-10" />
      <div className="flex-1">
        <Name address={address} className="font-medium" />
        <Address address={address} className="text-xs text-gray-500" />
      </div>
      <div className="text-right">
        <div className="font-bold text-blue-600">{score}</div>
        <div className="text-xs text-gray-500">points</div>
      </div>
    </div>
  );
}
