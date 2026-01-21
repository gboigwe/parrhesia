/**
 * Join Loading States Component
 * Different loading states for join flow
 */

"use client";

export function ApprovingState() {
  return (
    <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <div>
        <p className="font-medium text-blue-900">Approving USDC...</p>
        <p className="text-sm text-blue-700">Please confirm in your wallet</p>
      </div>
    </div>
  );
}

export function JoiningState() {
  return (
    <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
      <div className="h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      <div>
        <p className="font-medium text-purple-900">Joining Debate...</p>
        <p className="text-sm text-purple-700">Transaction in progress</p>
      </div>
    </div>
  );
}

export function ConfirmingState() {
  return (
    <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="h-5 w-5 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
      <div>
        <p className="font-medium text-yellow-900">Confirming...</p>
        <p className="text-sm text-yellow-700">Waiting for block confirmation</p>
      </div>
    </div>
  );
}
