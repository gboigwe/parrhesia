"use client";

import {
  ConnectWallet as OnchainConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownDisconnect,
  WalletDropdownLink,
} from "@coinbase/onchainkit/wallet";
import { Address, Avatar, Name, Identity, EthBalance } from "@coinbase/onchainkit/identity";
import { useAuth } from "@/contexts/AuthContext";

export function ConnectWallet() {
  const { hasBasename } = useAuth();

  return (
    <div className="flex items-center gap-4">
      <Wallet>
        <OnchainConnectWallet className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Connect Wallet
        </OnchainConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name>
              <Badge />
            </Name>
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
            Wallet
          </WalletDropdownLink>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>

      {!hasBasename && (
        <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
          ⚠️ Basename required to participate
        </div>
      )}
    </div>
  );
}

function Badge() {
  const { hasBasename, basename } = useAuth();

  if (!hasBasename) {
    return (
      <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
        No Basename
      </span>
    );
  }

  return (
    <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full flex items-center gap-1">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      {basename}
    </span>
  );
}
