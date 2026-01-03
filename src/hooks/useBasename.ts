import { useState, useEffect } from "react";
import { useChainId } from "wagmi";
import { getName } from "@coinbase/onchainkit/identity";
import { base, baseSepolia } from "viem/chains";

/**
 * Hook to fetch and monitor Basename for a given address
 * @param address - Ethereum address to lookup
 * @returns basename, loading state, and error
 */
export function useBasename(address: `0x${string}` | undefined) {
  const [basename, setBasename] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const chainId = useChainId();

  useEffect(() => {
    const fetchBasename = async () => {
      if (!address) {
        setBasename(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Determine which chain to use for basename lookup
        const chain = chainId === baseSepolia.id ? baseSepolia : base;

        const name = await getName({ address, chain });

        setBasename(name || null);
      } catch (err) {
        console.error("Error fetching basename:", err);
        setError(err as Error);
        setBasename(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBasename();
  }, [address, chainId]);

  return { basename, isLoading, error };
}

/**
 * Validate if a string is a valid Basename format
 * @param name - Name to validate
 * @returns boolean indicating if valid
 */
export function isValidBasename(name: string): boolean {
  // Basename format: alphanumeric, hyphens, and ends with .base.eth or .basetest.eth
  const basenameRegex = /^[a-z0-9-]+\.(base\.eth|basetest\.eth)$/i;
  return basenameRegex.test(name);
}
