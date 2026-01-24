'use client';

import { useState } from 'react';
import { BasescanLink } from './BasescanLink';

type TransactionStatusType = 
  | 'idle' 
  | 'preparing'
  | 'signing' 
  | 'confirming' 
  | 'syncing' 
  | 'success' 
  | 'error'
  | 'verifying';

interface TransactionStatusProps {
  status: TransactionStatusType;
  transactionHash?: string;
  error?: Error | null;
  className?: string;
}

const statusConfig = {
  idle: {
    message: 'Ready to submit',
    icon: '⚪',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    showSpinner: false,
  },
  preparing: {
    message: 'Preparing transaction...',
    icon: '🔧',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    showSpinner: true,
  },
  signing: {
    message: '⏳ Please sign transaction in your wallet...',
    icon: '✍️',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    showSpinner: true,
  },
  confirming: {
    message: '🔄 Confirming on Base blockchain... (2 blocks)',
    icon: '⛓️',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    showSpinner: true,
  },
  syncing: {
    message: '💾 Updating database...',
    icon: '💽',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    showSpinner: true,
  },
  verifying: {
    message: 'Verifying on-chain status...',
    icon: '🔍',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    showSpinner: true,
  },
  success: {
    message: '✅ Transaction confirmed!',
    icon: '✨',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    showSpinner: false,
  },
  error: {
    message: '❌ Transaction failed',
    icon: '⚠️',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    showSpinner: false,
  },
};

export function TransactionStatus({
  status,
  transactionHash,
  error,
  className = '',
}: TransactionStatusProps) {
  const [copied, setCopied] = useState(false);

  const config = statusConfig[status];

  const handleCopyHash = async () => {
    if (!transactionHash) return;
    
    try {
      await navigator.clipboard.writeText(transactionHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy transaction hash:', err);
    }
  };

  if (status === 'idle') {
    return null;
  }

  return (
    <div
      className={`
        rounded-lg border-2 p-4 transition-all duration-300
        ${config.bgColor} ${config.borderColor}
        ${className}
      `}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start gap-3">
        {/* Status Indicator */}
        <div className="flex-shrink-0 mt-0.5">
          {config.showSpinner ? (
            <div
              className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="progressbar"
              aria-label="Loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <span className="text-xl" aria-hidden="true">
              {config.icon}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${config.color}`}>
            {config.message}
          </p>

          {/* Error Message */}
          {status === 'error' && error && (
            <p className="mt-2 text-sm text-red-700 break-words">
              {error.message || 'An unexpected error occurred'}
            </p>
          )}

          {/* Transaction Hash */}
          {transactionHash && (
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <BasescanLink
                transactionHash={transactionHash}
                type="tx"
                className="text-sm"
              />
              
              <button
                onClick={handleCopyHash}
                className={`
                  inline-flex items-center gap-1.5 px-2.5 py-1 rounded
                  text-xs font-medium transition-colors
                  ${copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                `}
                aria-label="Copy transaction hash to clipboard"
                disabled={copied}
              >
                {copied ? (
                  <>
                    <svg 
                      className="w-3.5 h-3.5" 
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
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg 
                      className="w-3.5 h-3.5" 
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
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Helper Text */}
          {status === 'signing' && (
            <p className="mt-2 text-xs text-gray-600">
              Check your wallet extension for the pending transaction
            </p>
          )}
          
          {status === 'confirming' && (
            <p className="mt-2 text-xs text-gray-600">
              Waiting for 2 block confirmations (~4 seconds on Base)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
