export const DebateFactoryABI = [
  {
    inputs: [{ name: "stakeAmount", type: "uint256" }],
    name: "createDebate",
    outputs: [{ name: "debatePool", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "debateCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "debateId", type: "uint256" }],
    name: "getDebate",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_STAKE",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_STAKE",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "debateId", type: "uint256" },
      { indexed: true, name: "debatePool", type: "address" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: false, name: "stakeAmount", type: "uint256" },
    ],
    name: "DebateCreated",
    type: "event",
  },
] as const;
