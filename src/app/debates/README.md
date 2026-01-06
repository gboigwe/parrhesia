# Debate Discovery & List Page

## Overview

The debate discovery page (`/debates`) provides a comprehensive interface for browsing, filtering, and discovering debates on the Parrhesia platform. Built with TanStack Query for efficient data fetching and caching.

## Features

### 1. **Search & Filtering**
- **Text Search**: Search debates by title or description
- **Category Filter**: Filter by 9 debate categories (Politics, Technology, Science, Philosophy, Economics, Social, Entertainment, Sports)
- **Status Filter**: Filter by debate status (Open, Active, Voting, Completed)
- **Stake Range**: Filter debates by minimum and maximum stake amounts (in USDC)

### 2. **Sorting Options**
- **Newest First**: Default - shows most recently created debates
- **Most Popular**: Debates with the most participants/engagement
- **Highest Stake**: Debates with the largest stake amounts
- **Ending Soon**: Debates closest to their deadline

### 3. **Pagination**
- Load More pattern with configurable page size (default: 12 per page)
- Shows total count and indicates when all debates are loaded

### 4. **Loading & Empty States**
- Skeleton loaders during data fetch
- Context-aware empty states:
  - "No debates found" when filters return no results
  - "Create First Debate" when truly empty

## Components

### DebateDiscovery
**Location**: `src/components/debate/DebateDiscovery.tsx`

Main container component that:
- Manages filter state and pagination
- Uses TanStack Query for data fetching
- Coordinates child components
- Handles loading and error states

```tsx
<DebateDiscovery />
```

### DebateFilters
**Location**: `src/components/debate/DebateFilters.tsx`

Comprehensive filter UI with:
- Search input
- Category buttons with emojis
- Status buttons
- Stake range inputs (min/max)
- Sort option buttons
- Active filters summary with clear all

Props:
```typescript
interface DebateFiltersProps {
  filters: DebateFiltersState;
  onChange: (filters: Partial<DebateFiltersState>) => void;
}
```

### DebateList
**Location**: `src/components/debate/DebateList.tsx`

Responsive grid wrapper for debate cards:
- 1 column on mobile
- 2 columns on tablet (md)
- 3 columns on desktop (lg)

Props:
```typescript
interface DebateListProps {
  debates: Debate[];
}
```

### DebateSkeleton
**Location**: `src/components/debate/DebateSkeleton.tsx`

Loading skeleton that matches DebateCard structure.

Props:
```typescript
interface DebateSkeletonProps {
  count?: number; // Default: 6
}
```

### EmptyDebates
**Location**: `src/components/debate/EmptyDebates.tsx`

Conditional empty state component:
- Shows filter adjustment message when filters are active
- Shows "Create First Debate" CTA when no debates exist

Props:
```typescript
interface EmptyDebatesProps {
  hasFilters?: boolean;
}
```

## Data Flow

### 1. Filter State Management
```typescript
export interface DebateFiltersState {
  search: string;
  category: string;
  status: string;
  minStake: number;
  maxStake: number;
  sortBy: "newest" | "popular" | "stake" | "ending";
}
```

### 2. API Integration
**Endpoint**: `GET /api/debates`

Query Parameters:
- `page`: Current page number (1-indexed)
- `limit`: Number of debates per page
- `search`: Search text
- `category`: Category filter (or "all")
- `status`: Status filter (or "all")
- `minStake`: Minimum stake amount
- `maxStake`: Maximum stake amount
- `sortBy`: Sort option

Response:
```typescript
{
  debates: Debate[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}
```

### 3. TanStack Query Usage
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["debates", filters, page],
  queryFn: async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search: filters.search,
      category: filters.category,
      status: filters.status,
      minStake: filters.minStake.toString(),
      maxStake: filters.maxStake.toString(),
      sortBy: filters.sortBy,
    });
    const response = await fetch(`/api/debates?${params}`);
    if (!response.ok) throw new Error("Failed to fetch debates");
    return response.json();
  },
});
```

## Filter Utilities

**Location**: `src/lib/debate/filters.ts`

Reusable filter and sort functions:
- `filterBySearch(debates, search)`
- `filterByCategory(debates, category)`
- `filterByStatus(debates, status)`
- `filterByStakeRange(debates, minStake, maxStake)`
- `sortDebates(debates, sortBy)`
- `applyFiltersAndSort(debates, filters)`
- `paginateDebates(debates, page, limit)`
- `hasActiveFilters(filters)`
- `getDefaultFilters()`

## Setup & Integration

### 1. QueryProvider Setup
The app is wrapped with QueryProvider in `src/app/layout.tsx`:

```tsx
<QueryProvider>
  <OnchainProviders>
    <AuthProvider>{children}</AuthProvider>
  </OnchainProviders>
</QueryProvider>
```

### 2. Page Implementation
```tsx
// src/app/debates/page.tsx
import { DebateDiscovery } from "@/components/debate/DebateDiscovery";

export default function DebatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <DebateDiscovery />
    </div>
  );
}
```

## Performance Considerations

### Caching Strategy
- **Stale Time**: 1 minute - data stays fresh
- **GC Time**: 5 minutes - unused cache cleanup
- **Query Key**: Includes filters and page for granular cache control

### Optimizations
- Debounced search input (implement if needed)
- Infinite scroll alternative to "Load More"
- Virtual scrolling for large lists
- Server-side filtering for production

## Future Enhancements

1. **Advanced Filters**
   - Date range picker
   - Participant filters (debates you joined, debates you created)
   - Debate format filter (timed vs async)

2. **UI Improvements**
   - Infinite scroll option
   - View mode toggle (grid/list)
   - Saved filter presets

3. **Performance**
   - Server-side pagination with cursor-based approach
   - Implement debounced search
   - Virtual scrolling for large lists

4. **Analytics**
   - Track popular filters
   - Filter usage metrics
   - Performance monitoring

## Testing Checklist

- [ ] Search returns correct results
- [ ] Each filter works independently
- [ ] Multiple filters work together
- [ ] Sorting changes debate order correctly
- [ ] Pagination loads more debates
- [ ] Empty states show appropriately
- [ ] Loading states display during fetch
- [ ] Clear filters resets to default
- [ ] Active filters summary is accurate
- [ ] Responsive layout works on all breakpoints

## Related Files

- `/src/app/debates/page.tsx` - Page component
- `/src/components/debate/DebateDiscovery.tsx` - Main component
- `/src/components/debate/DebateFilters.tsx` - Filter UI
- `/src/components/debate/DebateList.tsx` - Grid layout
- `/src/components/debate/DebateSkeleton.tsx` - Loading state
- `/src/components/debate/EmptyDebates.tsx` - Empty state
- `/src/app/api/debates/route.ts` - API endpoint
- `/src/lib/debate/filters.ts` - Filter utilities
- `/src/providers/QueryProvider.tsx` - TanStack Query setup
