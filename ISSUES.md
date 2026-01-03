# Parrhesia MVP Development Issues

**Total Issues: 20**
**Branch Naming Convention**: `issue-{number}-{short-description}`
**Commit Message Format**: Max 50 characters per commit
**Minimum Commits per Issue**: 15 commits

---

## Issue #1: Setup Project Dependencies & Base Tooling

**Branch**: `issue-1-setup-dependencies`

### Objective
Install and configure all necessary dependencies for Parrhesia including OnchainKit, Wagmi, Viem, and Base-specific tooling.

### Tasks
- [ ] Install @coinbase/onchainkit with Base configuration
- [ ] Install wagmi v2 and viem for wallet connections
- [ ] Install zustand for global state management
- [ ] Install @tanstack/react-query for data fetching
- [ ] Configure TypeScript strict mode and paths
- [ ] Install zod for runtime schema validation
- [ ] Install react-hook-form with resolvers
- [ ] Install lucide-react for icon system
- [ ] Install clsx and tailwind-merge utilities
- [ ] Create lib/utils.ts with cn() helper function
- [ ] Create .env.example with all required variables
- [ ] Setup .env.local with development keys
- [ ] Configure next.config.ts for Base optimizations
- [ ] Update package.json scripts for development
- [ ] Document all dependencies and their purposes

### Acceptance Criteria
- All Base ecosystem dependencies installed and working
- Environment variables properly structured
- TypeScript compiles with strict mode enabled
- Development server runs without errors
- All utility functions properly typed

### Estimated Commits: 15+

---

## Issue #2: Database Setup with PostgreSQL & Drizzle ORM

**Branch**: `issue-2-database-setup`

### Objective
Setup PostgreSQL database with Drizzle ORM, create initial schema for users, debates, votes, and reputation tracking.

### Tasks
- [ ] Install drizzle-orm and drizzle-kit
- [ ] Install postgres driver
- [ ] Create drizzle.config.ts configuration
- [ ] Setup database connection in lib/db/index.ts
- [ ] Create users schema with Basename fields
- [ ] Create debates schema with all debate fields
- [ ] Create arguments schema for async debates
- [ ] Create votes schema with weighted scoring
- [ ] Create reputation_events schema for tracking
- [ ] Create badges schema for achievements
- [ ] Add indexes for performance optimization
- [ ] Create migration scripts
- [ ] Setup database seeding for development
- [ ] Test database connections and queries
- [ ] Document database schema and relationships

### Acceptance Criteria
- PostgreSQL connected successfully
- All tables created with proper relationships
- Migrations run successfully
- Type-safe queries working with Drizzle
- Development seed data available

### Estimated Commits: 15+

---

## Issue #3: Smart Contracts Foundation - Factory & Pool

**Branch**: `issue-3-smart-contracts-foundation`

### Objective
Create core smart contracts using Foundry: DebateFactory and DebatePool for managing debates and escrow.

### Tasks
- [ ] Initialize Foundry project in /contracts directory
- [ ] Install OpenZeppelin contracts dependencies
- [ ] Create DebateFactory.sol with UUPS proxy
- [ ] Implement createDebate() function
- [ ] Create DebatePool.sol for stake escrow
- [ ] Implement stake() function with USDC support
- [ ] Implement distributePrizes() with percentages
- [ ] Add emergency withdrawal mechanism
- [ ] Implement pausable functionality
- [ ] Add access control with roles
- [ ] Create comprehensive Foundry tests
- [ ] Setup deployment scripts for Base Sepolia
- [ ] Configure gas optimizations
- [ ] Add NatSpec documentation to contracts
- [ ] Deploy and verify on Base Sepolia testnet

### Acceptance Criteria
- All contracts compile without warnings
- 100% test coverage on core functions
- Contracts deployed to Base Sepolia
- Verified on Basescan
- Gas optimized for efficiency

### Estimated Commits: 18+

---

## Issue #4: Voting & Reputation Smart Contracts

**Branch**: `issue-4-voting-reputation-contracts`

### Objective
Create VotingManager and ReputationRegistry smart contracts for weighted voting and onchain reputation tracking.

### Tasks
- [ ] Create VotingManager.sol contract
- [ ] Implement submitVote() with weighted scoring
- [ ] Implement finalizeResults() calculation logic
- [ ] Add anti-gaming measures (prevent double voting)
- [ ] Create ReputationRegistry.sol contract
- [ ] Implement updateScore() for debaters
- [ ] Implement updateVoterScore() for voters
- [ ] Add Basename integration for reputation queries
- [ ] Create events for all state changes
- [ ] Add vote staking mechanism (optional)
- [ ] Write comprehensive Foundry tests
- [ ] Test edge cases (ties, disputes, etc.)
- [ ] Optimize gas for batch operations
- [ ] Deploy to Base Sepolia
- [ ] Verify contracts on Basescan

### Acceptance Criteria
- Voting system works with weighted calculations
- Reputation updates correctly onchain
- All edge cases handled properly
- Contracts deployed and verified
- Integration tests passing

### Estimated Commits: 16+

---

## Issue #5: Badge NFT Contract (ERC-721 Soulbound)

**Branch**: `issue-5-badge-nft-contract`

### Objective
Create BadgeNFT contract for achievement badges as soulbound (non-transferable) tokens.

### Tasks
- [ ] Create BadgeNFT.sol as ERC-721
- [ ] Implement soulbound mechanism (block transfers)
- [ ] Create badge types enum (First Win, Streak, etc.)
- [ ] Implement mint() function with access control
- [ ] Implement batchMint() for efficiency
- [ ] Add metadata URI structure for IPFS
- [ ] Create badge achievement logic
- [ ] Add queryByBasename() function
- [ ] Implement badge enumeration functions
- [ ] Create badge metadata JSON templates
- [ ] Write comprehensive tests for minting
- [ ] Test soulbound transfer blocking
- [ ] Setup IPFS integration for metadata
- [ ] Deploy to Base Sepolia
- [ ] Upload sample badge metadata to IPFS

### Acceptance Criteria
- Badges are non-transferable (soulbound)
- Metadata properly stored on IPFS
- Query functions work correctly
- All tests passing
- Deployed and verified on Base Sepolia

### Estimated Commits: 15+

---

## Issue #6: OnchainKit Wallet Integration

**Branch**: `issue-6-onchainkit-wallet`

### Objective
Integrate OnchainKit wallet components with Smart Wallet support and Basename identity.

### Tasks
- [ ] Install and configure OnchainKit providers
- [ ] Create OnchainProviders wrapper component
- [ ] Configure wagmi with Base network settings
- [ ] Setup Smart Wallet configuration
- [ ] Create WalletButton component using OnchainKit
- [ ] Implement wallet connection flow
- [ ] Add Basename display in wallet dropdown
- [ ] Create useSmartWallet custom hook
- [ ] Add wallet balance display (USDC)
- [ ] Implement disconnect functionality
- [ ] Test passkey-based authentication
- [ ] Add wallet network switching
- [ ] Handle wallet connection errors
- [ ] Create wallet connection state management
- [ ] Document wallet integration patterns

### Acceptance Criteria
- Smart Wallet connects with passkeys
- Basename displays correctly
- Network switching works properly
- USDC balance shows accurately
- All edge cases handled

### Estimated Commits: 15+

---

## Issue #7: Paymaster Integration for Gasless Transactions

**Branch**: `issue-7-paymaster-integration`

### Objective
Configure Coinbase Paymaster for gasless transactions on voting, debate creation, and claiming prizes.

### Tasks
- [ ] Setup Paymaster configuration in OnchainKit
- [ ] Configure sponsored action policies
- [ ] Create PaymasterProvider component
- [ ] Implement gasless voting transactions
- [ ] Implement gasless debate creation
- [ ] Implement gasless prize claiming
- [ ] Add spending limits per user
- [ ] Create Paymaster monitoring dashboard data
- [ ] Test gasless transaction flows
- [ ] Handle Paymaster failures gracefully
- [ ] Add fallback to user-paid transactions
- [ ] Create Paymaster cost tracking
- [ ] Document sponsored actions
- [ ] Setup rate limiting for abuse prevention
- [ ] Test with multiple concurrent users

### Acceptance Criteria
- Voting is completely gasless
- Debate creation sponsored (within limits)
- Claiming prizes is gasless
- Fallback works when Paymaster fails
- Rate limiting prevents abuse

### Estimated Commits: 15+

---

## Issue #8: UI Component Library Foundation

**Branch**: `issue-8-ui-components`

### Objective
Create reusable UI component library using Tailwind CSS and OnchainKit design system.

### Tasks
- [ ] Create components/ui/button.tsx component
- [ ] Create components/ui/card.tsx component
- [ ] Create components/ui/input.tsx component
- [ ] Create components/ui/textarea.tsx component
- [ ] Create components/ui/badge.tsx component
- [ ] Create components/ui/avatar.tsx component
- [ ] Create components/ui/dialog.tsx modal component
- [ ] Create components/ui/dropdown-menu.tsx
- [ ] Create components/ui/tabs.tsx component
- [ ] Create components/ui/toast.tsx notifications
- [ ] Create components/ui/skeleton.tsx loaders
- [ ] Setup consistent color scheme matching Base
- [ ] Add responsive design utilities
- [ ] Create component documentation
- [ ] Test all components in isolation

### Acceptance Criteria
- All base UI components created
- Consistent design system applied
- Components are fully typed
- Responsive on all screen sizes
- Accessible (ARIA labels, keyboard navigation)

### Estimated Commits: 15+

---

## Issue #9: Debate-Specific UI Components

**Branch**: `issue-9-debate-components`

### Objective
Create debate-specific components including DebateCard, ArgumentThread, and VotingPanel.

### Tasks
- [ ] Create components/debate/DebateCard.tsx
- [ ] Add debate metadata display
- [ ] Create components/debate/DebateStatus.tsx
- [ ] Create components/debate/StakeDisplay.tsx
- [ ] Create components/debate/ArgumentCard.tsx
- [ ] Create components/debate/ArgumentThread.tsx
- [ ] Create components/debate/VotingPanel.tsx
- [ ] Add voting criteria scorecard UI
- [ ] Create components/debate/TimerDisplay.tsx
- [ ] Create components/debate/ParticipantInfo.tsx
- [ ] Add Basename integration in participant display
- [ ] Create debate category badge component
- [ ] Add debate share functionality
- [ ] Style all components with Tailwind
- [ ] Make components mobile responsive

### Acceptance Criteria
- All debate components render correctly
- Debate data displays properly
- Components are reusable
- Mobile responsive design
- Basename integration working

### Estimated Commits: 15+

---

## Issue #10: User Profile & Reputation Components

**Branch**: `issue-10-profile-components`

### Objective
Create user profile components with Basename identity, reputation scores, and badge display.

### Tasks
- [ ] Create components/user/ProfileCard.tsx
- [ ] Integrate OnchainKit Identity components
- [ ] Create components/user/ReputationDisplay.tsx
- [ ] Add reputation score visualization
- [ ] Create components/user/BadgeCollection.tsx
- [ ] Display user's earned badges
- [ ] Create components/user/DebateHistory.tsx
- [ ] Add win/loss statistics display
- [ ] Create components/user/StatsOverview.tsx
- [ ] Implement user activity timeline
- [ ] Add follower/following functionality UI
- [ ] Create profile edit modal
- [ ] Add Basename verification badge
- [ ] Style profile with Base design system
- [ ] Make profile mobile responsive

### Acceptance Criteria
- Profile displays Basename correctly
- Reputation scores visible and accurate
- Badges displayed properly
- History shows all user debates
- Fully responsive on mobile

### Estimated Commits: 15+

---

## Issue #11: Debate Creation Flow & Form

**Branch**: `issue-11-debate-creation`

### Objective
Build complete debate creation flow with form validation, stake selection, and smart contract integration.

### Tasks
- [ ] Create app/debates/create/page.tsx
- [ ] Create CreateDebateForm component
- [ ] Add topic/resolution input with validation
- [ ] Create category selection dropdown
- [ ] Add debate format selection (async/timed)
- [ ] Create stake amount selector
- [ ] Add debate duration settings
- [ ] Implement form validation with zod schema
- [ ] Create CreateDebateButton with OnchainKit
- [ ] Integrate DebateFactory contract call
- [ ] Add USDC approval flow
- [ ] Handle transaction states (pending/success/error)
- [ ] Add transaction confirmation modal
- [ ] Create debate created success screen
- [ ] Test complete creation flow

### Acceptance Criteria
- Form validates all inputs correctly
- USDC approval works smoothly
- Debate created onchain successfully
- User redirected to debate page
- All errors handled gracefully

### Estimated Commits: 16+

---

## Issue #12: Debate Discovery & List Page

**Branch**: `issue-12-debate-discovery`

### Objective
Create debate discovery page with filtering, search, and pagination functionality.

### Tasks
- [ ] Create app/debates/page.tsx
- [ ] Create DebateList component
- [ ] Implement debate card grid layout
- [ ] Add category filter functionality
- [ ] Create search bar for topic search
- [ ] Add status filter (open/active/completed)
- [ ] Implement stake range filter
- [ ] Create sort options (newest/popular/stake)
- [ ] Add pagination with infinite scroll
- [ ] Integrate TanStack Query for data fetching
- [ ] Create API route /api/debates GET
- [ ] Add loading skeletons
- [ ] Implement empty state UI
- [ ] Add responsive grid layout
- [ ] Test filtering and search performance

### Acceptance Criteria
- All debates display correctly
- Filters work without page reload
- Search returns relevant results
- Pagination loads smoothly
- Mobile responsive layout

### Estimated Commits: 15+

---

## Issue #13: Individual Debate Page & Argument Display

**Branch**: `issue-13-debate-page`

### Objective
Create individual debate page showing participants, arguments, and debate status.

### Tasks
- [ ] Create app/debates/[id]/page.tsx
- [ ] Fetch debate details from database
- [ ] Display debate topic and resolution
- [ ] Show both participants with Basenames
- [ ] Create DebateHeader component
- [ ] Display stake amounts and prize pool
- [ ] Create ArgumentList component
- [ ] Show all arguments in thread format
- [ ] Add argument submission form
- [ ] Implement character limit counter
- [ ] Add source citation input
- [ ] Create submit argument API endpoint
- [ ] Integrate with DebatePool contract
- [ ] Add real-time updates for new arguments
- [ ] Test argument submission flow

### Acceptance Criteria
- Debate details load correctly
- Arguments display in proper order
- Users can submit arguments
- Real-time updates work
- Mobile responsive design

### Estimated Commits: 16+

---

## Issue #14: Voting Interface & Weighted Scoring

**Branch**: `issue-14-voting-interface`

### Objective
Build comprehensive voting interface with weighted criteria scoring and vote submission.

### Tasks
- [ ] Create VotingInterface component
- [ ] Add voting eligibility check (Basename)
- [ ] Create scoring sliders for each criterion
- [ ] Implement Argument Quality scoring (30%)
- [ ] Implement Rebuttal Strength scoring (25%)
- [ ] Implement Clarity scoring (20%)
- [ ] Implement Evidence Quality scoring (15%)
- [ ] Implement Persuasiveness scoring (10%)
- [ ] Calculate weighted total score
- [ ] Add optional written feedback textarea
- [ ] Create SubmitVoteButton with OnchainKit
- [ ] Integrate VotingManager contract
- [ ] Show vote confirmation modal
- [ ] Add vote submitted success state
- [ ] Test voting flow end-to-end

### Acceptance Criteria
- All scoring criteria functional
- Weighted calculation accurate
- Vote submits to contract successfully
- Gasless voting works via Paymaster
- Voting UI intuitive and clear

### Estimated Commits: 15+

---

## Issue #15: Results Display & Prize Distribution

**Branch**: `issue-15-results-distribution`

### Objective
Create results display showing vote breakdown and implement prize distribution mechanism.

### Tasks
- [ ] Create DebateResults component
- [ ] Display final vote counts and percentages
- [ ] Show winning debater announcement
- [ ] Create criteria breakdown visualization
- [ ] Display voter participation count
- [ ] Create PrizeBreakdown component
- [ ] Show prize distribution amounts
- [ ] Add platform fee breakdown
- [ ] Create ClaimPrizeButton component
- [ ] Integrate DebatePool.claimPrize()
- [ ] Handle prize claiming transaction
- [ ] Add claim success notification
- [ ] Show voter rewards distribution
- [ ] Update reputation scores onchain
- [ ] Test full distribution flow

### Acceptance Criteria
- Results display accurately
- Prize amounts calculated correctly
- Winners can claim prizes
- Reputation updated onchain
- All transactions complete successfully

### Estimated Commits: 15+

---

## Issue #16: Reputation System & Leaderboards

**Branch**: `issue-16-reputation-leaderboards`

### Objective
Implement comprehensive reputation calculation system and leaderboard displays.

### Tasks
- [ ] Create reputation calculation service
- [ ] Implement debater reputation formula
- [ ] Calculate win rate component (25%)
- [ ] Calculate average vote scores (30%)
- [ ] Calculate participation component (10%)
- [ ] Calculate topic complexity bonus (10%)
- [ ] Calculate consistency score (15%)
- [ ] Implement voter reputation formula
- [ ] Create app/leaderboard/page.tsx
- [ ] Create LeaderboardTable component
- [ ] Add debater rankings tab
- [ ] Add voter rankings tab
- [ ] Add category-specific rankings
- [ ] Create reputation update API endpoint
- [ ] Test reputation calculations

### Acceptance Criteria
- Reputation formulas calculate correctly
- Leaderboards display top users
- Rankings update after each debate
- Category filtering works
- Mobile responsive tables

### Estimated Commits: 16+

---

## Issue #17: Badge System & Achievement Tracking

**Branch**: `issue-17-badge-achievements`

### Objective
Implement badge achievement tracking and NFT minting for earned achievements.

### Tasks
- [ ] Create badge achievement detection service
- [ ] Implement "First Win" badge logic
- [ ] Implement "10-Win Streak" badge logic
- [ ] Implement "Giant Slayer" badge logic
- [ ] Implement "Specialist" badge logic
- [ ] Implement voter badges (100 votes, etc.)
- [ ] Create badge metadata generator
- [ ] Upload badge images to IPFS
- [ ] Create badge minting service
- [ ] Integrate BadgeNFT contract minting
- [ ] Create badge notification system
- [ ] Add badge display in profile
- [ ] Create badge detail modal
- [ ] Add badge sharing functionality
- [ ] Test badge earning flow

### Acceptance Criteria
- Badges detected automatically
- NFTs minted successfully
- Metadata stored on IPFS correctly
- Users notified of new badges
- Badges display in profile

### Estimated Commits: 15+

---

## Issue #18: AgentKit AI Judge Integration

**Branch**: `issue-18-ai-judge`

### Objective
Integrate AgentKit to create AI Judge agent for automated debate evaluation.

### Tasks
- [ ] Install @coinbase/agentkit-core
- [ ] Create lib/ai/judge-agent.ts
- [ ] Initialize AgentKit with Smart Wallet
- [ ] Configure Claude Sonnet 4.5 model
- [ ] Create judge evaluation prompt template
- [ ] Implement argument analysis logic
- [ ] Add fact-checking via web search tool
- [ ] Implement logical fallacy detection
- [ ] Create scoring calculation for AI judge
- [ ] Add contract write tool for judgment
- [ ] Create API endpoint /api/ai/judge
- [ ] Test AI evaluation accuracy
- [ ] Add AI judge option in debate creation
- [ ] Display AI judge results
- [ ] Handle AI judge errors gracefully

### Acceptance Criteria
- AI Judge analyzes arguments correctly
- Scores are fair and justified
- Judgment submitted onchain
- AI judge optional for debates
- Results transparent and explainable

### Estimated Commits: 16+

---

## Issue #19: AI Moderation & Content Filtering

**Branch**: `issue-19-ai-moderation`

### Objective
Implement AI moderation agent for real-time content filtering and civility enforcement.

### Tasks
- [ ] Create lib/ai/moderator-agent.ts
- [ ] Initialize moderation agent with AgentKit
- [ ] Create content analysis prompt
- [ ] Implement profanity detection
- [ ] Implement ad hominem attack detection
- [ ] Implement hate speech detection
- [ ] Implement spam/gibberish detection
- [ ] Create moderation API endpoint
- [ ] Integrate moderation in argument submission
- [ ] Add content flagging system
- [ ] Create moderation dashboard for admin
- [ ] Implement warning system for users
- [ ] Add appeal mechanism for false flags
- [ ] Test moderation accuracy
- [ ] Document moderation policies

### Acceptance Criteria
- Inappropriate content blocked
- False positive rate < 5%
- Users warned before action taken
- Appeals process functional
- Moderation transparent

### Estimated Commits: 15+

---

## Issue #20: Testing, Documentation & Deployment

**Branch**: `issue-20-testing-deployment`

### Objective
Comprehensive testing, documentation, and production deployment to Base mainnet.

### Tasks
- [ ] Write unit tests for all components
- [ ] Write integration tests for debate flow
- [ ] Write E2E tests with Playwright
- [ ] Test smart contracts on mainnet fork
- [ ] Create deployment checklist
- [ ] Audit smart contracts security
- [ ] Deploy contracts to Base mainnet
- [ ] Verify all contracts on Basescan
- [ ] Deploy frontend to Vercel
- [ ] Configure production environment variables
- [ ] Setup production database on Supabase
- [ ] Configure production Paymaster
- [ ] Setup monitoring with Sentry
- [ ] Create user documentation
- [ ] Final QA testing on production

### Acceptance Criteria
- 80%+ test coverage
- All contracts audited and secure
- Production deployed successfully
- All Base tools working in production
- Documentation complete

### Estimated Commits: 18+

---

## Summary

**Total Issues**: 20
**Estimated Total Commits**: 310+ commits
**Development Flow**:
1. Start with issue #1
2. Create branch: `git checkout -b issue-1-setup-dependencies`
3. Make at least 15 commits (50 chars max per message)
4. Push branch: `git push -u origin issue-1-setup-dependencies`
5. User creates PR and merges
6. Repeat for issues #2-20

**Key Principles**:
- Each commit should be atomic and focused
- Commit messages must not exceed 50 characters
- No .md files committed except README.md
- Minimum 15 commits per issue
- Each issue results in one PR to main
