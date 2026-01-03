import { Navbar } from "@/components/layout/Navbar";
import { ConnectWallet } from "@/components/auth/ConnectWallet";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Parrhesia
            </h1>
            <p className="text-2xl text-gray-600 dark:text-gray-300">
              Stake Your Truth
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Decentralized debate platform on Base. Stake USDC, debate boldly, and let the
              community decide.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 pt-8">
            <ConnectWallet />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connect your Smart Wallet to get started
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-16">
            <FeatureCard
              icon="💰"
              title="Stake USDC"
              description="Put your money where your mouth is. Stake USDC on your position."
            />
            <FeatureCard
              icon="⚔️"
              title="Debate Boldly"
              description="Engage in structured debates with clear rules and timeframes."
            />
            <FeatureCard
              icon="🗳️"
              title="Community Votes"
              description="Let the community decide winners based on merit, not popularity."
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
