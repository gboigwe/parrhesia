import { parseUnits, formatUnits } from "viem";

/**
 * Contract utility functions
 */

/**
 * Convert USDC amount to wei (6 decimals)
 */
export function usdcToWei(amount: number): bigint {
  return parseUnits(amount.toString(), 6);
}

/**
 * Convert wei to USDC amount (6 decimals)
 */
export function weiToUsdc(wei: bigint): number {
  return Number(formatUnits(wei, 6));
}

/**
 * Format transaction hash for display
 */
export function formatTxHash(hash: string): string {
  if (hash.length < 16) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

/**
 * Get BaseScan URL for transaction
 */
export function getBaseScanUrl(txHash: string, chainId: number = 8453): string {
  const baseUrl =
    chainId === 8453
      ? "https://basescan.org"
      : "https://sepolia.basescan.org";
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Get BaseScan URL for address
 */
export function getBaseScanAddressUrl(
  address: string,
  chainId: number = 8453
): string {
  const baseUrl =
    chainId === 8453
      ? "https://basescan.org"
      : "https://sepolia.basescan.org";
  return `${baseUrl}/address/${address}`;
}

/**
 * Check if transaction hash is valid
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Check if address is valid
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Calculate gas estimate buffer (add 20% to estimate)
 */
export function addGasBuffer(estimate: bigint): bigint {
  return (estimate * 120n) / 100n;
}
