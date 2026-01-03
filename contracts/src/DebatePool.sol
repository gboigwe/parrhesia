// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DebatePool
 * @notice Escrow contract for individual debate stakes and prize distribution
 * @dev Handles USDC deposits, holds stakes, and distributes prizes
 */
contract DebatePool is ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum DebateStatus {
        Pending,      // Waiting for challenger
        Active,       // Both staked, debate ongoing
        Voting,       // Debate ended, voting in progress
        Completed,    // Results finalized
        Cancelled     // Debate cancelled
    }

    // Debate configuration
    uint256 public immutable debateId;
    address public immutable creator;
    address public challenger;
    uint256 public immutable stakeAmount;

    // Token and fees
    IERC20 public immutable usdc;
    address public immutable treasury;
    uint256 public immutable platformFeePercent;
    uint256 public immutable voterRewardPercent;

    // Debate state
    DebateStatus public status;
    uint256 public prizePool;
    address public winner;
    uint256 public createdAt;
    uint256 public finalizedAt;

    // Tracking
    bool public creatorStaked;
    bool public challengerStaked;
    bool public prizesDistributed;

    // Events
    event Staked(address indexed user, uint256 amount);
    event DebateStarted(uint256 timestamp);
    event ResultFinalized(address indexed winner, uint256 timestamp);
    event PrizeDistributed(address indexed recipient, uint256 amount);
    event DebateCancelled(uint256 timestamp);
    event EmergencyWithdrawal(address indexed user, uint256 amount);

    /**
     * @notice Initialize debate pool
     * @param _debateId Unique debate identifier
     * @param _creator Address of debate creator
     * @param _stakeAmount Required stake amount in USDC
     * @param _usdc USDC token address
     * @param _treasury Platform treasury address
     * @param _platformFeePercent Platform fee in basis points
     * @param _voterRewardPercent Voter reward in basis points
     */
    constructor(
        uint256 _debateId,
        address _creator,
        uint256 _stakeAmount,
        address _usdc,
        address _treasury,
        uint256 _platformFeePercent,
        uint256 _voterRewardPercent
    ) {
        debateId = _debateId;
        creator = _creator;
        stakeAmount = _stakeAmount;
        usdc = IERC20(_usdc);
        treasury = _treasury;
        platformFeePercent = _platformFeePercent;
        voterRewardPercent = _voterRewardPercent;
        status = DebateStatus.Pending;
        createdAt = block.timestamp;
    }

    /**
     * @notice Stake USDC to join the debate
     * @dev Creator and challenger must both stake to activate debate
     * @dev Caller must approve this contract to transfer stakeAmount of USDC
     * @dev When both parties stake, debate status automatically changes to Active
     */
    function stake() external nonReentrant {
        require(status == DebateStatus.Pending, "Debate not pending");
        require(msg.sender == creator || challenger == address(0), "Not authorized");

        if (msg.sender == creator) {
            require(!creatorStaked, "Already staked");
            creatorStaked = true;
        } else {
            require(!challengerStaked, "Already staked");
            challenger = msg.sender;
            challengerStaked = true;
        }

        usdc.safeTransferFrom(msg.sender, address(this), stakeAmount);
        prizePool += stakeAmount;

        emit Staked(msg.sender, stakeAmount);

        // Activate debate when both have staked
        if (creatorStaked && challengerStaked) {
            status = DebateStatus.Active;
            emit DebateStarted(block.timestamp);
        }
    }

    /**
     * @notice Finalize debate results and set winner
     * @param _winner Address of the winning debater
     * @dev Only callable by authorized party (backend/voting contract)
     */
    function finalizeResults(address _winner) external {
        require(status == DebateStatus.Active || status == DebateStatus.Voting, "Invalid status");
        require(_winner == creator || _winner == challenger, "Invalid winner");

        winner = _winner;
        status = DebateStatus.Completed;
        finalizedAt = block.timestamp;

        emit ResultFinalized(_winner, block.timestamp);
    }

    /**
     * @notice Distribute prizes to winner, voters, and treasury after debate completion
     * @dev Can only be called once after debate is completed
     * @dev Automatically calculates platform fee, voter rewards pool, and winner prize
     * @param voterRewardRecipients Array of voter addresses to receive rewards
     * @param voterRewardAmounts Array of reward amounts for each voter (must match recipients length)
     */
    function distributePrizes(
        address[] calldata voterRewardRecipients,
        uint256[] calldata voterRewardAmounts
    ) external nonReentrant {
        require(status == DebateStatus.Completed, "Not completed");
        require(!prizesDistributed, "Already distributed");
        require(voterRewardRecipients.length == voterRewardAmounts.length, "Length mismatch");

        prizesDistributed = true;

        uint256 totalPool = prizePool;

        // Calculate fees
        uint256 platformFee = (totalPool * platformFeePercent) / 10000;
        uint256 voterRewardPool = (totalPool * voterRewardPercent) / 10000;
        uint256 winnerPrize = totalPool - platformFee - voterRewardPool;

        // Transfer platform fee to treasury
        if (platformFee > 0) {
            usdc.safeTransfer(treasury, platformFee);
            emit PrizeDistributed(treasury, platformFee);
        }

        // Transfer prize to winner
        usdc.safeTransfer(winner, winnerPrize);
        emit PrizeDistributed(winner, winnerPrize);

        // Distribute voter rewards
        uint256 totalVoterRewards = 0;
        for (uint256 i = 0; i < voterRewardRecipients.length; i++) {
            if (voterRewardAmounts[i] > 0) {
                usdc.safeTransfer(voterRewardRecipients[i], voterRewardAmounts[i]);
                emit PrizeDistributed(voterRewardRecipients[i], voterRewardAmounts[i]);
                totalVoterRewards += voterRewardAmounts[i];
            }
        }

        require(totalVoterRewards <= voterRewardPool, "Voter rewards exceed pool");
    }

    /**
     * @notice Emergency withdrawal if both parties agree or timeout
     * @dev Allows users to withdraw their stake in emergency situations
     */
    function emergencyWithdraw() external nonReentrant {
        require(status == DebateStatus.Pending || status == DebateStatus.Cancelled, "Cannot withdraw");
        require(msg.sender == creator || msg.sender == challenger, "Not participant");

        uint256 withdrawAmount = 0;

        if (msg.sender == creator && creatorStaked) {
            creatorStaked = false;
            withdrawAmount = stakeAmount;
        } else if (msg.sender == challenger && challengerStaked) {
            challengerStaked = false;
            withdrawAmount = stakeAmount;
        }

        require(withdrawAmount > 0, "Nothing to withdraw");

        prizePool -= withdrawAmount;
        usdc.safeTransfer(msg.sender, withdrawAmount);

        emit EmergencyWithdrawal(msg.sender, withdrawAmount);
    }

    /**
     * @notice Cancel debate (only if no one has staked yet)
     */
    function cancel() external {
        require(msg.sender == creator, "Only creator");
        require(status == DebateStatus.Pending, "Cannot cancel");
        require(!creatorStaked && !challengerStaked, "Stakes already placed");

        status = DebateStatus.Cancelled;
        emit DebateCancelled(block.timestamp);
    }

    /**
     * @notice Get debate info
     */
    function getDebateInfo() external view returns (
        DebateStatus _status,
        address _creator,
        address _challenger,
        uint256 _stakeAmount,
        uint256 _prizePool,
        address _winner,
        bool _creatorStaked,
        bool _challengerStaked
    ) {
        return (
            status,
            creator,
            challenger,
            stakeAmount,
            prizePool,
            winner,
            creatorStaked,
            challengerStaked
        );
    }
}
