import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { debates } from '@/lib/db/schema/debates';
import { eq, and } from 'drizzle-orm';
import { verifyDebateOnChain } from '@/lib/blockchain/verification';

/**
 * POST /api/debates/[id]/finalize
 * 
 * Finalize a debate by verifying on-chain status and updating database.
 * 
 * IMPORTANT: Blockchain is the source of truth for debate results.
 * This endpoint reads the on-chain winner and status, then updates the database accordingly.
 * 
 * Process:
 * 1. Verify debate exists and has on-chain data
 * 2. Call verifyDebateOnChain() to get current blockchain state
 * 3. Check if debate is already finalized on-chain
 * 4. Update database with on-chain winner and status
 * 5. Log any discrepancies between database and blockchain
 * 
 * This prevents issue #25 by ensuring database reflects blockchain truth.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const debateId = params.id;

    console.log('[Finalize API] Starting debate finalization:', debateId);

    // Fetch current debate from database
    const [debate] = await db
      .select()
      .from(debates)
      .where(eq(debates.id, debateId))
      .limit(1);

    if (!debate) {
      console.error('[Finalize API] Debate not found:', debateId);
      return NextResponse.json(
        { error: 'Debate not found' },
        { status: 404 }
      );
    }

    // Check if debate has on-chain data
    if (!debate.contractAddress) {
      console.error('[Finalize API] Debate has no contract address:', debateId);
      return NextResponse.json(
        { error: 'Debate has no on-chain contract address' },
        { status: 400 }
      );
    }

    // Verify current on-chain state
    console.log('[Finalize API] Verifying on-chain state...', {
      debateId,
      contractAddress: debate.contractAddress,
      currentStatus: debate.status,
      currentWinner: debate.winnerId,
    });

    const verification = await verifyDebateOnChain(debateId);

    if (!verification.isValid) {
      console.error('[Finalize API] On-chain verification failed:', {
        debateId,
        discrepancies: verification.discrepancies,
      });
      return NextResponse.json(
        {
          error: 'On-chain verification failed',
          discrepancies: verification.discrepancies,
        },
        { status: 400 }
      );
    }

    const onChainData = verification.onChainData;

    // Check if debate is finalized on-chain
    if (!onChainData.finalized) {
      console.warn('[Finalize API] Debate is not finalized on-chain:', {
        debateId,
        onChainStatus: onChainData.status,
      });
      return NextResponse.json(
        {
          error: 'Debate is not finalized on blockchain',
          onChainStatus: onChainData.status,
          message: 'The debate must be finalized on-chain before updating the database',
        },
        { status: 400 }
      );
    }

    const onChainWinner = onChainData.winner;
    const onChainStatus = onChainData.status;

    // Check for winner mismatch
    if (debate.winnerId && debate.winnerId !== onChainWinner) {
      console.warn('[Finalize API] ⚠️ Database winner mismatch, using blockchain winner:', {
        debateId,
        databaseWinner: debate.winnerId,
        blockchainWinner: onChainWinner,
      });
    }

    // Update database with on-chain truth
    console.log('[Finalize API] Updating database with on-chain data...', {
      debateId,
      onChainWinner,
      onChainStatus,
    });

    const now = new Date();

    const [updatedDebate] = await db
      .update(debates)
      .set({
        winnerId: onChainWinner,
        status: 'completed',
        onChainWinner,
        onChainStatus,
        finalizedAt: now,
        lastSyncedAt: now,
        syncStatus: 'confirmed',
      })
      .where(eq(debates.id, debateId))
      .returning();

    console.log('[Finalize API] Debate finalized successfully:', {
      debateId,
      winner: updatedDebate.winnerId,
      status: updatedDebate.status,
      onChainWinner: updatedDebate.onChainWinner,
      finalizedAt: updatedDebate.finalizedAt,
    });

    // Return comprehensive response with both database and blockchain data
    return NextResponse.json({
      success: true,
      message: 'Debate finalized successfully',
      debate: {
        id: updatedDebate.id,
        status: updatedDebate.status,
        winner: updatedDebate.winnerId,
        finalizedAt: updatedDebate.finalizedAt,
        lastSyncedAt: updatedDebate.lastSyncedAt,
      },
      blockchain: {
        winner: onChainWinner,
        status: onChainStatus,
        finalized: onChainData.finalized,
        contractAddress: debate.contractAddress,
        transactionHash: debate.transactionHash,
      },
      verification: {
        isValid: verification.isValid,
        verifiedAt: new Date().toISOString(),
        hadDiscrepancies: verification.discrepancies.length > 0,
        discrepanciesResolved: verification.discrepancies,
      },
    });
  } catch (error) {
    console.error('[Finalize API] Error finalizing debate:', error);
    return NextResponse.json(
      {
        error: 'Failed to finalize debate',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
