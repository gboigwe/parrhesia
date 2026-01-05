# Debate Creation Flow

Complete debate creation system with form validation, smart contract integration, and transaction handling.

## Components

### CreateDebateForm
Main form component with zod validation and multi-step transaction flow.

**Features:**
- Title and description inputs with character limits
- Category selection (9 categories)
- Format selection (Live/Async)
- Stake amount selector with presets
- Duration settings (format-specific)
- Real-time validation with error messages
- Transaction progress tracking

### Supporting Components

**StakeSelector**
- Preset amounts (5, 10, 25, 50, 100, 250, 500, 1000 USDC)
- Custom amount input
- Balance checking
- Prize pool preview

**FormatSelector**
- Live debate (15-120 minutes)
- Async debate (12-72 hour rounds, 3-10 rounds)
- Feature comparison display

**CategorySelector**
- 9 debate categories with emoji icons
- Politics, Technology, Science, Philosophy, etc.

**DebateCreationModal**
- Multi-step transaction progress
- Success/error states
- Transaction hash display
- BaseScan link integration

**DebateCreatedSuccess**
- Success confirmation screen
- Debate summary
- Share functionality
- Next steps guidance

## Transaction Flow

1. **Form Validation** - Zod schema validation
2. **USDC Approval** - Approve DebateFactory to spend USDC
3. **Debate Creation** - Call createDebatePool on contract
4. **Database Save** - Save debate metadata to PostgreSQL
5. **Redirect** - Navigate to debate page

## Validation Schema

```typescript
{
  title: string (10-200 chars)
  description: string (50-2000 chars)
  category: enum (9 options)
  format: "timed" | "async"
  stakeAmount: number (5-1000 USDC)
  duration?: number (15-120 minutes for timed)
  roundDuration?: number (12-72 hours for async)
  maxRounds?: number (3-10 for async)
  votingDuration: number (24-168 hours)
}
```

## Smart Contract Integration

Uses `useDebateCreation` hook for:
- USDC approval transactions
- Debate pool creation
- Transaction receipt monitoring
- Error handling

## API Endpoint

**POST /api/debates**
- Validates form data
- Creates debate in database
- Returns debate ID for redirect

## Usage

```tsx
import { CreateDebateForm } from "@/components/debate";

<CreateDebateForm />
```

The form handles all validation, transactions, and navigation automatically.
