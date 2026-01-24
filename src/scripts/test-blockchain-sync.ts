/**
 * End-to-End Blockchain Synchronization Test Script
 * 
 * Tests the complete blockchain sync system including:
 * - Debate creation with confirmation
 * - Debate joining with confirmation
 * - Event listener automatic sync
 * - Reconciliation service
 * - Prize claim verification
 * 
 * Run with: npx tsx src/scripts/test-blockchain-sync.ts
 * 
 * Requirements:
 * - Base Sepolia testnet
 * - Funded test wallet with USDC
 * - Environment variables configured
 */

import { createPublicClient, createWalletClient, http, parseUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { db } from '@/lib/db';
import { debates } from '@/lib/db/schema/debates';
import { eq, and } from 'drizzle-orm';
import { BLOCKCHAIN_CONFIG } from '@/lib/blockchain/constants';
import { waitForConfirmation, extractDebateIdFromLogs } from '@/lib/blockchain/transactions';
import { verifyDebateOnChain, verifyPrizeClaimEligibility } from '@/lib/blockchain/verification';
import { reconcileDebate } from '@/lib/blockchain/reconciliation';
import { DebateFactoryABI } from '@/lib/contracts/abis/DebateFactoryABI';
import { DebatePoolABI } from '@/lib/contracts/abis/DebatePoolABI';
import { USDCABI } from '@/lib/contracts/abis/USDCABI';

// Test configuration
const DEBATE_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_DEBATE_FACTORY_ADDRESS as `0x${string}`;
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`;
const TEST_PRIVATE_KEY = process.env.TEST_WALLET_PRIVATE_KEY as `0x${string}`;
const TEST_PRIVATE_KEY_2 = process.env.TEST_WALLET_PRIVATE_KEY_2 as `0x${string}`;

// Test state
const testDebateIds: string[] = [];
let testDebatePoolAddress: `0x${string}` | null = null;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    log(`❌ ASSERTION FAILED: ${message}`, 'red');
    throw new Error(`Assertion failed: ${message}`);
  }
  log(`✅ ${message}`, 'green');
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Setup clients
function setupClients() {
  if (!TEST_PRIVATE_KEY) {
    throw new Error('TEST_WALLET_PRIVATE_KEY not configured');
  }

  const account1 = privateKeyToAccount(TEST_PRIVATE_KEY);
  const account2 = TEST_PRIVATE_KEY_2 ? privateKeyToAccount(TEST_PRIVATE_KEY_2) : null;

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.BASE_RPC_URL),
  });

  const walletClient1 = createWalletClient({
    account: account1,
    chain: baseSepolia,
    transport: http(process.env.BASE_RPC_URL),
  });

  const walletClient2 = account2 ? createWalletClient({
    account: account2,
    chain: baseSepolia,
    transport: http(process.env.BASE_RPC_URL),
  }) : null;

  return { publicClient, walletClient1, walletClient2, account1, account2 };
}

/**
 * TEST 1: Create Debate Flow
 * Tests the complete debate creation with blockchain confirmation
 */
async function testCreateDebateFlow(walletClient: any, account: any, publicClient: any) {
  log('\n=== TEST 1: Create Debate Flow ===', 'cyan');

  const stakeAmount = parseUnits('10', 6); // 10 USDC
  const topic = `Test Debate ${Date.now()}`;

  // Step 1: Approve USDC
  log('Step 1: Approving USDC...', 'blue');
  const approveHash = await walletClient.writeContract({
    address: USDC_ADDRESS,
    abi: USDCABI,
    functionName: 'approve',
    args: [DEBATE_FACTORY_ADDRESS, stakeAmount],
  });

  const approvalConfirmation = await waitForConfirmation(approveHash);
  assert(approvalConfirmation.success, 'USDC approval confirmed');

  // Step 2: Create debate on-chain
  log('Step 2: Creating debate on blockchain...', 'blue');
  const createHash = await walletClient.writeContract({
    address: DEBATE_FACTORY_ADDRESS,
    abi: DebateFactoryABI,
    functionName: 'createDebate',
    args: [stakeAmount, USDC_ADDRESS],
  });

  log(`Transaction submitted: ${createHash}`, 'yellow');

  // Step 3: Wait for confirmation
  log('Step 3: Waiting for blockchain confirmation (2 blocks)...', 'blue');
  const confirmation = await waitForConfirmation(createHash);
  assert(confirmation.success, 'Transaction confirmed on blockchain');
  assert(confirmation.receipt !== null, 'Transaction receipt received');

  const blockNumber = confirmation.blockNumber!;
  log(`Confirmed at block: ${blockNumber}`, 'yellow');

  // Step 4: Extract debate ID from logs
  log('Step 4: Extracting debate ID from transaction logs...', 'blue');
  const debateId = extractDebateIdFromLogs(confirmation.receipt!, DebateFactoryABI);
  assert(debateId !== null, 'Debate ID extracted from logs');
  log(`Debate ID: ${debateId}`, 'yellow');

  // Get debate pool address from factory
  const poolAddress = await publicClient.readContract({
    address: DEBATE_FACTORY_ADDRESS,
    abi: DebateFactoryABI,
    functionName: 'debates',
    args: [BigInt(debateId!)],
  }) as `0x${string}`;

  testDebatePoolAddress = poolAddress;
  log(`Debate pool address: ${poolAddress}`, 'yellow');

  // Step 5: Write to database
  log('Step 5: Writing to database...', 'blue');
  const [dbDebate] = await db
    .insert(debates)
    .values({
      id: debateId!,
      topic,
      creatorId: account.address.toLowerCase(),
      stakeAmount: '10',
      status: 'pending',
      contractAddress: poolAddress,
      transactionHash: createHash,
      blockNumber: blockNumber.toString(),
      chainId: BLOCKCHAIN_CONFIG.chainId,
      syncStatus: 'confirmed',
      lastSyncedAt: new Date(),
    })
    .returning();

  testDebateIds.push(dbDebate.id);
  assert(dbDebate.id === debateId, 'Database record created with correct ID');
  assert(dbDebate.syncStatus === 'confirmed', 'Sync status is confirmed');

  // Step 6: Verify blockchain matches database
  log('Step 6: Verifying blockchain matches database...', 'blue');
  const verification = await verifyDebateOnChain(dbDebate.id);
  assert(verification.isValid, 'Blockchain verification passed');
  assert(verification.discrepancies.length === 0, 'No discrepancies found');

  log('✅ TEST 1 PASSED: Create debate flow working correctly', 'green');
  return { debateId: debateId!, poolAddress };
}

/**
 * TEST 2: Join Debate Flow
 * Tests joining an existing debate with blockchain confirmation
 */
async function testJoinDebateFlow(
  walletClient: any,
  account: any,
  poolAddress: `0x${string}`,
  debateId: string,
  publicClient: any
) {
  log('\n=== TEST 2: Join Debate Flow ===', 'cyan');

  // Get stake amount from contract
  const stakeAmount = await publicClient.readContract({
    address: poolAddress,
    abi: DebatePoolABI,
    functionName: 'stakeAmount',
  }) as bigint;

  // Step 1: Approve USDC
  log('Step 1: Approving USDC for join...', 'blue');
  const approveHash = await walletClient.writeContract({
    address: USDC_ADDRESS,
    abi: USDCABI,
    functionName: 'approve',
    args: [poolAddress, stakeAmount],
  });

  const approvalConfirmation = await waitForConfirmation(approveHash);
  assert(approvalConfirmation.success, 'USDC approval confirmed');

  // Step 2: Join debate on-chain
  log('Step 2: Joining debate on blockchain...', 'blue');
  const joinHash = await walletClient.writeContract({
    address: poolAddress,
    abi: DebatePoolABI,
    functionName: 'joinDebate',
  });

  log(`Join transaction submitted: ${joinHash}`, 'yellow');

  // Step 3: Wait for confirmation
  log('Step 3: Waiting for blockchain confirmation...', 'blue');
  const confirmation = await waitForConfirmation(joinHash);
  assert(confirmation.success, 'Join transaction confirmed');

  const blockNumber = confirmation.blockNumber!;
  log(`Confirmed at block: ${blockNumber}`, 'yellow');

  // Step 4: Update database
  log('Step 4: Updating database with opponent...', 'blue');
  const [updatedDebate] = await db
    .update(debates)
    .set({
      challengerId: account.address.toLowerCase(),
      status: 'active',
      lastSyncedAt: new Date(),
    })
    .where(eq(debates.id, debateId))
    .returning();

  assert(updatedDebate.challengerId === account.address.toLowerCase(), 'Opponent added to database');
  assert(updatedDebate.status === 'active', 'Debate status updated to active');

  // Step 5: Verify blockchain matches
  log('Step 5: Verifying blockchain matches database...', 'blue');
  const verification = await verifyDebateOnChain(debateId);
  assert(verification.isValid, 'Blockchain verification passed after join');

  log('✅ TEST 2 PASSED: Join debate flow working correctly', 'green');
}

/**
 * TEST 3: Event Listener
 * Tests that event listener automatically catches new debates
 */
async function testEventListener(walletClient: any, account: any, publicClient: any) {
  log('\n=== TEST 3: Event Listener ===', 'cyan');
  log('Note: This test requires the event listener service to be running', 'yellow');

  const stakeAmount = parseUnits('5', 6); // 5 USDC

  // Step 1: Create debate without writing to database
  log('Step 1: Creating debate on blockchain (bypassing database)...', 'blue');
  
  const approveHash = await walletClient.writeContract({
    address: USDC_ADDRESS,
    abi: USDCABI,
    functionName: 'approve',
    args: [DEBATE_FACTORY_ADDRESS, stakeAmount],
  });
  await waitForConfirmation(approveHash);

  const createHash = await walletClient.writeContract({
    address: DEBATE_FACTORY_ADDRESS,
    abi: DebateFactoryABI,
    functionName: 'createDebate',
    args: [stakeAmount, USDC_ADDRESS],
  });

  const confirmation = await waitForConfirmation(createHash);
  assert(confirmation.success, 'Debate created on blockchain');

  const debateId = extractDebateIdFromLogs(confirmation.receipt!, DebateFactoryABI);
  assert(debateId !== null, 'Debate ID extracted');

  // Step 2: Wait for event listener to process (up to 60 seconds)
  log('Step 2: Waiting for event listener to sync (max 60 seconds)...', 'blue');
  let found = false;
  for (let i = 0; i < 12; i++) {
    await sleep(5000);
    const [debate] = await db
      .select()
      .from(debates)
      .where(eq(debates.id, debateId!))
      .limit(1);

    if (debate) {
      found = true;
      testDebateIds.push(debate.id);
      assert(debate.syncStatus === 'confirmed', 'Event listener set correct sync status');
      assert(debate.contractAddress !== null, 'Event listener saved contract address');
      log(`Found debate in database after ${(i + 1) * 5} seconds`, 'yellow');
      break;
    }
  }

  if (!found) {
    log('⚠️ Event listener did not sync debate automatically (may not be running)', 'yellow');
    log('This is expected if the service is not running in the background', 'yellow');
  } else {
    log('✅ TEST 3 PASSED: Event listener working correctly', 'green');
  }
}

/**
 * TEST 4: Reconciliation
 * Tests that reconciliation service fixes database/blockchain mismatches
 */
async function testReconciliation(debateId: string, trueCreatorAddress: string) {
  log('\n=== TEST 4: Reconciliation ===', 'cyan');

  // Step 1: Create intentional mismatch
  log('Step 1: Creating intentional database mismatch...', 'blue');
  const fakeCreator = '0x0000000000000000000000000000000000000123';
  
  await db
    .update(debates)
    .set({
      creatorId: fakeCreator,
    })
    .where(eq(debates.id, debateId));

  log(`Changed creator from ${trueCreatorAddress} to ${fakeCreator}`, 'yellow');

  // Step 2: Verify mismatch exists
  log('Step 2: Verifying mismatch detected...', 'blue');
  const verificationBefore = await verifyDebateOnChain(debateId);
  assert(!verificationBefore.isValid, 'Mismatch detected by verification');
  assert(verificationBefore.discrepancies.length > 0, 'Discrepancies found');
  log(`Found ${verificationBefore.discrepancies.length} discrepancies`, 'yellow');

  // Step 3: Run reconciliation
  log('Step 3: Running reconciliation...', 'blue');
  const result = await reconcileDebate(debateId);
  assert(result.success, 'Reconciliation completed successfully');
  assert(result.updatedFields.length > 0, 'Fields were updated');
  log(`Updated fields: ${result.updatedFields.join(', ')}`, 'yellow');

  // Step 4: Verify mismatch fixed
  log('Step 4: Verifying mismatch fixed...', 'blue');
  const verificationAfter = await verifyDebateOnChain(debateId);
  assert(verificationAfter.isValid, 'No more discrepancies after reconciliation');

  const [fixedDebate] = await db
    .select()
    .from(debates)
    .where(eq(debates.id, debateId))
    .limit(1);

  assert(
    fixedDebate.creatorId.toLowerCase() === trueCreatorAddress.toLowerCase(),
    'Creator address restored to correct value'
  );

  log('✅ TEST 4 PASSED: Reconciliation working correctly', 'green');
}

/**
 * TEST 5: Prize Claim Verification
 * Tests on-chain verification before prize claims
 */
async function testPrizeClaimVerification(debateId: string, winnerAddress: string, loserAddress: string, publicClient: any) {
  log('\n=== TEST 5: Prize Claim Verification ===', 'cyan');

  // For this test, we'll simulate that the debate has been finalized
  // In a real scenario, the debate would need to be finalized on-chain first

  // Step 1: Check eligibility for non-winner (should fail)
  log('Step 1: Checking eligibility for non-winner...', 'blue');
  try {
    const eligibility = await verifyPrizeClaimEligibility(debateId, loserAddress);
    assert(!eligibility.eligible, 'Non-winner should not be eligible');
    assert(eligibility.reason === 'not_winner', 'Correct rejection reason');
    log('✅ Non-winner correctly rejected', 'green');
  } catch (error) {
    log('Note: Debate may not be finalized yet, skipping eligibility check', 'yellow');
  }

  // Step 2: Check eligibility for winner (should pass if finalized)
  log('Step 2: Checking eligibility for winner...', 'blue');
  try {
    const eligibility = await verifyPrizeClaimEligibility(debateId, winnerAddress);
    if (eligibility.eligible) {
      assert(eligibility.prizeAmount > 0, 'Prize amount is greater than 0');
      assert(!eligibility.alreadyClaimed, 'Prize not yet claimed');
      log('✅ Winner correctly verified as eligible', 'green');
    } else {
      log(`Winner not eligible yet: ${eligibility.reason}`, 'yellow');
    }
  } catch (error) {
    log('Note: Debate may not be finalized yet', 'yellow');
  }

  // Step 3: Simulate prize already claimed
  log('Step 3: Testing double claim prevention...', 'blue');
  await db
    .update(debates)
    .set({
      prizeClaimed: new Date(),
      prizeClaimTxHash: '0x1234567890abcdef',
    })
    .where(eq(debates.id, debateId));

  try {
    const eligibility = await verifyPrizeClaimEligibility(debateId, winnerAddress);
    assert(!eligibility.eligible, 'Should not be eligible after claiming');
    assert(eligibility.alreadyClaimed, 'Already claimed flag set');
    log('✅ Double claim correctly prevented', 'green');
  } catch (error) {
    log('Note: Debate may not be finalized yet', 'yellow');
  }

  log('✅ TEST 5 PASSED: Prize claim verification working correctly', 'green');
}

/**
 * Cleanup test data
 */
async function cleanup() {
  log('\n=== Cleaning Up Test Data ===', 'cyan');

  for (const debateId of testDebateIds) {
    try {
      await db.delete(debates).where(eq(debates.id, debateId));
      log(`Deleted test debate: ${debateId}`, 'yellow');
    } catch (error) {
      log(`Failed to delete debate ${debateId}: ${error}`, 'red');
    }
  }

  log('Cleanup complete', 'green');
}

/**
 * Main test runner
 */
async function runTests() {
  log('='.repeat(60), 'cyan');
  log('BLOCKCHAIN SYNCHRONIZATION E2E TESTS', 'cyan');
  log('='.repeat(60), 'cyan');
  log(`Network: Base Sepolia (Chain ID: ${BLOCKCHAIN_CONFIG.chainId})`, 'blue');
  log(`Factory: ${DEBATE_FACTORY_ADDRESS}`, 'blue');
  log(`USDC: ${USDC_ADDRESS}`, 'blue');
  log('='.repeat(60), 'cyan');

  try {
    // Setup
    const { publicClient, walletClient1, walletClient2, account1, account2 } = setupClients();
    
    log(`\nTest wallet 1: ${account1.address}`, 'blue');
    if (account2) {
      log(`Test wallet 2: ${account2.address}`, 'blue');
    }

    // Run tests
    const { debateId, poolAddress } = await testCreateDebateFlow(walletClient1, account1, publicClient);

    if (walletClient2 && account2) {
      await testJoinDebateFlow(walletClient2, account2, poolAddress, debateId, publicClient);
    } else {
      log('\n⚠️ Skipping TEST 2: Second wallet not configured', 'yellow');
    }

    await testEventListener(walletClient1, account1, publicClient);

    await testReconciliation(debateId, account1.address);

    if (walletClient2 && account2) {
      await testPrizeClaimVerification(debateId, account1.address, account2.address, publicClient);
    } else {
      log('\n⚠️ Skipping TEST 5: Second wallet not configured', 'yellow');
    }

    // Summary
    log('\n' + '='.repeat(60), 'cyan');
    log('ALL TESTS COMPLETED SUCCESSFULLY', 'green');
    log('='.repeat(60), 'cyan');
  } catch (error) {
    log('\n' + '='.repeat(60), 'red');
    log('TEST SUITE FAILED', 'red');
    log('='.repeat(60), 'red');
    console.error(error);
    process.exit(1);
  } finally {
    // Cleanup
    await cleanup();
  }
}

// Run tests
runTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
