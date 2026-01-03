/**
 * Smart Contract ABIs for Parrhesia
 * Generated from Foundry build artifacts
 */

// DebateFactory ABI - will be populated after contract compilation
export const DEBATE_FACTORY_ABI = [] as const;

// DebatePool ABI - will be populated after contract compilation
export const DEBATE_POOL_ABI = [] as const;

// Contract addresses - update after deployment
export const CONTRACT_ADDRESSES = {
  BASE_MAINNET: {
    DEBATE_FACTORY: "" as `0x${string}`,
  },
  BASE_SEPOLIA: {
    DEBATE_FACTORY: "" as `0x${string}`, // For testing only
  },
} as const;

/**
 * Get contract address for current network
 */
export function getDebateFactoryAddress(chainId: number): `0x${string}` {
  if (chainId === 8453) {
    // Base Mainnet
    return CONTRACT_ADDRESSES.BASE_MAINNET.DEBATE_FACTORY;
  } else if (chainId === 84532) {
    // Base Sepolia (testing only)
    return CONTRACT_ADDRESSES.BASE_SEPOLIA.DEBATE_FACTORY;
  }
  throw new Error(`Unsupported network: ${chainId}`);
}
