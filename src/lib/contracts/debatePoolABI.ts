/**
 * DebatePool Contract ABI
 * For prize claiming and pool management
 */

export const DEBATE_POOL_ABI = [
  {
    type: "function",
    name: "claimPrize",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "getPoolState",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "creator", type: "address" },
      { name: "challenger", type: "address" },
      { name: "creatorStake", type: "uint256" },
      { name: "challengerStake", type: "uint256" },
      { name: "winner", type: "address" },
      { name: "isFinalized", type: "bool" },
      { name: "prizeClaimed", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "finalizeDebate",
    stateMutability: "nonpayable",
    inputs: [{ name: "winner", type: "address" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getPrizeAmount",
    stateMutability: "view",
    inputs: [{ name: "participant", type: "address" }],
    outputs: [{ name: "amount", type: "uint256" }],
  },
  {
    type: "function",
    name: "getTotalPool",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "total", type: "uint256" }],
  },
  {
    type: "event",
    name: "PrizeClaimed",
    inputs: [
      { name: "winner", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "DebateFinalized",
    inputs: [
      { name: "winner", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    type: "error",
    name: "NotWinner",
    inputs: [],
  },
  {
    type: "error",
    name: "AlreadyClaimed",
    inputs: [],
  },
  {
    type: "error",
    name: "DebateNotFinalized",
    inputs: [],
  },
  {
    type: "error",
    name: "InsufficientBalance",
    inputs: [],
  },
] as const;
