# Product Requirements Document: Onchain Debate Arena

## **Product Overview**

### Vision Statement
A decentralized debate platform where users stake USDC on their positions, engage in structured argumentation, and let the community decide winners through transparent voting mechanisms. The platform incentivizes quality discourse while creating an engaging prediction/opinion market.

### Core Value Propositions
- **For Debaters**: Earn USDC by persuading community with quality arguments; build onchain reputation
- **For Voters**: Participate in intellectual discourse; earn voting rewards for quality curation
- **For Spectators**: Access quality debates on important topics; learn multiple perspectives
- **For Base Ecosystem**: Showcase consumer-friendly dApp with real utility; drive Smart Wallet adoption

---

## **Core Features & Requirements**

### **1. Debate Creation & Management**

#### 1.1 Debate Types
- **Binary Debates**: Two clear opposing positions (e.g., "Bitcoin will hit $100k in 2026: Yes vs No")
- **Multi-Position Debates**: 3-4 distinct viewpoints on complex topics
- **Timed Debates**: Live, synchronous debates with real-time responses (15-60 min sessions)
- **Async Debates**: Extended debates where participants respond within 24-48hr windows
- **Tournament Debates**: Bracket-style elimination competitions

#### 1.2 Topic Categories
- Crypto/Web3 Predictions
- Technology & AI
- Policy & Governance
- Economics & Finance
- Social Issues
- Entertainment & Culture
- DAOs & Protocol Governance
- Custom (user-proposed)

#### 1.3 Debate Creation Requirements
- Topic/resolution statement (clear, specific, debatable)
- Debate format selection (timed/async, rounds, duration)
- Stake amount (minimum 5 USDC, maximum 1000 USDC per side)
- Entry requirements (reputation score, previous participation, qualifications)
- Judging mechanism (community vote, expert panel, AI judge, or hybrid)
- Start time and registration deadline
- Optional: Supporting materials upload (data, sources, context)

#### 1.4 Matching System
- **Open Debates**: Anyone meeting requirements can join opposing side
- **Challenge System**: User A creates debate, challenges User B specifically
- **Auto-Matching**: Platform matches users based on expertise, reputation, opposing views
- **Tag System**: Users set debate interest tags, get notified of relevant debates

---

### **2. Staking & Prize Pool Mechanics**

#### 2.1 Stake Structure
- Both debaters stake equal USDC amounts (symmetrical stakes)
- Stakes locked in smart contract at debate start
- Platform fee: 3-5% of total pool (adjustable via governance)
- Voter rewards: 10-15% of total pool distributed to quality voters
- Winner takes: 75-82% of total pool
- Optional: Loser gets participation consolation (5% of their stake back)

#### 2.2 Multi-Stake Options
- **Team Debates**: Multiple debaters per side pool stakes together
- **Audience Co-Staking**: Spectators can add to prize pool, betting on winner
- **Sponsored Debates**: DAOs/protocols sponsor debates on relevant topics (larger pools)
- **Progressive Stakes**: Stakes increase each round in tournament format

#### 2.3 Edge Cases
- If debater doesn't show up: Auto-forfeit, stake goes to present debater
- Tie votes: Pool split 50/50 minus platform fee
- Disputed results: Appeal mechanism with secondary voting round

---

### **3. Debate Execution & Format**

#### 3.1 Structured Rounds (Timed Debates)
- **Opening Statements** (3-5 min each): Present core arguments
- **Rebuttal Round 1** (2-3 min each): Address opponent's points
- **Cross-Examination** (4-6 min): Direct questions to opponent
- **Rebuttal Round 2** (2-3 min each): Final counter-arguments
- **Closing Statements** (2-3 min each): Summarize position
- **Optional Q&A** (5-10 min): Community asks questions

#### 3.2 Async Debate Flow
- Post 1: Initial position (48hr to respond)
- Post 2: Counter-position (24hr to respond)
- Post 3-6: Back-and-forth exchanges (24hr windows)
- Post 7: Final summaries from both sides
- Voting period: 48-72 hours after completion

#### 3.3 Content Requirements
- Text arguments (200-1000 words per round)
- Optional: Embedded media (charts, images, videos under 2MB)
- Source citations for factual claims
- Character limits to prevent spam/walls of text
- Profanity filter and civility enforcement
- No ad hominem attacks (AI moderation flags violations)

#### 3.4 Live Features (Timed Debates)
- Real-time text streaming
- Live viewer count
- Live reactions from audience (emoji reactions, not votes)
- Chat sidebar for spectators (moderated)
- Timer display showing remaining time per round
- Turn indicator showing who's currently speaking

---

### **4. Voting & Judgment System**

#### 4.1 Voter Eligibility
- **Minimum Requirements**:
  - Must hold a Basename
  - Must have >0 reputation score OR have completed verification
  - Must have voted in at least 1 previous debate (after first vote)
  - Optional: Stake small amount (1-2 USDC) to vote (prevents Sybil, refunded if vote aligned with majority)

#### 4.2 Voting Criteria (Weighted Scoring)
Voters rate each debater on:
- **Argument Quality** (30%): Logic, evidence, reasoning
- **Rebuttal Strength** (25%): How well they countered opponent
- **Clarity & Communication** (20%): Understandability, organization
- **Evidence & Sources** (15%): Quality and relevance of supporting data
- **Persuasiveness** (10%): Overall convincing power

Voters provide:
- Score for each criterion (1-10 scale)
- Optional written feedback
- Overall winner selection

#### 4.3 Vote Weighting System
Votes weighted by:
- Voter reputation score (higher rep = higher weight)
- Historical voting accuracy (aligned with consensus)
- Domain expertise (if topic-tagged)
- Stake amount (if applicable)
- Account age and activity

#### 4.4 Voting Mechanisms
- **Community Vote**: Open to all eligible voters (default)
- **Quadratic Voting**: Voters can allocate multiple votes with diminishing returns
- **Expert Panel**: Pre-selected judges with high domain expertise (premium debates)
- **AI Judge**: AgentKit-powered AI evaluates arguments based on logic, evidence, coherence
- **Hybrid**: Combination of community + AI (70% community, 30% AI)

#### 4.5 Voting Timeline
- Voting opens: Immediately after debate ends
- Voting duration: 48-72 hours (longer for complex topics)
- Early voting bonus: Slight reward boost for voting within first 24hrs
- Results reveal: Delayed to prevent anchoring bias
- Real-time vote count: Hidden until voting closes

#### 4.6 Anti-Gaming Measures
- Vote brigading detection (unusual voting patterns flagged)
- Collusion prevention (debaters can't vote on own debates)
- Alt account detection (linked wallets identified via behavioral analysis)
- Reputation slashing for consistently outlier votes
- Random vote auditing by AI judge

---

### **5. Identity & Reputation System**

#### 5.1 Basename Integration
- Required for all participants (debaters + voters)
- Display Basename throughout platform
- Link to Basename profile showing debate history
- Basename serves as portable identity across Base ecosystem

#### 5.2 Reputation Scoring
**Debater Reputation (0-100 scale)**:
- Win rate (25%)
- Average vote scores received (30%)
- Total debates participated (10%)
- Complexity of topics tackled (10%)
- Consistency (no forfeits/violations) (15%)
- Peer endorsements (10%)

**Voter Reputation (0-100 scale)**:
- Voting accuracy (alignment with consensus) (35%)
- Total votes cast (15%)
- Vote explanation quality (20%)
- Domain expertise demonstrated (15%)
- Consistency (no random/suspicious patterns) (15%)

#### 5.3 Achievement System (Onchain Badges)
- **Debater Badges**: First Win, 10-Win Streak, Giant Slayer (beat higher-rep opponent), Specialist (10 wins in one category), Undefeated Champion
- **Voter Badges**: 100 Votes Cast, Consensus Builder (95%+ accuracy), Early Adopter, Category Expert
- **Special Badges**: Tournament Winner, Debate Pioneer, Community Favorite

#### 5.4 Leaderboards
- Global debater rankings
- Category-specific rankings
- Voter influence rankings
- Monthly/All-time stats
- Regional leaderboards (if applicable)

---

### **6. AI Integration (AgentKit)**

#### 6.1 AI Judge/Moderator Agent
- Deploys via AgentKit with wallet for onchain transactions
- Analyzes arguments using Claude/GPT-4 for:
  - Logical fallacy detection
  - Fact-checking claims (via web search)
  - Source credibility assessment
  - Argument structure analysis
  - Coherence and clarity scoring
- Provides detailed scoring breakdown
- Can be selected as judge option for debates
- Continuously learns from human voting patterns

#### 6.2 AI Debate Coach Agent
- Helps users prepare arguments
- Suggests counter-arguments to test positions
- Recommends relevant sources and evidence
- Provides practice rounds against AI opponent
- Analyzes past debate performance and suggests improvements
- Paid feature: 5-10 USDC per coaching session (agent earns fees)

#### 6.3 AI Moderation Agent
- Real-time monitoring for civility violations
- Flags inappropriate content for human review
- Detects potential plagiarism or copy-paste arguments
- Monitors voting patterns for anomalies
- Sends automated warnings for rule violations

#### 6.4 AI Summary Agent
- Generates concise debate summaries for spectators
- Creates highlight reels of key moments
- Produces shareable content for social media
- Available immediately after debate ends

---

### **7. Smart Wallet Integration**

#### 7.1 Onboarding Flow
- One-click Smart Wallet creation (passkey-based, no seed phrases)
- Gasless account creation (Paymaster sponsored)
- Fiat onramp integration via Coinbase Pay
- Buy USDC directly in-app with credit card
- No complex blockchain knowledge required

#### 7.2 Gasless Transactions (Paymaster)
**Platform-Sponsored Actions**:
- Creating debates (sponsored up to once/day per user)
- Voting on debates (fully sponsored)
- Claiming winnings (sponsored)
- Updating profile/Basename (sponsored monthly)

**User-Paid Actions**:
- Large stake debates (>100 USDC)
- Withdrawing funds to external wallet
- Creating sponsored debates with premium features

#### 7.3 USDC-Native Experience
- All stakes, prizes, fees in USDC (no native ETH needed)
- Paymaster allows paying gas in USDC
- Seamless USDC deposits from Coinbase account
- Display balances in USD terms for clarity

---

### **8. Social & Discovery Features**

#### 8.1 Social Feed
- Discover trending debates
- Follow favorite debaters
- Tag-based topic filtering
- Personalized recommendations based on voting history
- Share debates to Warpcast/X/Farcaster with preview cards

#### 8.2 Debate Library
- Archive of completed debates
- Searchable by topic, participant, date, outcome
- Filter by category, stake size, format
- Bookmark debates for later
- Create curated debate collections

#### 8.3 Community Features
- Debater profiles with full history
- Follow/subscriber system
- Direct challenges between users
- Group debates (team vs team)
- Debate clubs/communities around specific topics

#### 8.4 Notifications
- Debate invitations/challenges
- When debates you're watching start
- When voting opens on debates you watched
- When you win/results are final
- Reputation changes and badge unlocks
- New debates in followed categories

---

### **9. Mini App Integration (Warpcast/Coinbase Wallet)**

#### 9.1 Frame Features (Warpcast)
- Browse trending debates directly in feed
- One-tap to join as viewer
- Cast votes without leaving Warpcast
- Share debate results as frames
- Create debate challenge frames
- Display live debates in progress

#### 9.2 Widget in Coinbase Wallet
- Quick access to active debates
- Wallet balance and recent earnings
- Upcoming debates you're registered for
- Notification center
- One-tap USDC funding

#### 9.3 Composability
- Deep linking from other Base apps
- Embed debate widgets on other sites
- API for third-party integrations
- Export debate data for analysis tools

---

### **10. Governance & Community**

#### 10.1 Platform Governance (Later Stage)
Token-gated voting for:
- Platform fee adjustments
- Adding new debate categories
- Rule changes and updates
- Treasury allocation
- Feature prioritization

#### 10.2 Dispute Resolution
- Appeal mechanism for contested results
- Community jury system for edge cases
- 3-person arbitration panel (high-rep users)
- Final decisions binding and onchain
- Precedent library for consistent rulings

#### 10.3 Community Moderation
- Report system for violations
- Community moderator roles (elected)
- Strike system for repeat offenders
- Ban mechanism for egregious violations
- Appeals process for banned users

---

## **Technical Architecture**

### **Frontend Stack**

#### Core Technologies
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand or Jotai
- **Real-time**: Socket.io or Ably for live debates
- **Forms**: React Hook Form with Zod validation

#### Base Integration Layer
- **OnchainKit**: Primary SDK for all Base interactions
  - Identity components (Basename display, avatar)
  - Wallet components (Connect, balance display, fund)
  - Transaction components (stake, vote, claim)
  - Checkout flows for USDC purchases
- **Wagmi + Viem**: Low-level blockchain interactions
- **RainbowKit**: Fallback wallet connection (if users prefer external wallets)

#### UI Component Architecture
```
/components
  /debate
    - DebateCard.tsx (list view)
    - DebateRoom.tsx (live debate interface)
    - ArgumentThread.tsx (async debate view)
    - TimerDisplay.tsx
    - VotingPanel.tsx
  /user
    - ProfileCard.tsx (shows Basename, reputation, badges)
    - ReputationDisplay.tsx
    - BadgeCollection.tsx
  /onchain (OnchainKit components)
    - StakeButton.tsx (transaction component)
    - VoteButton.tsx (transaction component)
    - WithdrawButton.tsx
    - FundDebate.tsx (checkout component)
  /ai
    - AIJudgePanel.tsx
    - CoachInterface.tsx
  /social
    - ShareButton.tsx (Warpcast/Farcaster)
    - FeedItem.tsx
```

#### Data Fetching Strategy
- Use OnchainKit's built-in data hooks where available
- TanStack Query (React Query) for API data caching
- Real-time subscriptions for live debate updates
- Optimistic UI updates for better UX
- Automatic refetching on wallet/network changes

---

### **Backend Stack**

#### Core Infrastructure
- **Runtime**: Node.js (TypeScript)
- **Framework**: Express or Fastify
- **Database**: PostgreSQL (primary) + Redis (cache/sessions)
- **Storage**: IPFS for debate content, Arweave for permanent archives
- **Real-time**: Socket.io or Pusher for live updates

#### Services Architecture
```
/services
  /blockchain
    - ContractService.ts (smart contract interactions)
    - EventListener.ts (listen for onchain events)
    - TransactionService.ts (format and send txs)
  /debate
    - DebateOrchestrator.ts (manages debate lifecycle)
    - TimerService.ts (handles timed debate rounds)
    - MatchingService.ts (pairs opponents)
  /voting
    - VoteAggregator.ts (collects and weights votes)
    - ResultCalculator.ts (determines winners)
    - RewardDistributor.ts (triggers prize payouts)
  /ai
    - AgentService.ts (AgentKit integration)
    - JudgeService.ts (AI evaluation logic)
    - ModerationService.ts (content filtering)
  /reputation
    - ScoreCalculator.ts (updates reputation scores)
    - BadgeIssuer.ts (mints achievement NFTs)
  /identity
    - BasenameResolver.ts (fetch Basename data)
    - ProfileService.ts (aggregate user data)
```

#### Database Schema (Key Tables)
```sql
-- Users
users (
  id, basename, wallet_address, created_at,
  debater_reputation, voter_reputation, 
  total_debates, total_votes, win_rate
)

-- Debates
debates (
  id, topic, resolution, category, format,
  stake_amount, creator_id, challenger_id,
  status, start_time, end_time,
  contract_address, prize_pool
)

-- Arguments (async debates)
arguments (
  id, debate_id, user_id, round_number,
  content_ipfs_hash, posted_at, word_count
)

-- Votes
votes (
  id, debate_id, voter_id, winner_id,
  scores_json, weight, submitted_at
)

-- Reputation Events
reputation_events (
  id, user_id, event_type, delta,
  debate_id, timestamp, reason
)

-- Badges
badges (
  id, user_id, badge_type, earned_at,
  token_id, metadata_uri
)
```

#### API Endpoints (RESTful)
```
/api/debates
  GET    /                    - List debates (paginated, filtered)
  POST   /                    - Create new debate
  GET    /:id                 - Get debate details
  POST   /:id/join            - Join as opponent
  POST   /:id/arguments       - Submit argument (async)
  GET    /:id/votes           - Get voting results
  POST   /:id/vote            - Submit vote
  
/api/users
  GET    /:basename           - Get user profile
  GET    /:basename/debates   - User's debate history
  GET    /:basename/badges    - User's badges
  POST   /reputation          - Update reputation
  
/api/ai
  POST   /judge               - Request AI judging
  POST   /coach/session       - Start coaching session
  POST   /moderate            - Submit content for moderation
  
/api/leaderboard
  GET    /debaters            - Top debaters
  GET    /voters              - Top voters
  GET    /categories/:cat     - Category-specific rankings
```

#### Websocket Events (Real-time)
```
/debate/:id
  - argument_posted
  - timer_update
  - round_changed
  - debate_ended
  - viewer_joined
  - viewer_left
  - reaction_added
  
/voting/:id
  - vote_submitted
  - results_revealed
  
/user/:basename
  - challenge_received
  - debate_started
  - badge_earned
```

---

### **Smart Contract Architecture**

#### Contract Suite

**1. DebateFactory.sol**
- Creates new debate instances
- Tracks all deployed debates
- Manages debate templates
- Upgradeable via proxy pattern

**2. DebatePool.sol** (per debate)
- Holds staked USDC from both debaters
- Escrows funds until result finalized
- Distributes prizes based on voting outcome
- Handles platform fees and voter rewards
- Implements emergency withdrawal (if both parties agree or timeout)

**3. VotingManager.sol**
- Accepts weighted votes from eligible voters
- Calculates final scores and winner
- Prevents double voting
- Handles vote staking (if enabled)
- Distributes voter rewards

**4. ReputationRegistry.sol**
- Tracks onchain reputation scores
- Updates based on debate outcomes
- Allows reputation queries by Basename
- Prevents manipulation via access controls

**5. BadgeNFT.sol** (ERC-721)
- Mints achievement badges
- Soulbound (non-transferable)
- Metadata stored on IPFS
- Batch minting for efficiency
- Queryable by Basename

**6. Governance.sol** (optional, later stage)
- Manages platform parameters
- Voting on fee changes, rules
- Treasury management
- Timelocked execution

#### Smart Contract Features

**Security Measures**:
- Reentrancy guards on all withdrawal functions
- Access control (OpenZeppelin)
- Pausable in emergency
- Rate limiting on critical functions
- Multi-sig admin controls

**Gas Optimization**:
- Batch operations where possible
- Efficient storage packing
- Use of events over storage reads
- Minimal onchain computation (move to backend where possible)

**Upgradeability**:
- UUPS proxy pattern for core contracts
- Separate logic and data storage
- Version tracking
- Safe upgrade procedures

#### Contract Interactions Flow
```
1. Debate Creation
   User → DebateFactory.createDebate() → Deploy DebatePool
   
2. Stake Deposit
   Debater → USDC.approve(DebatePool) → DebatePool.stake()
   
3. Voting
   Voter → VotingManager.submitVote() → weight calculation
   
4. Result Finalization
   Backend → VotingManager.finalizeResults() 
   → DebatePool.distributePrizes()
   → ReputationRegistry.updateScores()
   → BadgeNFT.mint() (if achievement unlocked)
   
5. Prize Claim
   Winner → DebatePool.claimPrize() → USDC transfer
```

---

### **Coinbase Developer Platform (CDP) Integration**

#### 1. Smart Wallet Implementation
- Use CDP Smart Wallet SDK for passkey-based authentication
- Configure Paymaster for gasless transactions
- Set spending limits per user (prevent abuse)
- Implement session keys for seamless UX
- Batch transactions where multiple actions needed

#### 2. Onramp Integration
- Coinbase Pay widget for USDC purchases
- Minimum purchase: $5, maximum: $500 (configurable)
- Direct USDC minting to user's Smart Wallet
- Show real-time exchange rates
- Handle payment failures gracefully

#### 3. Wallet Management
- CDP Wallet API for programmatic operations
- Automated wallet creation on signup
- Secure key management (delegated to CDP)
- Recovery mechanisms via social/email
- Export option for users wanting self-custody

#### 4. Transaction Management
- Use CDP's transaction APIs for reliable sending
- Automatic nonce management
- Gas estimation and optimization
- Transaction status tracking
- Retry logic for failed txs

---

### **AgentKit Integration**

#### AI Judge Agent Setup
```typescript
import { AgentKit } from '@coinbase/agentkit-core'

// Initialize agent with wallet
const judgeAgent = new AgentKit({
  wallet: createSmartWallet(),
  apiKey: process.env.CDP_API_KEY,
  model: 'claude-sonnet-4-20250514'
})

// Give agent tools
judgeAgent.addTools([
  webSearchTool,        // Research claims
  contractReadTool,     // Check debate data
  contractWriteTool,    // Submit judgment
])

// Define judge behavior
const judgePrompt = `
You are an impartial debate judge evaluating arguments.
Analyze both debaters on: logic, evidence, clarity, rebuttal strength.
Search web to fact-check claims. Score each criterion 1-10.
Submit your judgment onchain by calling submitJudgment().
`

// Run judgment
const judgment = await judgeAgent.run(judgePrompt, {
  debateId: debateId,
  arguments: [debater1Args, debater2Args]
})
```

#### AI Coach Agent Setup
```typescript
const coachAgent = new AgentKit({
  wallet: createSmartWallet(),
  model: 'claude-sonnet-4-20250514'
})

// Coach interaction flow
async function runCoachingSession(userId, topic, position) {
  const session = await coachAgent.run(`
    You're coaching a debater on topic: "${topic}".
    Their position: ${position}.
    
    1. Ask about their main arguments
    2. Identify weak points
    3. Suggest counter-arguments they should prepare for
    4. Recommend 3-5 credible sources
    5. Run a practice round (you argue opposing side)
    
    Keep responses concise and actionable.
  `)
  
  // Charge user 10 USDC for session
  await chargeCoachingFee(userId, 10)
  
  return session
}
```

#### AI Moderation Agent
```typescript
const moderatorAgent = new AgentKit({
  model: 'claude-sonnet-4-20250514'
})

// Real-time content moderation
async function moderateArgument(content) {
  const result = await moderatorAgent.run(`
    Analyze this debate argument for:
    1. Profanity or offensive language
    2. Personal attacks (ad hominem)
    3. Hate speech or discrimination
    4. Spam or gibberish
    5. Plagiarism (unusual phrasing patterns)
    
    Argument: "${content}"
    
    Return JSON: { 
      isViolation: boolean, 
      violationType: string, 
      severity: 1-10,
      suggestedAction: 'warn' | 'flag' | 'remove'
    }
  `)
  
  return JSON.parse(result)
}
```

---

### **OnchainKit Component Usage**

#### Identity Components
```tsx
import {
  Identity,
  Avatar,
  Name,
  Address,
  Badge
} from '@coinbase/onchainkit/identity'

// Debater Profile Display
<Identity address={debaterAddress} schemaId="basename">
  <Avatar />
  <div>
    <Name />
    <Address />
  </div>
  <div className="badges">
    {badges.map(badge => (
      <Badge key={badge.id} tokenId={badge.tokenId} />
    ))}
  </div>
</Identity>
```

#### Wallet Components
```tsx
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet'

// Wallet Connection
<Wallet>
  <ConnectWallet>
    <Avatar />
    <Name />
    <Badge />
  </ConnectWallet>
  <WalletDropdown>
    <Identity address={address} />
    <WalletDropdownDisconnect />
  </WalletDropdown>
</Wallet>
```

#### Transaction Components
```tsx
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionToast,
} from '@coinbase/onchainkit/transaction'

// Stake on Debate
<Transaction
  contracts={[{
    address: debatePoolAddress,
    abi: debatePoolAbi,
    functionName: 'stake',
    args: [debateId, amount]
  }]}
  onSuccess={handleStakeSuccess}
>
  <TransactionButton text="Stake & Join Debate" />
  <TransactionStatus>
    <TransactionToast />
  </TransactionStatus>
</Transaction>
```

#### Checkout Component
```tsx
import {
  Checkout,
  CheckoutButton,
  CheckoutStatus
} from '@coinbase/onchainkit/checkout'

// Buy USDC to Fund Wallet
<Checkout
  productId="usdc-purchase"
  onSuccess={handlePurchaseSuccess}
>
  <CheckoutButton coinbaseBranded text="Buy USDC" />
  <CheckoutStatus />
</Checkout>
```

#### Fund Component
```tsx
import {
  Fund,
  FundButton
} from '@coinbase/onchainkit/fund'

// Quick Funding Flow
<Fund
  fundingUrl={`https://pay.coinbase.com?...`}
>
  <FundButton />
</Fund>
```

---

### **Testing Strategy (OnchainTestKit)**

#### End-to-End Tests
```typescript
import { OnchainTestKit } from '@coinbase/onchainkit/test'

describe('Debate Flow', () => {
  let testKit: OnchainTestKit
  
  beforeAll(async () => {
    testKit = new OnchainTestKit({
      network: 'base-sepolia'
    })
  })
  
  test('Complete debate lifecycle', async () => {
    // 1. Create wallets for test users
    const debater1 = await testKit.createWallet()
    const debater2 = await testKit.createWallet()
    
    // 2. Fund wallets with test USDC
    await testKit.fundWallet(debater1, { USDC: 100 })
    await testKit.fundWallet(debater2, { USDC: 100 })
    
    // 3. Create debate
    const debate = await testKit.executeTransaction({
      wallet: debater1,
      contract: 'DebateFactory',
      function: 'createDebate',
      args: ['Topic', 50] // 50 USDC stake
    })
    
    // 4. Join as opponent
    await testKit.executeTransaction({
      wallet: debater2,
      contract: 'DebatePool',
      function: 'stake',
      args: [debate.id]
    })
    
    // 5. Submit arguments
    // 6. Submit votes
    // 7. Finalize results
    // 8. Verify prize distribution
    
    expect(await testKit.getBalance(debater1, 'USDC'))
      .toBeGreaterThan(100) // Won debate
  })
  
  test('Gasless voting', async () => {
    const voter = await testKit.createWallet()
    
    // Verify vote transaction is gasless
    const tx = await testKit.executeTransaction({
      wallet: voter,
      contract: 'VotingManager',
      function: 'submitVote',
      args: [debateId, scores]
    })
    
    expect(tx.gasFeePaidByUser).toBe(0)
  })
})
```

#### Smart Contract Tests
```solidity
// Foundry tests
contract DebatePoolTest is Test {
    DebatePool public pool;
    MockUSDC public usdc;
    
    function testStakeAndDistribute() public {
        // Setup
        pool.initialize(debateId, stakeAmount);
        
        // Both debaters stake
        usdc.approve(address(pool), stakeAmount);
        pool.stake(debateId);
        
        vm.prank(debater2);
        pool.stake(debateId);
        
        // Finalize with debater1 winning
        pool.finalizeResults(debater1, scores);
        
        // Verify distribution
        assertEq(usdc.balanceOf(debater1), expectedPrize);
        assertEq(usdc.balanceOf(platformWallet), platformFee);
    }
}
```

---

### **Mini App Implementation (Warpcast/Coinbase Wallet)**

#### Frame Configuration
```tsx
import { FrameMetadata } from '@coinbase/onchainkit/frame'

// Debate Frame Metadata
export const debateFrameMetadata: FrameMetadata = {
  buttons: [
    { label: 'View Debate', action: 'link', target: debateUrl },
    { label: 'Vote Now', action: 'post' },
    { label: 'Share', action: 'post' }
  ],
  image: {
    src: generateDebatePreview(debateId),
    aspectRatio: '1.91:1'
  },
  input: {
    text: 'Enter your vote (1-10)'
  },
  postUrl: `${baseUrl}/api/frame/vote/${debateId}`,
  state: {
    debateId,
    votingOpen
  }
}
```

#### Minikit Integration (Coinbase Wallet)
```typescript
// minikit.config.ts
export const minikitConfig = {
  appId: 'debate-arena',
  appName: 'Onchain Debate Arena',
  iconUrl: 'https://...',
  description: 'Stake, debate, and earn',
  
  // Widget configuration
  widget: {
    type: 'tab',
    position: 'bottom',
    routes: [
      { path: '/debates', label: 'Active' },
      { path: '/profile', label: 'Profile' },
      { path: '/earnings', label: 'Earnings' }
    ]
  },
  
  // Deep link handlers
  deepLinks: {
    '/debate/:id': (id) => openDebate(id),
    '/challenge/:basename': (bn) => challengeUser(bn)
  }
}
```

---

### **Analytics & Monitoring**

#### Key Metrics to Track

**Platform Health**:
- Total debates created (daily/weekly/monthly)
- Active debaters and voters
- Total USDC staked (TVL)
- Average debate duration
- Completion rate (started vs finished)
- Platform revenue from fees

**User Engagement**:
- Daily/Monthly Active Users (DAU/MAU)
- Average debates per user
- Retention curves (D1, D7, D30)
- Time spent in debates
- Social shares and referrals

**Debate Quality**:
- Average argument length
- Source citations per argument
- AI moderation flag rate
- Dispute/appeal frequency
- Voter participation rate
- Vote consensus level (agreement)

**Economic Metrics**:
- Average stake size
- Total winnings distributed
- Voter rewards paid
- Platform fee revenue
- User ARPU (Average Revenue Per User)

**Technical Performance**:
- Transaction success rate
- Gas costs (even with Paymaster)
- API response times
- Real-time latency (live debates)
- Smart contract gas efficiency

#### Analytics Tools
- **Dune Analytics**: Onchain data dashboards
- **Mixpanel/Amplitude**: User behavior tracking
- **Sentry**: Error monitoring
- **Datadog**: Infrastructure monitoring
- **Custom Dashboard**: Real-time platform stats

---

### **Security & Compliance Requirements**

#### Smart Contract Security
- **Audits**: 2+ independent audits before mainnet (Consensys Diligence, Trail of Bits)
- **Bug Bounty**: ImmuneFi program with up to $50k rewards
- **Formal Verification**: Critical functions mathematically proven
- **Insurance**: Smart contract coverage via Nexus Mutual or similar
- **Emergency Pause**: Multi-sig controlled circuit breakers

#### Application Security
- **Authentication**: Secure wallet connection (no phishing)
- **Input Validation**: All user inputs sanitized
- **Rate Limiting**: Prevent spam and DoS attacks
- **DDoS Protection**: Cloudflare or similar
- **Secure Storage**: Encrypted sensitive data
- **HTTPS Only**: All traffic encrypted

#### Compliance Considerations
- **Terms of Service**: Clear rules and expectations
- **Privacy Policy**: GDPR-compliant data handling
- **KYC/AML**: Not required for small stakes; consider for high-value users
- **Gambling Laws**: Structure as skill-based competition, not pure gambling
- **Content Moderation**: Remove illegal content promptly
- **Geographic Restrictions**: Block sanctioned countries

#### Data Privacy
- **Minimal Data Collection**: Only essential information
- **User Consent**: Clear opt-ins for data usage
- **Data Portability**: Users can export their data
- **Right to Deletion**: Users can delete accounts (except onchain data)
- **Encryption**: At rest and in transit

---

### **Deployment & Infrastructure**

#### Hosting
- **Frontend**: Vercel or Cloudflare Pages
- **Backend**: AWS/GCP (load balanced, auto-scaling)
- **Database**: Managed PostgreSQL (AWS RDS or Supabase)
- **Redis**: Managed cache (AWS ElastiCache or Upstash)
- **Storage**: IPFS pinning via Pinata or Web3.Storage

#### Smart Contracts
- **Testnet**: Base Sepolia (extensive testing)
- **Mainnet**: Base L2
- **Deployment**: Hardhat/Foundry scripts
- **Verification**: Automated Etherscan verification
- **Monitoring**: Tenderly for contract observability

#### CI/CD Pipeline
- GitHub Actions for automated testing
- Automated security scanning (Slither, MythX)
- Staging environment for final testing
- Blue-green deployments for zero downtime
- Automated rollback on critical failures

#### Scalability Considerations
- Horizontal scaling for backend services
- Database read replicas for heavy queries
- CDN for static assets
- Redis caching for frequently accessed data
- Database indexing optimization
- Connection pooling

---

### **Launch Strategy & Milestones**

#### Phase 1: MVP (Minimum Viable Product)
**Features**:
- Basic debate creation (async only)
- Simple community voting
- Stake & prize distribution
- Basename integration
- Smart Wallet onboarding
- Essential moderation

**Tech Stack**:
- OnchainKit + Smart Wallet
- Core smart contracts (Factory, Pool, Voting)
- Basic frontend with Next.js
- PostgreSQL database
- Essential API endpoints

#### Phase 2: Enhanced Experience
**New Features**:
- Live timed debates with real-time UI
- AI Judge agent (AgentKit)
- Reputation system & leaderboards
- Badge NFTs
- Tournament format
- Mini app launch (Warpcast frame)

#### Phase 3: Full Platform
**New Features**:
- AI Coach agent
- Advanced matching algorithms
- Expert panels for premium debates
- Sponsored debates
- Governance system
- Mobile native apps

#### Phase 4: Ecosystem Expansion
**New Features**:
- API for third-party integrations
- White-label debate platform for DAOs
- Cross-chain expansion
- Advanced analytics dashboard
- Debate prediction markets
- Professional league/competition series

---

## **Success Metrics & KPIs**

### North Star Metric
**Total Value Debated (TVD)**: Cumulative USDC staked across all debates

### Primary KPIs
- **User Acquisition**: 1,000 debaters in first 3 months
- **Engagement**: 50% of users participate in 3+ debates
- **Retention**: 30%+ D30 retention
- **Economic Activity**: $100k TVD in first 3 months
- **Quality**: Average debate score >7/10 from voters

### Secondary KPIs
- Voter participation rate >60% of eligible users
- Average stake size growing over time
- Platform revenue sustainability (fees cover costs)
- Community satisfaction (NPS >50)
- Base ecosystem integration (featured in Base showcase)

---

## **Base Tools Utilization Summary**

✅ **OnchainKit**: Identity, Wallet, Transactions, Checkout, Fund components
✅ **Smart Wallet**: Passkey-based onboarding, gasless txs
✅ **Basenames**: Required identity system, portable reputation
✅ **Paymaster**: Sponsored gas for voting, debate creation
✅ **AgentKit**: AI Judge, Coach, and Moderator agents with wallets
✅ **CDP APIs**: Wallet creation, transaction management, onramp
✅ **OnchainTestKit**: Comprehensive E2E and integration testing
✅ **Minikit/Frames**: Warpcast and Coinbase Wallet integration
✅ **Base Infrastructure**: Native Base L2 deployment, low fees

**Additional Base Ecosystem Benefits**:
- Coinbase distribution (100M+ potential users)
- Base ecosystem grants eligibility
- Featured in Base app marketplace
- Integration with other Base protocols (DEXs for USDC liquidity, NFT marketplaces for badges)

---

This PRD provides a comprehensive blueprint for building the Onchain Debate Arena as a flagship Base application that deeply integrates the entire Base toolkit while delivering genuine utility and an engaging user experience.
