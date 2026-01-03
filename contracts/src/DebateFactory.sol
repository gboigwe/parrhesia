// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "./DebatePool.sol";

/**
 * @title DebateFactory
 * @notice Factory contract for creating and managing debate instances
 * @dev Implements UUPS upgradeable pattern with access control
 */
contract DebateFactory is UUPSUpgradeable, AccessControlUpgradeable, PausableUpgradeable {
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Platform configuration
    uint256 public platformFeePercent; // 5% = 500 (basis points)
    uint256 public voterRewardPercent; // 10% = 1000 (basis points)
    uint256 public constant MIN_STAKE = 5e6; // 5 USDC (6 decimals)
    uint256 public constant MAX_STAKE = 1000e6; // 1000 USDC

    address public usdc;
    address public treasury;

    // Debate tracking
    uint256 public debateCount;
    mapping(uint256 => address) public debates;
    mapping(address => bool) public isDebate;

    // Events
    event DebateCreated(
        uint256 indexed debateId,
        address indexed debatePool,
        address indexed creator,
        uint256 stakeAmount
    );
    event PlatformFeeUpdated(uint256 newFee);
    event VoterRewardUpdated(uint256 newReward);
    event TreasuryUpdated(address newTreasury);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initialize the factory contract
     * @param _usdc USDC token address on Base
     * @param _treasury Platform treasury address
     */
    function initialize(address _usdc, address _treasury) public initializer {
        require(_usdc != address(0), "Invalid USDC address");
        require(_treasury != address(0), "Invalid treasury address");

        __AccessControl_init();
        __Pausable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);

        usdc = _usdc;
        treasury = _treasury;
        platformFeePercent = 500; // 5%
        voterRewardPercent = 1000; // 10%
    }

    /**
     * @notice Create a new debate instance with specified stake amount
     * @dev Creates a new DebatePool contract with current platform parameters
     * @param stakeAmount Amount of USDC to stake (6 decimals), must be between MIN_STAKE and MAX_STAKE
     * @return debatePool Address of the newly created debate pool contract
     */
    function createDebate(uint256 stakeAmount) external whenNotPaused returns (address debatePool) {
        require(stakeAmount >= MIN_STAKE, "Stake too low");
        require(stakeAmount <= MAX_STAKE, "Stake too high");

        debateCount++;

        DebatePool pool = new DebatePool(
            debateCount,
            msg.sender,
            stakeAmount,
            usdc,
            treasury,
            platformFeePercent,
            voterRewardPercent
        );

        debatePool = address(pool);
        debates[debateCount] = debatePool;
        isDebate[debatePool] = true;

        emit DebateCreated(debateCount, debatePool, msg.sender, stakeAmount);

        return debatePool;
    }

    /**
     * @notice Update platform fee percentage
     * @param newFee New fee in basis points (500 = 5%)
     */
    function updatePlatformFee(uint256 newFee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        platformFeePercent = newFee;
        emit PlatformFeeUpdated(newFee);
    }

    /**
     * @notice Update voter reward percentage
     * @param newReward New reward in basis points (1000 = 10%)
     */
    function updateVoterReward(uint256 newReward) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newReward <= 2000, "Reward too high"); // Max 20%
        voterRewardPercent = newReward;
        emit VoterRewardUpdated(newReward);
    }

    /**
     * @notice Update treasury address
     * @param newTreasury New treasury address
     */
    function updateTreasury(address newTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newTreasury != address(0), "Invalid treasury");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    /**
     * @notice Pause the factory
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause the factory
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @notice Get debate pool address by ID
     * @param debateId Debate ID
     * @return Debate pool address
     */
    function getDebate(uint256 debateId) external view returns (address) {
        return debates[debateId];
    }

    /**
     * @dev Authorize upgrade (UUPS requirement)
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}
}
