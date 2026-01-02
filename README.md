# Parrhesia

> **Stake your truth. Where convictions meet consensus.**

![Base](https://img.shields.io/badge/Built%20on-Base-0052FF)
![License](https://img.shields.io/badge/license-MIT-green)

## What is Parrhesia?

**Parrhesia** (pa-REE-see-uh) comes from Ancient Greek φαρρησία (*parrhēsía*), meaning "fearless speech" or "bold truth-telling." It's about speaking your truth boldly and defending your position, even when stakes are high—literally.

Parrhesia is a decentralized debate platform where users stake USDC on their positions, engage in structured argumentation, and let the community decide winners through transparent voting mechanisms. The platform incentivizes quality discourse while creating an engaging prediction and opinion market.

## Core Features

### 🎯 For Everyone

- **Stake & Debate**: Put your money where your mouth is—stake USDC on your position
- **Earn Through Truth**: Win debates, earn prizes; vote accurately, earn rewards
- **Build Reputation**: Onchain reputation that follows you across Base
- **No Crypto Knowledge Required**: Seamless Smart Wallet onboarding with passkeys

### 🏆 Debate Formats

- **Binary Debates**: Clear opposing positions (e.g., "BTC will hit $100k in 2025")
- **Async Debates**: Thoughtful, extended arguments with 24-48hr response windows
- **Live Debates**: Real-time structured debates (coming soon)
- **Tournaments**: Bracket-style elimination competitions (coming soon)

### 🤖 AI-Powered Features

- **AI Judge**: Impartial evaluation using AgentKit with onchain judgment
- **AI Moderation**: Real-time civility enforcement
- **AI Coach**: Practice and improve your argumentation (coming soon)

### 🌐 Base Ecosystem Integration

- **Basenames**: Required identity system for all participants
- **Smart Wallets**: Passkey-based auth, no seed phrases
- **Gasless Transactions**: Vote, debate, and claim winnings without gas fees
- **USDC Native**: All stakes and prizes in USDC
- **OnchainKit**: Seamless wallet, identity, and transaction components

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Base SDK**: OnchainKit

### Backend
- **Runtime**: Node.js (TypeScript)
- **Framework**: Express
- **Database**: PostgreSQL + Redis
- **Storage**: IPFS (Pinata)

### Blockchain
- **Network**: Base L2
- **Wallets**: Coinbase Smart Wallet (CDP)
- **Contracts**: Solidity (Foundry/Hardhat)
- **AI Agents**: AgentKit

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL 14+
- Redis

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/parrhesia.git
cd parrhesia

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to see the app.

### Environment Variables

```env
# Coinbase Developer Platform
CDP_API_KEY=your_cdp_api_key
CDP_PROJECT_ID=your_project_id

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/parrhesia
REDIS_URL=redis://localhost:6379

# Base RPC
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# IPFS
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret

# AI (AgentKit)
ANTHROPIC_API_KEY=your_anthropic_key

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Project Structure

```
parrhesia/
├── app/                    # Next.js 14 app directory
│   ├── (auth)/            # Auth-related pages
│   ├── (debates)/         # Debate pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── debate/           # Debate-specific components
│   ├── onchain/          # OnchainKit wrappers
│   ├── ui/               # Reusable UI components
│   └── user/             # User profile components
├── contracts/            # Smart contracts
│   ├── src/              # Solidity source files
│   ├── test/             # Contract tests
│   └── script/           # Deployment scripts
├── lib/                  # Utility functions
│   ├── blockchain/       # Web3 utilities
│   ├── database/         # DB utilities
│   └── ai/               # AgentKit integration
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## Smart Contracts

### Core Contracts

- **DebateFactory.sol**: Creates and manages debate instances
- **DebatePool.sol**: Escrows stakes and distributes prizes
- **VotingManager.sol**: Handles weighted voting and results
- **ReputationRegistry.sol**: Tracks onchain reputation scores
- **BadgeNFT.sol**: Achievement badges (ERC-721, soulbound)

### Deployment

```bash
# Deploy to Base Sepolia (testnet)
cd contracts
forge script script/Deploy.s.sol --rpc-url base-sepolia --broadcast

# Deploy to Base Mainnet
forge script script/Deploy.s.sol --rpc-url base --broadcast --verify
```

## Development Workflow

### Running Tests

```bash
# Frontend tests
pnpm test

# Smart contract tests
cd contracts
forge test

# E2E tests
pnpm test:e2e
```

### Code Quality

```bash
# Linting
pnpm lint

# Type checking
pnpm typecheck

# Format code
pnpm format
```

## Base Tools Utilized

✅ **OnchainKit**: Identity, Wallet, Transaction, Checkout components
✅ **Smart Wallet**: Passkey authentication, gasless transactions
✅ **Basenames**: Required identity for all users
✅ **Paymaster**: Sponsored gas for voting and debate actions
✅ **AgentKit**: AI judges, coaches, and moderators with wallets
✅ **CDP APIs**: Wallet creation, onramp, transaction management

## Roadmap

### Phase 1: MVP (Current)
- ✅ Basic async debate creation
- ✅ Community voting system
- ✅ Stake & prize distribution
- ✅ Basename integration
- ✅ Smart Wallet onboarding

### Phase 2: Enhanced Experience
- ⏳ Live timed debates
- ⏳ AI Judge (AgentKit)
- ⏳ Reputation & leaderboards
- ⏳ Badge NFTs
- ⏳ Warpcast frames

### Phase 3: Full Platform
- ⏳ AI Coach agent
- ⏳ Tournament system
- ⏳ Expert panels
- ⏳ Governance

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

Security is our top priority. If you discover a vulnerability:

- **DO NOT** open a public issue
- Email security@parrhesia.xyz with details
- We'll respond within 48 hours

For smart contract audits and bug bounties, see [SECURITY.md](SECURITY.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built on [Base](https://base.org) - Ethereum L2 for the next billion users
- Powered by [OnchainKit](https://onchainkit.xyz) - Coinbase's Base toolkit
- AI agents via [AgentKit](https://github.com/coinbase/agentkit) - Autonomous onchain agents
- Inspired by the ancient Greek tradition of *parrhēsía* - fearless truth-telling

## Links

- **Website**: [parrhesia.xyz](https://parrhesia.xyz) (coming soon)
- **Twitter**: [@ParrhesiaHQ](https://twitter.com/ParrhesiaHQ)
- **Discord**: [Join our community](https://discord.gg/parrhesia)
- **Docs**: [docs.parrhesia.xyz](https://docs.parrhesia.xyz) (coming soon)

---

**Speak boldly. Stake honestly.**
