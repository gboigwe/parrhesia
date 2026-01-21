/**
 * OnchainKit Wallet Connection Component
 * Uses Base's official Wallet component with Smart Wallet support
 */

"use client";

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownDisconnect,
  WalletDropdownLink,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { color } from "@coinbase/onchainkit/theme";

/**
 * Wallet connection button with dropdown
 * Shows user identity, balance, and disconnect option
 */
export function WalletConnect() {
  return (
    <Wallet>
      <ConnectWallet>
        <Avatar className="h-6 w-6" />
        <Name />
      </ConnectWallet>
      <WalletDropdown>
        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
          <Avatar />
          <Name />
          <Address />
          <EthBalance />
        </Identity>
        <WalletDropdownBasename />
        <WalletDropdownLink
          icon="wallet"
          href="https://keys.coinbase.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wallet Settings
        </WalletDropdownLink>
        <WalletDropdownDisconnect />
      </WalletDropdown>
    </Wallet>
  );
}

/**
 * Compact wallet button for mobile/small screens
 */
export function WalletConnectCompact() {
  return (
    <Wallet>
      <ConnectWallet>
        <Avatar className="h-5 w-5" />
      </ConnectWallet>
      <WalletDropdown>
        <Identity className="px-3 pt-2 pb-1" hasCopyAddressOnClick>
          <Avatar />
          <Name className="text-sm" />
          <Address className="text-xs" />
        </Identity>
        <WalletDropdownDisconnect />
      </WalletDropdown>
    </Wallet>
  );
}

/**
 * Wallet button with custom styling
 */
export function WalletConnectCustom({ className }: { className?: string }) {
  return (
    <Wallet>
      <ConnectWallet className={className}>
        <Avatar className="h-6 w-6" />
        <Name className="font-medium" />
      </ConnectWallet>
      <WalletDropdown>
        <Identity
          className="px-4 pt-3 pb-2 hover:bg-gray-50"
          hasCopyAddressOnClick
        >
          <Avatar />
          <Name />
          <Address className="text-gray-600" />
          <EthBalance />
        </Identity>
        <WalletDropdownBasename />
        <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
          Manage Wallet
        </WalletDropdownLink>
        <WalletDropdownDisconnect />
      </WalletDropdown>
    </Wallet>
  );
}
