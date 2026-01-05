import { Metadata } from "next";
import { CreateDebateForm } from "@/components/debate/CreateDebateForm";

export const metadata: Metadata = {
  title: "Create Debate | Parrhesia",
  description: "Create a new debate on Parrhesia",
};

export default function CreateDebatePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Create New Debate
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Start a new debate by staking USDC and challenging the community
        </p>
      </div>

      <CreateDebateForm />
    </div>
  );
}
