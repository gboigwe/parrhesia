'use client';

import { useState } from 'react';
import { BLOCKCHAIN_CONFIG } from '@/lib/blockchain/constants';

interface BasescanLinkProps {
  transactionHash?: string;
  address?: string;
  type: 'tx' | 'address';
  className?: string;
  showFullHash?: boolean;
}

/**
 * Truncates a hash or address to format: 0x1234...5678
 */
function truncateHash(hash: string, startLength = 6, endLength = 4): string {
  if (hash.length <= startLength + endLength) {
    return hash;
  }
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
}

/**
 * BasescanLink - Renders a link to Basescan block explorer
 * 
 * @example
 * // Transaction link
 * <BasescanLink transactionHash="0x123..." type="tx" />
 * 
 * // Address link
 * <BasescanLink address="0xabc..." type="address" />
 */
export function BasescanLink({
  transactionHash,
  address,
  type,
  className = '',
  showFullHash = false,
}: BasescanLinkProps) {
  const [copied, setCopied] = useState(false);

  const value = type === 'tx' ? transactionHash : address;

  if (!value) {
    console.warn('BasescanLink: No hash or address provided');
    return null;
  }

  const explorerUrl = BLOCKCHAIN_CONFIG.blockExplorerUrl;
  const url = `${explorerUrl}/${type}/${value}`;
  const displayText = showFullHash ? value : truncateHash(value);
  const label = type === 'tx' ? 'Transaction' : 'Address';

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(`Failed to copy ${type}:`, err);
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="
          inline-flex items-center gap-1.5 
          text-blue-600 hover:text-blue-800 
          dark:text-blue-400 dark:hover:text-blue-300
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          rounded px-1 py-0.5
        "
        aria-label={`View ${label.toLowerCase()} on Basescan (opens in new tab)`}
      >
        {/* Hash/Address Text */}
        <span className="font-mono text-sm">
          {displayText}
        </span>

        {/* External Link Icon */}
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>

        {/* Screen Reader Text */}
        <span className="sr-only">
          (Opens Basescan in new tab)
        </span>
      </a>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="
          inline-flex items-center justify-center
          w-7 h-7 rounded
          text-gray-600 hover:text-gray-900 hover:bg-gray-100
          dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        "
        aria-label={`Copy ${label.toLowerCase()} to clipboard`}
        title={copied ? 'Copied!' : `Copy ${label}`}
      >
        {copied ? (
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
        <span className="sr-only">
          {copied ? 'Copied to clipboard' : `Copy ${label.toLowerCase()}`}
        </span>
      </button>
    </div>
  );
}
