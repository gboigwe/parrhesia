/**
 * Join Debate Confirmation Modal
 * Shows debate details and confirms user wants to join
 */

"use client";

interface JoinConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  debateTopic: string;
  stakeAmount: number;
  creatorName: string;
}

export function JoinConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  debateTopic,
  stakeAmount,
  creatorName,
}: JoinConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Confirm Join Debate</h2>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Debate Topic</p>
            <p className="font-medium">{debateTopic}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Opponent</p>
            <p className="font-medium">{creatorName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Required Stake</p>
            <p className="font-medium text-blue-600">
              {stakeAmount} USDC
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> This will lock your USDC until the
              debate concludes. The winner receives 95% of the prize pool.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Confirm Join
          </button>
        </div>
      </div>
    </div>
  );
}
