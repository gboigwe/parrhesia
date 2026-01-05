import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { CONTRACT_ADDRESSES } from "@/lib/debate/constants";

const USDC_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const DEBATE_FACTORY_ABI = [
  {
    inputs: [{ name: "stakeAmount", type: "uint256" }],
    name: "createDebatePool",
    outputs: [{ name: "poolAddress", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export function useDebateCreation() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>();
  const [creationHash, setCreationHash] = useState<`0x${string}` | undefined>();

  const { isLoading: isApproving } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });

  const { isLoading: isCreating } = useWaitForTransactionReceipt({
    hash: creationHash,
  });

  const approveUSDC = async (amount: number) => {
    if (!address) throw new Error("Wallet not connected");

    const amountInWei = parseUnits(amount.toString(), 6);

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.USDC as `0x${string}`,
      abi: USDC_ABI,
      functionName: "approve",
      args: [CONTRACT_ADDRESSES.DEBATE_FACTORY as `0x${string}`, amountInWei],
    });

    setApprovalHash(hash);
    return hash;
  };

  const createDebate = async (stakeAmount: number) => {
    if (!address) throw new Error("Wallet not connected");

    const amountInWei = parseUnits(stakeAmount.toString(), 6);

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.DEBATE_FACTORY as `0x${string}`,
      abi: DEBATE_FACTORY_ABI,
      functionName: "createDebatePool",
      args: [amountInWei],
    });

    setCreationHash(hash);
    return hash;
  };

  return {
    approveUSDC,
    createDebate,
    isApproving,
    isCreating,
    approvalHash,
    creationHash,
  };
}
