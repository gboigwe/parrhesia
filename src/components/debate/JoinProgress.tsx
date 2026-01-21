/**
 * Join Progress Indicator
 * Shows multi-step progress for joining a debate
 */

"use client";

interface Step {
  id: string;
  label: string;
  status: "pending" | "active" | "completed" | "error";
}

interface JoinProgressProps {
  currentStep: "idle" | "approving" | "joining" | "confirming" | "complete" | "error";
  error?: string;
}

export function JoinProgress({ currentStep, error }: JoinProgressProps) {
  const steps: Step[] = [
    {
      id: "approve",
      label: "Approve USDC",
      status:
        currentStep === "idle"
          ? "pending"
          : currentStep === "approving"
          ? "active"
          : currentStep === "error"
          ? "error"
          : "completed",
    },
    {
      id: "join",
      label: "Join Debate",
      status:
        currentStep === "idle" || currentStep === "approving"
          ? "pending"
          : currentStep === "joining"
          ? "active"
          : currentStep === "error"
          ? "error"
          : "completed",
    },
    {
      id: "confirm",
      label: "Confirm Transaction",
      status:
        currentStep === "confirming"
          ? "active"
          : currentStep === "complete"
          ? "completed"
          : currentStep === "error"
          ? "error"
          : "pending",
    },
  ];

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="font-semibold mb-4">Joining Debate</h3>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-3">
            {/* Step Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {step.status === "completed" && (
                <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
              {step.status === "active" && (
                <div className="h-6 w-6 rounded-full border-2 border-blue-600 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-blue-600 animate-pulse" />
                </div>
              )}
              {step.status === "pending" && (
                <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">{index + 1}</span>
                </div>
              )}
              {step.status === "error" && (
                <div className="h-6 w-6 rounded-full bg-red-600 flex items-center justify-center">
                  <span className="text-white text-sm">✗</span>
                </div>
              )}
            </div>

            {/* Step Label */}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  step.status === "active"
                    ? "text-blue-900"
                    : step.status === "completed"
                    ? "text-green-900"
                    : step.status === "error"
                    ? "text-red-900"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
              {step.status === "active" && (
                <p className="text-sm text-blue-700 mt-1">In progress...</p>
              )}
              {step.status === "completed" && (
                <p className="text-sm text-green-700 mt-1">Complete</p>
              )}
              {step.status === "error" && error && (
                <p className="text-sm text-red-700 mt-1">{error}</p>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute left-[11px] mt-8 h-8 w-0.5 ${
                  step.status === "completed"
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
                style={{ marginLeft: "11px" }}
              />
            )}
          </div>
        ))}
      </div>

      {currentStep === "error" && error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {currentStep === "complete" && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Success!</strong> You've joined the debate
          </p>
        </div>
      )}
    </div>
  );
}
