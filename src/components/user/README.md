# User Profile Components

Comprehensive user profile and reputation management components for Parrhesia.

## Components

### ProfileCard
Full user profile display with stats, verification badge, and social actions.

**Props:**
- `userId` - User identifier
- `basename` - User's Basename identity
- `avatar` - Profile avatar URL
- `bio` - User biography
- `reputation` - Reputation points
- `totalDebates` - Total debates count
- `wins/losses` - Win/loss record
- `totalEarnings` - Total USDC earned
- `isVerified` - Basename verification status
- `isOwnProfile` - Whether viewing own profile
- `onFollow/onEdit` - Action callbacks

### ReputationDisplay
Reputation system with tier progression and earning breakdown.

**Features:**
- 6-tier system (Beginner to Legendary)
- Progress bar to next tier
- Reputation earning guide
- Recent reputation history

### BadgeCollection
Achievement badge gallery with rarity system.

**Badge Rarities:**
- Common (gray)
- Rare (blue)
- Epic (purple)
- Legendary (yellow)

### DebateHistory
Past debate records with results and scores.

**Shows:**
- Opponent information
- Debate outcome (won/lost/draw)
- Category and stake amount
- Earned amount and voting score

### StatsOverview
Comprehensive statistics dashboard.

**Metrics:**
- Total debates and win rate
- Earnings and reputation
- Detailed breakdown
- Visual performance chart

### ActivityTimeline
Recent activity feed with timestamps.

**Activity Types:**
- Debate events (created, joined, won, lost)
- Voting activity
- Badge achievements
- Reputation changes
- Social actions

### FollowButton
Follow/unfollow button with live count.

**Features:**
- Optimistic UI updates
- Hover state for unfollow
- Live follower count
- Loading states

### ProfileEditModal
Profile editing modal with form validation.

**Editable Fields:**
- Avatar URL
- Bio (500 char max)
- Social links (Twitter, GitHub, Website)

## Usage

```tsx
import {
  ProfileCard,
  ReputationDisplay,
  BadgeCollection,
  DebateHistory,
  StatsOverview,
  ActivityTimeline,
  FollowButton,
  ProfileEditModal
} from "@/components/user";

// Basic profile page
<ProfileCard
  userId="user123"
  basename="alice.base.eth"
  reputation={1250}
  totalDebates={45}
  wins={32}
  losses={13}
  totalEarnings={850}
  isVerified={true}
/>
```

## Integration

All components use OnchainKit for Basename integration and identity verification. Ensure OnchainKit provider is configured in your app layout.
