# Blockchain Synchronization E2E Tests

Comprehensive end-to-end testing script for the blockchain synchronization system.

## What It Tests

1. **Create Debate Flow**
   - USDC approval and confirmation
   - Debate creation on blockchain
   - Transaction confirmation (2 blocks)
   - Debate ID extraction from logs
   - Database write with correct sync status
   - Blockchain/database verification

2. **Join Debate Flow**
   - USDC approval for joining
   - Join transaction on blockchain
   - Database update with opponent
   - Verification after join

3. **Event Listener**
   - Creates debate without database write
   - Waits for event listener to auto-sync
   - Verifies automatic database update

4. **Reconciliation Service**
   - Creates intentional database mismatch
   - Runs reconciliation
   - Verifies mismatch is fixed

5. **Prize Claim Verification**
   - Tests non-winner rejection
   - Tests winner eligibility
   - Tests double-claim prevention

## Prerequisites

### 1. Environment Variables

Add these to your `.env.local`:

```bash
# Required
TEST_WALLET_PRIVATE_KEY=0x... # Test wallet 1 (for creating debates)
TEST_WALLET_PRIVATE_KEY_2=0x... # Test wallet 2 (for joining debates)
NEXT_PUBLIC_DEBATE_FACTORY_ADDRESS=0x... # Your deployed factory address
NEXT_PUBLIC_USDC_ADDRESS=0x... # USDC address on Base Sepolia
BASE_RPC_URL=https://sepolia.base.org # Or your RPC URL

# Standard Next.js env vars
DATABASE_URL=postgresql://...
```

### 2. Test Wallet Setup

Your test wallets need:
- ETH on Base Sepolia (for gas)
- USDC on Base Sepolia (for stakes)

**Get Sepolia ETH:**
- Bridge from Ethereum Sepolia: https://bridge.base.org/
- Or use Base Sepolia faucet

**Get USDC:**
- Deploy a mock USDC contract, or
- Use existing USDC faucet if available

### 3. Install Dependencies

```bash
npm install --legacy-peer-deps
# or
pnpm install
```

The test script requires `tsx` which is already in devDependencies.

## Running the Tests

### Full Test Suite

```bash
npm run test:blockchain
```

Or directly with tsx:

```bash
npx tsx src/scripts/test-blockchain-sync.ts
```

### Expected Output

```
============================================================
BLOCKCHAIN SYNCHRONIZATION E2E TESTS
============================================================
Network: Base Sepolia (Chain ID: 84532)
Factory: 0x...
USDC: 0x...
============================================================

Test wallet 1: 0x...
Test wallet 2: 0x...

=== TEST 1: Create Debate Flow ===
Step 1: Approving USDC...
✅ USDC approval confirmed
Step 2: Creating debate on blockchain...
Transaction submitted: 0x...
Step 3: Waiting for blockchain confirmation (2 blocks)...
Confirmed at block: 12345678
Step 4: Extracting debate ID from transaction logs...
✅ Debate ID extracted from logs
Debate ID: 1
Step 5: Writing to database...
✅ Database record created with correct ID
✅ Sync status is confirmed
Step 6: Verifying blockchain matches database...
✅ Blockchain verification passed
✅ No discrepancies found
✅ TEST 1 PASSED: Create debate flow working correctly

=== TEST 2: Join Debate Flow ===
...
✅ TEST 2 PASSED: Join debate flow working correctly

=== TEST 3: Event Listener ===
...
✅ TEST 3 PASSED: Event listener working correctly

=== TEST 4: Reconciliation ===
...
✅ TEST 4 PASSED: Reconciliation working correctly

=== TEST 5: Prize Claim Verification ===
...
✅ TEST 5 PASSED: Prize claim verification working correctly

============================================================
ALL TESTS COMPLETED SUCCESSFULLY
============================================================

=== Cleaning Up Test Data ===
Deleted test debate: 1
Cleanup complete
```

## Troubleshooting

### Test 3 Fails (Event Listener)

If TEST 3 fails with timeout:
- Make sure the event listener service is running
- Start it with: `npm run dev` (it auto-starts via instrumentation.ts)
- Or run tests while dev server is running

### Transaction Fails

If transactions fail:
- Check wallet has sufficient ETH for gas
- Check wallet has sufficient USDC for stakes
- Verify USDC is approved for DebateFactory
- Check contract addresses are correct

### Database Errors

If database operations fail:
- Run the migration: `npx drizzle-kit push`
- Check DATABASE_URL is correct
- Verify database is accessible

### RPC Errors

If you see "rate limit" or connection errors:
- Use a private RPC endpoint (Alchemy, Infura, etc.)
- Add rate limiting between tests
- Check BASE_RPC_URL is correct

## Manual Testing

You can also test individual components:

### Test Create Debate Only
```typescript
// Comment out other test calls in runTests()
const { debateId, poolAddress } = await testCreateDebateFlow(walletClient1, account1, publicClient);
```

### Test Reconciliation Only
```typescript
// Requires existing debate ID
await testReconciliation('existing-debate-id', '0xCreatorAddress');
```

### Test Verification Only
```typescript
import { verifyDebateOnChain } from '@/lib/blockchain/verification';

const result = await verifyDebateOnChain('debate-id');
console.log(result);
```

## CI/CD Integration

To run in CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Run Blockchain Sync Tests
  env:
    TEST_WALLET_PRIVATE_KEY: ${{ secrets.TEST_WALLET_PRIVATE_KEY }}
    TEST_WALLET_PRIVATE_KEY_2: ${{ secrets.TEST_WALLET_PRIVATE_KEY_2 }}
    DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
  run: npx tsx src/scripts/test-blockchain-sync.ts
```

## Safety Notes

⚠️ **Important:**
- Only run on testnet (Base Sepolia)
- Use dedicated test wallets
- Don't commit private keys
- Tests create real blockchain transactions
- Gas costs are real (though minimal on testnet)
- Database records are created and deleted

## What Gets Cleaned Up

The script automatically cleans up:
- Test debates from database
- No blockchain state cleanup (immutable)

Blockchain transactions remain on-chain but that's expected behavior.
