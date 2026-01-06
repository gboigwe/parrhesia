# Debate Results & Prize Distribution

## Overview

The results interface (`/debates/[id]/results`) provides comprehensive debate outcome display, including vote breakdowns, criteria analysis, prize distribution, and prize claiming functionality.

## Features

### 1. **Winner Announcement**
Prominently displays the debate winner with visual indicators:
- Winner badge and trophy icon
- Percentage vote breakdown
- Average weighted scores
- Tie detection and display

### 2. **Vote Breakdown Visualization**
Visual representation of voting results:
- Total vote count
- Votes per participant with percentages
- Animated progress bars
- Average scores for each participant

### 3. **Criteria Analysis**
Detailed breakdown of all 5 weighted scoring criteria:
- Individual criterion scores for each participant
- Visual bars with color coding (red/yellow/blue/green)
- Weighted percentages display
- Criterion descriptions and tips

### 4. **Prize Distribution**
Clear breakdown of the prize pool:
- Total prize pool display
- Winner prize (85%)
- Voter reward pool (10%)
- Platform fee (5%)
- Per-voter reward calculation
- Visual distribution chart

### 5. **Prize Claiming**
One-click prize claiming for winners and voters:
- Eligibility verification
- Claim confirmation modal
- Gasless transactions via Paymaster
- Transaction hash display
- Reputation update integration

### 6. **Voter Rewards**
Personalized rewards display for participants who voted:
- USDC reward amount
- Reputation points earned
- Correct prediction bonus indicator
- Claim reward button

## Components

### DebateResults
**Location**: `src/components/results/DebateResults.tsx`

Main results display with winner announcement and vote breakdown.

```tsx
<DebateResults
  votes={votes}
  creator={creator}
  challenger={challenger}
  winnerId={winnerId}
  isTie={isTie}
/>
```

**Props:**
- `votes`: Array of vote objects
- `creator`: Creator participant object
- `challenger`: Challenger participant object
- `winnerId`: ID of winning participant (null if tie)
- `isTie`: Boolean indicating if result is a tie

### CriteriaBreakdown
**Location**: `src/components/results/CriteriaBreakdown.tsx`

Displays average scores for each voting criterion.

```tsx
<CriteriaBreakdown
  votes={votes}
  creatorId={creatorId}
  challengerId={challengerId}
  creatorName={creatorBasename}
  challengerName={challengerBasename}
/>
```

**Props:**
- `votes`: Array of vote objects
- `creatorId`: Creator user ID
- `challengerId`: Challenger user ID
- `creatorName`: Creator Basename
- `challengerName`: Challenger Basename

### PrizeBreakdown
**Location**: `src/components/results/PrizeBreakdown.tsx`

Visual breakdown of prize pool distribution.

```tsx
<PrizeBreakdown
  prizePool="100.00"
  totalVotes={25}
  winnerId={winnerId}
  winnerName="alice.base.eth"
  isTie={false}
/>
```

**Props:**
- `prizePool`: Total prize pool amount (string)
- `totalVotes`: Number of votes cast
- `winnerId`: Winner user ID (null if tie)
- `winnerName`: Winner's Basename
- `isTie`: Boolean indicating tie

### ClaimPrizeButton
**Location**: `src/components/results/ClaimPrizeButton.tsx`

Button and modal for claiming winner prizes.

```tsx
<ClaimPrizeButton
  debateId={debateId}
  prizeAmount="85.00"
  isWinner={true}
  hasClaimed={false}
  onClaim={handleClaimPrize}
/>
```

**Props:**
- `debateId`: Debate identifier
- `prizeAmount`: Prize amount as string
- `isWinner`: Boolean if user is winner
- `hasClaimed`: Boolean if already claimed
- `onClaim`: Async function to handle claim

### VoterRewards
**Location**: `src/components/results/VoterRewards.tsx`

Displays voter rewards and claiming option.

```tsx
<VoterRewards
  userVoted={true}
  userVotedCorrectly={true}
  rewardAmount="4.00"
  reputationEarned={2}
  hasClaimed={false}
  onClaimReward={handleClaimVoterReward}
/>
```

**Props:**
- `userVoted`: Boolean if user voted
- `userVotedCorrectly`: Boolean if voted for winner
- `rewardAmount`: Reward amount as string
- `reputationEarned`: Reputation points earned
- `hasClaimed`: Boolean if already claimed
- `onClaimReward`: Optional async claim function

### ClaimSuccessState
**Location**: `src/components/results/ClaimSuccessState.tsx`

Success screen after claiming prize or reward.

```tsx
<ClaimSuccessState
  prizeAmount="85.00"
  transactionHash="0x..."
  reputationEarned={10}
  debateId={debateId}
  type="winner"
/>
```

**Props:**
- `prizeAmount`: Amount claimed as string
- `transactionHash`: Optional transaction hash
- `reputationEarned`: Reputation points earned
- `debateId`: Debate identifier
- `type`: "winner" or "voter"

## Winner Determination Logic

Winners are determined using a two-step process:

### Step 1: Vote Count
Simple majority wins. The participant with more votes wins.

### Step 2: Tiebreaker (if vote counts equal)
Average weighted score is used as tiebreaker:
1. Calculate average weighted score for each participant
2. Higher average score wins
3. If still tied, debate is declared a tie

```typescript
function determineWinner(votes, creatorId, challengerId) {
  const creatorVotes = votes.filter(v => v.winnerId === creatorId);
  const challengerVotes = votes.filter(v => v.winnerId === challengerId);

  if (creatorVotes.length > challengerVotes.length) {
    return { winnerId: creatorId, isTie: false };
  } else if (challengerVotes.length > creatorVotes.length) {
    return { winnerId: challengerId, isTie: false };
  }

  // Tiebreaker: Average scores
  const creatorAvg = calculateAverage(creatorVotes);
  const challengerAvg = calculateAverage(challengerVotes);

  if (creatorAvg > challengerAvg) {
    return { winnerId: creatorId, isTie: false };
  } else if (challengerAvg > creatorAvg) {
    return { winnerId: challengerId, isTie: false };
  }

  return { winnerId: null, isTie: true };
}
```

## Prize Distribution Formula

### Default Distribution
- **Winner Prize**: 85% of total pool
- **Voter Rewards**: 10% of total pool (split equally among all voters)
- **Platform Fee**: 5% of total pool

### Example Calculation
Prize Pool: 100 USDC, 25 voters

```
Winner Prize = 100 * 85% = 85 USDC
Voter Reward Pool = 100 * 10% = 10 USDC
Per Voter Reward = 10 / 25 = 0.4 USDC per voter
Platform Fee = 100 * 5% = 5 USDC
```

### Tie Scenario
If debate ends in a tie:
- Winner prize split 50/50 between both participants
- Each receives 42.5 USDC (85% / 2)
- Voter rewards and platform fee remain the same

## Prize Claiming Flow

### Winner Claim Flow
1. User clicks "Claim Prize" button
2. Confirmation modal displays prize details
3. User confirms claim
4. Backend validates:
   - User is the winner
   - Prize not already claimed
   - Debate is concluded
5. Smart contract call to DebatePool.claimPrize()
6. USDC transferred to user's wallet
7. Reputation updated onchain
8. Database updated with claim status
9. Success state displayed with transaction hash

### Voter Claim Flow
1. User clicks "Claim Voter Reward"
2. Backend validates:
   - User voted in the debate
   - Reward not already claimed
   - Debate is concluded
3. Smart contract call to DebatePool.claimVoterReward()
4. USDC transferred to user's wallet
5. Reputation updated (bonus if voted correctly)
6. Database updated
7. Success confirmation displayed

## Reputation Updates

Reputation is automatically updated when prizes are claimed:

### Winner Reputation
- **Debate Win**: +10 points
- Updated onchain via ReputationRegistry contract
- Recorded in reputation_events table

### Voter Reputation
- **Vote Cast**: +2 points
- **Correct Vote** (voted for winner): +5 points
- Bonus stacks if user voted for winner

### Loser Reputation
- **Debate Participation**: +3 points
- Participation is still rewarded

## API Integration

### Get Results
**Endpoint**: `GET /api/debates/[id]/results`

**Response:**
```json
{
  "debate": {
    "id": "uuid",
    "topic": "string",
    "prizePool": "100.00",
    "status": "concluded"
  },
  "votes": [
    {
      "id": "uuid",
      "winnerId": "uuid",
      "totalScore": "7.65",
      "argumentQuality": 8,
      "rebuttalStrength": 7,
      "clarity": 9,
      "evidence": 6,
      "persuasiveness": 8
    }
  ],
  "winner": {
    "id": "uuid",
    "winnerId": "uuid",
    "isTie": false,
    "creatorVotes": 15,
    "challengerVotes": 10
  }
}
```

### Claim Prize
**Endpoint**: `POST /api/debates/[id]/claim`

**Request:**
```json
{
  "userId": "uuid",
  "type": "winner" | "voter"
}
```

**Response:**
```json
{
  "message": "Prize claimed successfully",
  "transactionHash": "0x...",
  "amountClaimed": "85.00",
  "reputationEarned": 10
}
```

## Custom Hook

### usePrizeClaim
**Location**: `src/hooks/usePrizeClaim.ts`

TanStack Query mutation for prize claiming.

```typescript
const {
  claimPrize,
  claimPrizeAsync,
  isClaiming,
  isSuccess,
  error,
  data
} = usePrizeClaim();

// Claim prize
claimPrizeAsync({
  debateId: "uuid",
  userId: "uuid",
  type: "winner"
});
```

## Validation

### Claim Eligibility
Server validates:
- Debate status is "concluded"
- User is authenticated
- For winner claims:
  - User ID matches winner ID
  - Prize not already claimed
- For voter claims:
  - User voted in the debate
  - Reward not already claimed

### Error Handling
Common errors:
- `NOT_ELIGIBLE`: User is not winner/voter
- `ALREADY_CLAIMED`: Prize/reward already claimed
- `DEBATE_NOT_CONCLUDED`: Debate still ongoing
- `INSUFFICIENT_VOTES`: Minimum vote threshold not met

## Smart Contract Integration

### DebatePool Contract
Prize claiming interacts with the DebatePool contract:

```solidity
function claimPrize(uint256 debateId) external {
    require(msg.sender == debate.winner, "Not winner");
    require(!debate.prizeClaimed, "Already claimed");

    uint256 amount = calculateWinnerPrize(debateId);
    usdc.transfer(msg.sender, amount);

    debate.prizeClaimed = true;
    emit PrizeClaimed(debateId, msg.sender, amount);
}
```

### Gasless Transactions
Claims are sponsored by Coinbase Paymaster:
- No gas required from users
- Seamless claiming experience
- Platform pays transaction fees

## User Experience

### Visual Feedback
- **Color Coding**: Green for winners, purple for voters
- **Progress Bars**: Animated vote percentage display
- **Badges**: Winner/loser badges, correct vote indicators
- **Icons**: Trophy for winners, gift for voters

### Loading States
- Skeleton loaders while fetching results
- Spinner during claim transactions
- Disabled buttons prevent double-claims

### Responsive Design
- **Mobile**: Stacked layout, full-width components
- **Tablet**: 2-column grid for criteria
- **Desktop**: 3-column grid (2 main + 1 sidebar)

## Related Files

- `/src/app/debates/[id]/results/page.tsx` - Results page
- `/src/components/results/DebateResults.tsx` - Results component
- `/src/components/results/CriteriaBreakdown.tsx` - Criteria component
- `/src/components/results/PrizeBreakdown.tsx` - Prize component
- `/src/components/results/ClaimPrizeButton.tsx` - Claim button
- `/src/components/results/VoterRewards.tsx` - Voter rewards
- `/src/components/results/ClaimSuccessState.tsx` - Success screen
- `/src/hooks/usePrizeClaim.ts` - Claim hook
- `/src/lib/reputation/updateReputation.ts` - Reputation service
- `/src/lib/voting/utils.ts` - Winner determination
