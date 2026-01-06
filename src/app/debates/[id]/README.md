# Debate Detail Page

## Overview

The debate detail page (`/debates/[id]`) provides a comprehensive view of an individual debate, including participants, arguments, and submission interface for active participants.

## Features

### 1. **Debate Header**
- **Topic & Resolution**: Clear display of debate topic and full resolution statement
- **Participants**: Visual cards for both sides (Proposition vs Opposition)
- **Basename Display**: Shows participants' Basenames from Coinbase
- **Stakes & Prize Pool**: Prominent display of stake amounts and total prize pool
- **Status & Category**: Debate status badge and category with emoji
- **Format Badge**: Live (timed) or Async debate format indicator

### 2. **Argument Display**
- **Round-Based Organization**: Arguments grouped by round number
- **Side-by-Side Layout**: Pro and Con arguments displayed side-by-side
- **Argument Stats**: Count of arguments per side and total rounds
- **Empty States**: Clear messaging when awaiting arguments
- **Timestamps**: Display when arguments were submitted

### 3. **Argument Submission**
- **Word Count Tracking**: Real-time word counter (50-500 words)
- **Color-Coded Feedback**: Visual indicators for word count status
- **Source Citations**: Optional multiple URL inputs for citations (up to 5)
- **Validation**: Client and server-side validation
- **Guidelines**: Helpful tips for submitting quality arguments
- **Round Tracking**: Automatically calculates next round number

### 4. **Info Sidebar**
- **Debate Details**: Format, status, stakes, prize pool, dates
- **Join Button**: For eligible users to join as challenger
- **Participants List**: Visual list of debate participants
- **Share Functionality**: Share debate via social platforms
- **Debate Rules**: Quick reference for debate guidelines

### 5. **Loading & Error States**
- **Skeleton Loaders**: Smooth loading experience
- **Error Handling**: Graceful error messages with retry options
- **Not Found**: Clear 404 state for missing debates

## Components

### DebateHeader
**Location**: `src/components/debate/DebateHeader.tsx`

Displays debate metadata, participants, and prize information.

```tsx
<DebateHeader debate={debate} />
```

Props:
- `debate`: Full debate object with participants

### ArgumentList
**Location**: `src/components/debate/ArgumentList.tsx`

Renders arguments organized by rounds with side-by-side layout.

```tsx
<ArgumentList
  arguments={arguments}
  creatorId={debate.creator.id}
  challengerId={debate.challenger?.id}
  emptyMessage="Custom empty state message"
/>
```

Props:
- `arguments`: Array of argument objects
- `creatorId`: ID of debate creator (Pro side)
- `challengerId`: ID of challenger (Con side)
- `emptyMessage`: Optional custom empty state text

### ArgumentSubmissionForm
**Location**: `src/components/debate/ArgumentSubmissionForm.tsx`

Form for participants to submit arguments with validation and sources.

```tsx
<ArgumentSubmissionForm
  debateId={debate.id}
  onSubmit={handleSubmit}
  isSubmitting={false}
  roundNumber={1}
  side="pro"
  minWords={50}
  maxWords={500}
/>
```

Props:
- `debateId`: Debate identifier
- `onSubmit`: Async handler for submission
- `isSubmitting`: Loading state
- `roundNumber`: Current round number
- `side`: "pro" or "con"
- `minWords`: Minimum word count (default: 50)
- `maxWords`: Maximum word count (default: 500)

### DebateInfoSidebar
**Location**: `src/components/debate/DebateInfoSidebar.tsx`

Sidebar with debate information, join button, and rules.

```tsx
<DebateInfoSidebar
  debate={debate}
  onJoinDebate={handleJoin}
  canJoin={true}
  isJoining={false}
/>
```

Props:
- `debate`: Debate object
- `onJoinDebate`: Optional join handler
- `canJoin`: Whether user can join
- `isJoining`: Loading state for join action

### DebateDetailSkeleton
**Location**: `src/components/debate/DebateDetailSkeleton.tsx`

Loading skeleton matching debate detail layout.

```tsx
<DebateDetailSkeleton />
```

### DebateErrorState
**Location**: `src/components/debate/DebateErrorState.tsx`

Error state with retry option.

```tsx
<DebateErrorState
  error="Debate not found"
  onRetry={() => refetch()}
/>
```

Props:
- `error`: Error message string
- `onRetry`: Optional retry handler

## Data Flow

### Fetching Debate Details
```typescript
const { data: debateData, isLoading, error } = useQuery({
  queryKey: ["debate", debateId],
  queryFn: async () => {
    const response = await fetch(`/api/debates/${debateId}`);
    if (!response.ok) throw new Error("Debate not found");
    return response.json();
  },
});
```

### Fetching Arguments
```typescript
const { data: argumentsData, refetch } = useQuery({
  queryKey: ["arguments", debateId],
  queryFn: async () => {
    const response = await fetch(`/api/debates/${debateId}/arguments`);
    if (!response.ok) throw new Error("Failed to fetch arguments");
    return response.json();
  },
});
```

### Submitting Arguments
```typescript
const handleSubmitArgument = async (content: string, sources?: string[]) => {
  const response = await fetch(`/api/debates/${debateId}/arguments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content,
      userId: user.id,
      roundNumber,
      sources,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }

  await refetchArguments();
};
```

## API Endpoints

### GET /api/debates/[id]
Fetches debate details with participants.

**Response:**
```json
{
  "debate": {
    "id": "uuid",
    "topic": "string",
    "resolution": "string",
    "category": "string",
    "format": "timed" | "async",
    "status": "pending" | "active" | "voting" | "completed",
    "stakeAmount": "string",
    "prizePool": "string",
    "createdAt": "Date",
    "creator": { "id": "uuid", "basename": "string" },
    "challenger": { "id": "uuid", "basename": "string" } | null
  }
}
```

### GET /api/debates/[id]/arguments
Fetches all arguments for a debate.

**Response:**
```json
{
  "arguments": [
    {
      "id": "uuid",
      "content": "string",
      "wordCount": 123,
      "roundNumber": 1,
      "createdAt": "Date",
      "user": { "id": "uuid", "basename": "string" },
      "sources": ["url1", "url2"]
    }
  ]
}
```

### POST /api/debates/[id]/arguments
Submits a new argument.

**Request:**
```json
{
  "content": "string (50-500 words)",
  "userId": "uuid",
  "roundNumber": 1,
  "sources": ["url1", "url2"] // optional
}
```

**Response:**
```json
{
  "message": "Argument submitted successfully",
  "argument": { /* argument object */ }
}
```

## Responsive Design

The page uses a responsive grid layout:

- **Mobile (< 768px)**: Single column, full-width components
- **Tablet (768px - 1024px)**: Single column with improved spacing
- **Desktop (> 1024px)**: 2-column grid (main content + sidebar)

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">
    {/* Main content */}
  </div>
  <div className="lg:col-span-1">
    {/* Sidebar */}
  </div>
</div>
```

## User Permissions

### View Debate
- Anyone can view debate details and arguments

### Submit Arguments
- Only active participants (creator or challenger)
- Only when debate status is "active"
- Must be the participant's turn (if using turn-based logic)

### Join Debate
- Authenticated users only
- Debate must be in "pending" status
- User cannot be the creator
- No existing challenger

## Validation Rules

### Argument Content
- Minimum: 50 words
- Maximum: 500 words
- Cannot be empty or whitespace-only
- Word count calculated by splitting on whitespace

### Sources (Optional)
- Must be valid URLs
- Maximum 5 sources per argument
- Empty strings filtered out before submission

## Future Enhancements

1. **Real-time Updates**
   - WebSocket integration for live argument updates
   - Real-time typing indicators

2. **Rich Text Editor**
   - Markdown support for formatting
   - Image embedding support
   - Code block support

3. **Argument Reactions**
   - Upvote/downvote individual arguments
   - Flag inappropriate content

4. **Turn-Based Logic**
   - Enforce alternating arguments
   - Time limits per turn

5. **Argument Analytics**
   - Reading time estimates
   - Complexity scores
   - Source credibility analysis

6. **Spectator Features**
   - Follow debates
   - Get notified of new arguments
   - Live spectator count

## Related Files

- `/src/app/debates/[id]/page.tsx` - Main page component
- `/src/components/debate/DebateHeader.tsx` - Header component
- `/src/components/debate/ArgumentList.tsx` - Arguments display
- `/src/components/debate/ArgumentSubmissionForm.tsx` - Submission form
- `/src/components/debate/DebateInfoSidebar.tsx` - Info sidebar
- `/src/components/debate/DebateDetailSkeleton.tsx` - Loading state
- `/src/components/debate/DebateErrorState.tsx` - Error state
- `/src/app/api/debates/[id]/route.ts` - Debate API
- `/src/app/api/debates/[id]/arguments/route.ts` - Arguments API
