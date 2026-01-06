# Voting Interface & Weighted Scoring

## Overview

The voting interface (`/debates/[id]/vote`) provides a comprehensive system for voters to evaluate debates using weighted criteria scoring and submit their votes on-chain.

## Features

### 1. **Weighted Criteria Scoring**
Five criteria with specific weights that determine the final score:

- **Argument Quality** (30%) - Strength of logic and coherence
- **Rebuttal Strength** (25%) - Effectiveness in addressing opponent's points
- **Clarity** (20%) - How clearly arguments were communicated
- **Evidence Quality** (15%) - Quality of sources and evidence
- **Persuasiveness** (10%) - Overall ability to convince

### 2. **Interactive Scoring Sliders**
- Visual slider with color-coded feedback (red to green)
- Quick score buttons (3, 5, 7, 9) for rapid selection
- Score markers from 1-10
- Real-time score labels (Poor, Fair, Good, Excellent)
- Expandable tips for each criterion

### 3. **Vote Summary Panel**
- Real-time calculation of weighted total score
- Breakdown of individual criterion scores with weights
- Winner selection display
- Visual feedback with color coding

### 4. **Eligibility Checks**
Automatic validation ensures:
- User is authenticated
- Debate is in voting phase
- User is not a participant (creator or challenger)
- User hasn't already voted

### 5. **Vote Confirmation**
- Modal review of all scores before submission
- Warning about vote finality
- Display of weighted total score
- Optional feedback preview

### 6. **Success State**
- Confirmation of successful vote submission
- Transaction hash display (on-chain verification)
- Information about results timing
- Reputation points earned notification

## Components

### VotingInterface
**Location**: `src/components/voting/VotingInterface.tsx`

Main voting interface with winner selection, criteria scoring, and feedback.

```tsx
<VotingInterface
  debateId={debateId}
  creatorName={creatorBasename}
  challengerName={challengerBasename}
  onSubmitVote={handleSubmitVote}
  isSubmitting={false}
/>
```

Props:
- `debateId`: Debate identifier
- `creatorName`: Creator's Basename
- `challengerName`: Challenger's Basename
- `onSubmitVote`: Async handler for vote submission
- `isSubmitting`: Loading state

### VotingScoreSlider
**Location**: `src/components/voting/VotingScoreSlider.tsx`

Individual criterion scoring slider with tips and quick actions.

```tsx
<VotingScoreSlider
  criterion={votingCriterion}
  value={score}
  onChange={handleScoreChange}
  minScore={1}
  maxScore={10}
/>
```

Props:
- `criterion`: Criterion object with name, weight, description, tips
- `value`: Current score value
- `onChange`: Score change handler
- `minScore`: Minimum score (default: 1)
- `maxScore`: Maximum score (default: 10)

### VoteSummaryPanel
**Location**: `src/components/voting/VoteSummaryPanel.tsx`

Real-time summary of vote with weighted calculation.

```tsx
<VoteSummaryPanel
  scores={scores}
  winner="creator"
  creatorName="alice.base.eth"
  challengerName="bob.base.eth"
/>
```

Props:
- `scores`: Record of criterion scores
- `winner`: Selected winner ("creator" | "challenger")
- `creatorName`: Creator's name
- `challengerName`: Challenger's name

### VoteConfirmationModal
**Location**: `src/components/voting/VoteConfirmationModal.tsx`

Confirmation modal before final submission.

```tsx
<VoteConfirmationModal
  open={showModal}
  onClose={handleClose}
  onConfirm={handleConfirm}
  winner="creator"
  winnerName="alice.base.eth"
  scores={scores}
  weightedTotal={7.5}
  feedback="Great arguments!"
  isSubmitting={false}
/>
```

### VoteSuccessState
**Location**: `src/components/voting/VoteSuccessState.tsx`

Success confirmation after vote submission.

```tsx
<VoteSuccessState
  debateId={debateId}
  winnerName="alice.base.eth"
  weightedScore={7.5}
  transactionHash="0x..."
/>
```

## Data Flow

### Vote Data Structure
```typescript
interface VoteData {
  debateId: string;
  winner: "creator" | "challenger";
  scores: {
    argumentQuality: number;
    rebuttalStrength: number;
    clarity: number;
    evidence: number;
    persuasiveness: number;
  };
  feedback?: string;
}
```

### Weighted Score Calculation
```typescript
function calculateWeightedScore(scores: Record<string, number>): number {
  let totalScore = 0;

  VOTING_CRITERIA.forEach((criterion) => {
    const score = scores[criterion.key] || 0;
    const weightedScore = (score * criterion.weight) / 100;
    totalScore += weightedScore;
  });

  return Number(totalScore.toFixed(2));
}
```

Example:
- Argument Quality: 8 × 30% = 2.4
- Rebuttal Strength: 7 × 25% = 1.75
- Clarity: 9 × 20% = 1.8
- Evidence: 6 × 15% = 0.9
- Persuasiveness: 8 × 10% = 0.8
- **Total Weighted Score: 7.65/10**

### Eligibility Validation
```typescript
function checkVotingEligibility(
  debate: Debate,
  user: User | null,
  hasAlreadyVoted: boolean
): { eligible: boolean; reason?: string } {
  if (!user) return { eligible: false, reason: "Not logged in" };
  if (debate.status !== "voting") return { eligible: false, reason: "Not in voting phase" };
  if (debate.creatorId === user.id || debate.challengerId === user.id) {
    return { eligible: false, reason: "Participants cannot vote" };
  }
  if (hasAlreadyVoted) return { eligible: false, reason: "Already voted" };
  return { eligible: true };
}
```

## API Integration

### Submit Vote
**Endpoint**: `POST /api/debates/[id]/votes`

**Request:**
```json
{
  "userId": "uuid",
  "winner": "creator" | "challenger",
  "scores": {
    "argumentQuality": 8,
    "rebuttalStrength": 7,
    "clarity": 9,
    "evidence": 6,
    "persuasiveness": 8
  },
  "feedback": "Optional feedback text"
}
```

**Response:**
```json
{
  "message": "Vote submitted successfully",
  "vote": {
    "id": "uuid",
    "debateId": "uuid",
    "userId": "uuid",
    "winnerId": "uuid",
    "totalScore": "7.65",
    "transactionHash": "0x...",
    "createdAt": "Date"
  }
}
```

## Custom Hook

### useVoteSubmission
**Location**: `src/hooks/useVoteSubmission.ts`

TanStack Query mutation for vote submission.

```typescript
const {
  submitVote,
  isSubmitting,
  isSuccess,
  error,
  clearError,
  data
} = useVoteSubmission();

// Submit vote
submitVote({
  debateId,
  userId,
  winner: "creator",
  scores,
  feedback: "Great debate!"
});
```

## Voting Criteria Constants

**Location**: `src/lib/voting/constants.ts`

```typescript
export const VOTING_CRITERIA = [
  {
    key: "argumentQuality",
    name: "Argument Quality",
    weight: 30,
    description: "Strength and coherence of main arguments",
    tips: "Consider logical structure and depth of reasoning"
  },
  // ... other criteria
];

export const VOTING_CONSTRAINTS = {
  MIN_SCORE: 1,
  MAX_SCORE: 10,
  MIN_VOTES_FOR_CONCLUSION: 3,
  MAX_FEEDBACK_LENGTH: 500,
  VOTING_DURATION_HOURS: 72
};
```

## Validation

### Score Validation
- All scores must be between 1 and 10
- All criteria must have a score
- Feedback must be under 500 characters
- Winner must be selected

### Client-Side Validation
Real-time validation provides immediate feedback:
- Red error messages for invalid inputs
- Disabled submit button until valid
- Character counter for feedback

### Server-Side Validation
API endpoint validates:
- User authentication
- Voting eligibility
- Score ranges
- Debate status
- Duplicate vote prevention

## User Experience

### Visual Feedback
- **Score Colors**: Red (1-3), Yellow (4-5), Blue (6-7), Green (8-10)
- **Score Labels**: Poor, Fair, Good, Very Good, Excellent
- **Progress Indicators**: Loading spinners during submission
- **Success Animations**: Checkmark on successful submission

### Responsive Design
- **Mobile**: Stacked layout, full-width sliders
- **Tablet**: 2-column grid for scores
- **Desktop**: 3-column grid with sticky summary panel

## Smart Contract Integration

While the current implementation stores votes in the database, the system is designed for on-chain integration:

```solidity
function submitVote(
  uint256 debateId,
  address winner,
  uint256[5] memory scores,
  string memory feedback
) external;
```

## Reputation Rewards

Voters earn reputation points:
- **Vote Cast**: +2 points
- **Correct Prediction**: +5 points (if voted for winner)

## Future Enhancements

1. **Quadratic Voting**
   - Allow users to allocate voting power
   - Implement stake-weighted votes

2. **Delegation**
   - Allow voters to delegate their vote
   - Implement proxy voting

3. **Criteria Customization**
   - Let debate creators choose criteria
   - Add custom weights per debate

4. **Anonymous Voting**
   - Hide voter identity until results
   - Implement commit-reveal scheme

5. **Vote Explanations**
   - Require written justification
   - Minimum character requirements

6. **Live Voting Updates**
   - WebSocket integration
   - Real-time vote count display

## Related Files

- `/src/app/debates/[id]/vote/page.tsx` - Voting page
- `/src/components/voting/VotingInterface.tsx` - Main interface
- `/src/components/voting/VotingScoreSlider.tsx` - Score sliders
- `/src/components/voting/VoteSummaryPanel.tsx` - Vote summary
- `/src/components/voting/VoteConfirmationModal.tsx` - Confirmation modal
- `/src/components/voting/VoteSuccessState.tsx` - Success screen
- `/src/hooks/useVoteSubmission.ts` - Submission hook
- `/src/lib/voting/constants.ts` - Voting constants
- `/src/lib/voting/utils.ts` - Voting utilities
- `/src/app/api/debates/[id]/votes/route.ts` - API endpoint
