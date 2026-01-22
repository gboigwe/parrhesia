-- Migration: Add blockchain synchronization fields to debates table
-- Purpose: Ensure Supabase database stays in sync with Base blockchain
-- Issue: #25 - Blockchain synchronization
-- Created: 2026-01-22

-- Add blockchain synchronization columns to debates table
ALTER TABLE debates
  ADD COLUMN IF NOT EXISTS contract_address TEXT,
  ADD COLUMN IF NOT EXISTS transaction_hash TEXT,
  ADD COLUMN IF NOT EXISTS block_number BIGINT,
  ADD COLUMN IF NOT EXISTS chain_id INTEGER DEFAULT 8453,
  ADD COLUMN IF NOT EXISTS sync_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS last_synced_block BIGINT,
  ADD COLUMN IF NOT EXISTS on_chain_winner TEXT,
  ADD COLUMN IF NOT EXISTS on_chain_status TEXT,
  ADD COLUMN IF NOT EXISTS sync_errors JSONB DEFAULT '[]'::jsonb;

-- Add CHECK constraint for sync_status to ensure valid values
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'debates_sync_status_check'
  ) THEN
    ALTER TABLE debates
      ADD CONSTRAINT debates_sync_status_check
      CHECK (sync_status IN ('pending', 'confirming', 'confirmed', 'failed', 'syncing'));
  END IF;
END $$;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_debates_contract_address 
  ON debates(contract_address) 
  WHERE contract_address IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_debates_transaction_hash 
  ON debates(transaction_hash) 
  WHERE transaction_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_debates_sync_status 
  ON debates(sync_status) 
  WHERE sync_status IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_debates_block_number 
  ON debates(block_number) 
  WHERE block_number IS NOT NULL;

-- Create composite index for sync operations
CREATE INDEX IF NOT EXISTS idx_debates_sync_ops 
  ON debates(sync_status, last_synced_at) 
  WHERE sync_status IN ('pending', 'syncing', 'failed');

-- Add column comments for documentation
COMMENT ON COLUMN debates.contract_address IS 
  'Address of the deployed debate contract on Base blockchain (L2)';

COMMENT ON COLUMN debates.transaction_hash IS 
  'Transaction hash of the debate creation on Base blockchain';

COMMENT ON COLUMN debates.block_number IS 
  'Block number where the debate was created on Base blockchain';

COMMENT ON COLUMN debates.chain_id IS 
  'Chain ID - 8453 for Base mainnet, 84532 for Base Sepolia testnet';

COMMENT ON COLUMN debates.sync_status IS 
  'Current synchronization status between database and blockchain. Values: pending (waiting for confirmation), confirming (tx submitted), confirmed (tx confirmed), failed (tx failed), syncing (actively syncing state)';

COMMENT ON COLUMN debates.last_synced_at IS 
  'Timestamp of the last successful synchronization with blockchain';

COMMENT ON COLUMN debates.last_synced_block IS 
  'Block number at which the last synchronization occurred';

COMMENT ON COLUMN debates.on_chain_winner IS 
  'Winner address according to blockchain - this is the source of truth for prize distribution';

COMMENT ON COLUMN debates.on_chain_status IS 
  'Status of the debate according to blockchain - source of truth';

COMMENT ON COLUMN debates.sync_errors IS 
  'Array of synchronization errors with timestamps and error details for debugging';

-- Create a function to track sync errors
CREATE OR REPLACE FUNCTION add_sync_error(
  p_debate_id UUID,
  p_error_message TEXT,
  p_error_code TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE debates
  SET sync_errors = sync_errors || jsonb_build_object(
    'timestamp', NOW(),
    'message', p_error_message,
    'code', p_error_code
  )
  WHERE id = p_debate_id;
END;
$$;

COMMENT ON FUNCTION add_sync_error IS 
  'Helper function to append sync errors to the sync_errors array';

-- Create a view for debates that need syncing
CREATE OR REPLACE VIEW debates_needing_sync AS
SELECT 
  id,
  topic,
  contract_address,
  transaction_hash,
  block_number,
  sync_status,
  last_synced_at,
  last_synced_block,
  created_at
FROM debates
WHERE 
  sync_status IN ('pending', 'syncing', 'failed')
  OR (
    sync_status = 'confirmed' 
    AND last_synced_at < NOW() - INTERVAL '1 hour'
  )
ORDER BY 
  CASE sync_status
    WHEN 'failed' THEN 1
    WHEN 'pending' THEN 2
    WHEN 'syncing' THEN 3
    ELSE 4
  END,
  created_at ASC;

COMMENT ON VIEW debates_needing_sync IS 
  'View of debates that require synchronization with blockchain, prioritized by status and age';
