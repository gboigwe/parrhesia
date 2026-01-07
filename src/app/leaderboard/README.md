# Reputation System & Leaderboards

## Overview

The leaderboard system (`/leaderboard`) provides comprehensive rankings for debaters and voters based on their reputation scores calculated using weighted formulas.

## Features

### 1. **Dual Leaderboards**
Separate rankings for:
- **Debaters**: Ranked by debate performance and win rate
- **Voters**: Ranked by voting accuracy and participation

### 2. **Reputation Calculation**

#### Debater Reputation Formula
Components weighted for total 100%:
- **Win Rate** (25%): Percentage of debates won
- **Average Vote Scores** (30%): Average weighted scores received from voters
- **Participation** (10%): Total number of debates (logarithmic scale)
- **Topic Complexity Bonus** (10%): Variety of categories debated
- **Consistency Score** (15%): Win streaks and performance consistency
- **Engagement** (10%): Recent activity and community interaction

#### Voter Reputation Formula
Components weighted for total 100%:
- **Accuracy** (40%): Percentage of correct vote predictions
- **Participation** (25%): Number of votes cast (logarithmic scale)
- **Vote Quality** (20%): Quality of feedback provided
- **Consistency** (15%): Regular voting activity rate

### 3. **Reputation Tiers**
Six reputation tiers with distinct badges:
- **Legendary** (90-100): Purple badge with star icon
- **Master** (75-89): Blue badge with sparkle icon
- **Expert** (60-74): Green badge with verified icon
- **Intermediate** (40-59): Yellow badge with plus icon
- **Beginner** (20-39): Orange badge with arrow icon
- **Novice** (0-19): Gray badge with info icon

### 4. **Category Filtering**
Filter leaderboards by debate category:
- Politics
- Technology
- Science
- Philosophy
- Economics
- Social Issues
- And more...

### 5. **Statistics Overview**
Dashboard showing:
- Total debaters and voters
- Average reputation scores
- Top reputation scores
- Real-time updates

## Components

### LeaderboardTable
**Location**: `src/components/leaderboard/LeaderboardTable.tsx`

Main leaderboard table with rankings, user info, stats, and reputation changes.

```tsx
<LeaderboardTable
  entries={debaters}
  type="debaters"
  category="Technology"
/>
```

**Props:**
- `entries`: Array of leaderboard entries
- `type`: "debaters" or "voters"
- `category`: Optional category filter

**Features:**
- Rank badges (gold/silver/bronze for top 3)
- User avatars with Basename
- Win/loss records or vote counts
- Win rate or accuracy percentages
- Reputation change indicators

### ReputationStats
**Location**: `src/components/leaderboard/ReputationStats.tsx`

Statistics overview cards.

```tsx
<ReputationStats
  totalDebaters={150}
  totalVoters={500}
  avgDebaterReputation={65.5}
  avgVoterReputation={58.2}
  topDebaterReputation={95.3}
  topVoterReputation={88.7}
/>
```

**Props:**
- `totalDebaters`: Total number of debaters
- `totalVoters`: Total number of voters
- `avgDebaterReputation`: Average debater reputation
- `avgVoterReputation`: Average voter reputation
- `topDebaterReputation`: Highest debater reputation
- `topVoterReputation`: Highest voter reputation

### CategoryFilter
**Location**: `src/components/leaderboard/CategoryFilter.tsx`

Category selection buttons.

```tsx
<CategoryFilter
  categories={["Politics", "Technology", "Science"]}
  selectedCategory={selectedCategory}
  onSelectCategory={setSelectedCategory}
/>
```

**Props:**
- `categories`: Array of category names
- `selectedCategory`: Currently selected category (null for all)
- `onSelectCategory`: Callback when category changes

### RankBadge
**Location**: `src/components/leaderboard/RankBadge.tsx`

Tier badge with icon.

```tsx
<RankBadge
  reputation={85.5}
  showScore={true}
/>
```

**Props:**
- `reputation`: Reputation score
- `showScore`: Whether to display score in badge

## Reputation Calculation Details

### Debater Formula

```typescript
function calculateDebaterReputation(record: DebateRecord): number {
  // 1. Win Rate (25%)
  const winRate = wins / totalDebates;
  const winRateScore = winRate * 25;

  // 2. Average Scores (30%)
  const averageScoreComponent = (averageScore / 10) * 30;

  // 3. Participation (10%)
  const participationScore = Math.min(10, Math.log10(totalDebates + 1) * 5);

  // 4. Topic Complexity (10%)
  const complexityBonus = Math.min(10, categoryCount * 2);

  // 5. Consistency (15%)
  const streakBonus = Math.min(15, consecutiveWins * 3);

  // 6. Engagement (10%)
  const engagementScore = Math.min(10, (totalDebates / 10) * 10);

  return winRateScore + averageScoreComponent + participationScore +
         complexityBonus + streakBonus + engagementScore;
}
```

### Voter Formula

```typescript
function calculateVoterReputation(record: VoterRecord): number {
  // 1. Accuracy (40%)
  const accuracy = correctVotes / totalVotes;
  const accuracyScore = accuracy * 40;

  // 2. Participation (25%)
  const participationScore = Math.min(25, Math.log10(totalVotes + 1) * 12.5);

  // 3. Vote Quality (20%)
  const qualityScore = averageVoteQuality * 20;

  // 4. Consistency (15%)
  const consistencyScore = participationRate * 15;

  return accuracyScore + participationScore + qualityScore + consistencyScore;
}
```

## Example Calculations

### Debater Example
```
Debater Profile:
- 15 debates (10 wins, 5 losses)
- Average score: 7.8/10
- Categories: 5 (Politics, Tech, Science, Economics, Philosophy)
- Consecutive wins: 3
- Recent activity: Active

Calculation:
- Win Rate: (10/15) * 25 = 16.67
- Average Score: (7.8/10) * 30 = 23.4
- Participation: log10(16) * 5 = 6.02
- Complexity: 5 * 2 = 10
- Consistency: 3 * 3 = 9
- Engagement: (15/10) * 10 = 10 (capped)

Total Reputation: 75.09 → Master Tier
```

### Voter Example
```
Voter Profile:
- 50 votes cast
- 35 correct predictions
- Vote quality: 0.8 (provides feedback)
- Participation rate: 0.9 (votes regularly)

Calculation:
- Accuracy: (35/50) * 40 = 28
- Participation: log10(51) * 12.5 = 21.24
- Quality: 0.8 * 20 = 16
- Consistency: 0.9 * 15 = 13.5

Total Reputation: 78.74 → Master Tier
```

## Leaderboard Updates

Reputation scores update automatically when:
- Debate concludes (debater reputation)
- Vote is cast (voter participation)
- Prizes are claimed (reputation bonus)
- Correct predictions confirmed (voter accuracy)

## API Integration

### Get Leaderboard
**Endpoint**: `GET /api/leaderboard`

**Query Parameters:**
- `category`: Optional category filter
- `limit`: Number of entries (default: 50)
- `type`: "debaters" or "voters"

**Response:**
```json
{
  "debaters": [
    {
      "rank": 1,
      "userId": "uuid",
      "basename": "alice.base.eth",
      "address": "0x...",
      "reputation": 95.3,
      "wins": 25,
      "losses": 3,
      "totalDebates": 28,
      "winRate": 89.3,
      "reputationChange": 2.5
    }
  ],
  "voters": [
    {
      "rank": 1,
      "userId": "uuid",
      "basename": "bob.base.eth",
      "address": "0x...",
      "reputation": 88.7,
      "totalVotes": 150,
      "correctVotes": 120,
      "accuracy": 80.0,
      "reputationChange": 1.2
    }
  ],
  "stats": {
    "totalDebaters": 150,
    "totalVoters": 500,
    "avgDebaterReputation": 65.5,
    "avgVoterReputation": 58.2,
    "topDebaterReputation": 95.3,
    "topVoterReputation": 88.7
  }
}
```

## Ranking System

### Rank Display
- **1st Place**: Gold badge with star icon
- **2nd Place**: Silver badge
- **3rd Place**: Bronze badge
- **4th+ Place**: Numbered badge

### Rank Changes
Visual indicators show movement:
- **↑ Green**: Reputation increased
- **↓ Red**: Reputation decreased
- **- Gray**: No change

## User Experience

### Visual Design
- Color-coded reputation tiers
- Gradient avatars for users
- Progress bars for win rates/accuracy
- Trophy icons for top ranks

### Responsive Layout
- **Mobile**: Single-column table, stacked stats
- **Tablet**: 2-column grid for stats
- **Desktop**: Full table with all columns visible

### Loading States
- Skeleton loaders for table rows
- Pulse animation for stats cards
- Smooth transitions for rank changes

## Gamification

### Achievements
Reputation milestones unlock badges:
- First debate/vote
- 10 wins/correct votes
- 50% win rate
- Expert tier reached
- Top 10 rank achieved

### Leaderboard Seasons
(Future enhancement)
- Monthly/quarterly rankings
- Season rewards and prizes
- Historical leaderboard archives

## Related Files

- `/src/app/leaderboard/page.tsx` - Leaderboard page
- `/src/components/leaderboard/LeaderboardTable.tsx` - Table component
- `/src/components/leaderboard/ReputationStats.tsx` - Stats component
- `/src/components/leaderboard/CategoryFilter.tsx` - Filter component
- `/src/components/leaderboard/RankBadge.tsx` - Badge component
- `/src/lib/reputation/calculateReputation.ts` - Calculation formulas
- `/src/lib/reputation/leaderboardUtils.ts` - Utility functions
- `/src/lib/reputation/types.ts` - TypeScript types
