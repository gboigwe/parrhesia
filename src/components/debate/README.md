# Debate Components

Comprehensive set of React components for the Parrhesia debate platform.

## Core Components

### DebateCard
Displays debate information in card format for list views.

```tsx
import { DebateCard } from "@/components/debate";

<DebateCard
  id="debate-1"
  topic="Bitcoin will reach $100k in 2025"
  category="crypto"
  status="active"
  prizePool={100}
  creator={{ id: "1", basename: "alice.base.eth" }}
  challenger={{ id: "2", basename: "bob.base.eth" }}
/>
```

### DebateStatus
Shows current debate status with visual indicators.

### StakeDisplay
Displays prize pool breakdown and stake amounts.

```tsx
<StakeDisplay
  creatorStake={50}
  challengerStake={50}
  totalPrizePool={100}
  platformFee={5}
/>
```

## Argument Components

### ArgumentCard
Individual argument display with metadata.

### ArgumentThread
Chronological thread of all arguments in a debate.

```tsx
<ArgumentThread
  arguments={debateArguments}
  creatorName="alice.base.eth"
  challengerName="bob.base.eth"
/>
```

### ArgumentForm
Form for submitting new arguments.

## Voting Components

### VotingPanel
Complete voting interface with criteria scoring.

```tsx
<VotingPanel
  debateId="debate-1"
  creatorName="alice.base.eth"
  challengerName="bob.base.eth"
  votingCriteria={VOTING_CONFIG.VOTING_CRITERIA}
  onSubmitVote={handleVoteSubmit}
  canVote={true}
  hasVoted={false}
/>
```

## Participant Components

### ParticipantInfo
Displays participant profile with stats.

```tsx
<ParticipantInfo
  participant={{
    id: "1",
    basename: "alice.base.eth",
    reputation: 1250,
    wins: 15,
    losses: 5,
    totalDebates: 20,
  }}
  role="creator"
  isWinner={true}
/>
```

## Utility Components

### TimerDisplay
Real-time countdown timer.

```tsx
<TimerDisplay
  endsAt={votingEndDate}
  label="Voting ends in"
  variant="warning"
/>
```

### CategoryBadge
Visual category indicator with emoji.

```tsx
<CategoryBadge category="crypto" />
```

### ShareDebate
Social sharing functionality.

```tsx
<ShareDebate
  debateId="debate-1"
  topic="Bitcoin will reach $100k"
/>
```

## Filter & Display Components

### DebateFilters
Filter and sort debates.

```tsx
<DebateFilters
  onFilterChange={(filters) => console.log(filters)}
/>
```

### DebateLeaderboard
Top debaters ranking.

```tsx
<DebateLeaderboard
  entries={topDebaters}
  showTop={10}
/>
```

### DebateStats
Platform statistics overview.

```tsx
<DebateStats
  totalDebates={150}
  activeDebates={25}
  totalPrizePool={5000}
  totalVoters={500}
/>
```

## Empty States

### EmptyState
Generic empty state component.

```tsx
<EmptyState
  title="No Debates Found"
  description="Try adjusting your filters"
  icon="="
  actionLabel="Create Debate"
  onAction={() => navigate('/create')}
/>
```

Pre-built empty states:
- `<NoDebatesFound />`
- `<NoActiveDebates />`
- `<NoVotesYet />`
- `<NoArgumentsYet />`

## Constants & Utilities

### Debate Constants

```tsx
import { VOTING_CONFIG, DEBATE_TIMING, STATUS_CONFIG } from "@/components/debate";

// Access voting criteria
VOTING_CONFIG.VOTING_CRITERIA

// Access timing configs
DEBATE_TIMING.DEFAULT_VOTING_DURATION
```

### Utility Functions

```tsx
import {
  getTimeRemaining,
  isDebateActive,
  getDebateStatusLabel,
  calculatePrizeDistribution,
} from "@/components/debate";

const remaining = getTimeRemaining(endDate);
const isActive = isDebateActive("active");
const label = getDebateStatusLabel("voting");
const prizes = calculatePrizeDistribution(100);
```

## Type Definitions

```tsx
import type {
  Debate,
  DebateWithParticipants,
  DebateStatus,
  DebateFormat,
  DebateCategory,
} from "@/components/debate";
```

## Usage Patterns

### Complete Debate Page

```tsx
import {
  DebateCard,
  ArgumentThread,
  VotingPanel,
  ParticipantInfo,
  TimerDisplay,
} from "@/components/debate";

function DebatePage({ debate }) {
  return (
    <>
      <TimerDisplay endsAt={debate.votingEndsAt} />
      <ParticipantInfo participant={debate.creator} role="creator" />
      <ParticipantInfo participant={debate.challenger} role="challenger" />
      <ArgumentThread arguments={debate.arguments} />
      <VotingPanel {...votingProps} />
    </>
  );
}
```

### Debate Listing

```tsx
import { DebateCard, DebateFilters, NoDebatesFound } from "@/components/debate";

function DebateList({ debates }) {
  return (
    <>
      <DebateFilters onFilterChange={handleFilter} />
      {debates.length > 0 ? (
        debates.map(debate => <DebateCard key={debate.id} {...debate} />)
      ) : (
        <NoDebatesFound />
      )}
    </>
  );
}
```

## Best Practices

1. Use TypeScript types for all props
2. Handle loading and error states
3. Provide meaningful empty states
4. Use Basename for identity display
5. Format USDC amounts consistently
6. Show real-time updates for timers
7. Validate user permissions before showing actions
