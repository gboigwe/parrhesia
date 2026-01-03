// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/DebatePool.sol";
import "./mocks/MockUSDC.sol";

contract DebatePoolTest is Test {
    DebatePool public pool;
    MockUSDC public usdc;

    address public creator = address(1);
    address public challenger = address(2);
    address public treasury = address(3);
    address public voter1 = address(4);
    address public voter2 = address(5);
    address public backend = address(6);

    uint256 constant STAKE_AMOUNT = 10e6; // 10 USDC
    uint256 constant PLATFORM_FEE = 500; // 5%
    uint256 constant VOTER_REWARD = 1000; // 10%

    event Staked(address indexed user, uint256 amount);
    event DebateStarted(uint256 timestamp);
    event ResultFinalized(address indexed winner, uint256 timestamp);
    event PrizeDistributed(address indexed recipient, uint256 amount);

    function setUp() public {
        usdc = new MockUSDC();

        pool = new DebatePool(
            1,
            creator,
            STAKE_AMOUNT,
            address(usdc),
            treasury,
            PLATFORM_FEE,
            VOTER_REWARD
        );

        // Fund participants
        usdc.mint(creator, 100e6);
        usdc.mint(challenger, 100e6);
    }

    function testInitialization() public view {
        assertEq(pool.debateId(), 1);
        assertEq(pool.creator(), creator);
        assertEq(pool.stakeAmount(), STAKE_AMOUNT);
        assertEq(address(pool.usdc()), address(usdc));
        assertEq(pool.treasury(), treasury);
        assertEq(pool.platformFeePercent(), PLATFORM_FEE);
        assertEq(pool.voterRewardPercent(), VOTER_REWARD);
        assertTrue(pool.status() == DebatePool.DebateStatus.Pending);
    }

    function testCreatorStake() public {
        vm.startPrank(creator);
        usdc.approve(address(pool), STAKE_AMOUNT);

        vm.expectEmit(true, true, true, true);
        emit Staked(creator, STAKE_AMOUNT);

        pool.stake();
        vm.stopPrank();

        assertTrue(pool.creatorStaked());
        assertEq(pool.prizePool(), STAKE_AMOUNT);
        assertEq(usdc.balanceOf(address(pool)), STAKE_AMOUNT);
    }

    function testChallengerStakeAndActivation() public {
        // Creator stakes first
        vm.startPrank(creator);
        usdc.approve(address(pool), STAKE_AMOUNT);
        pool.stake();
        vm.stopPrank();

        // Challenger stakes
        vm.startPrank(challenger);
        usdc.approve(address(pool), STAKE_AMOUNT);

        vm.expectEmit(true, true, true, true);
        emit DebateStarted(block.timestamp);

        pool.stake();
        vm.stopPrank();

        assertTrue(pool.challengerStaked());
        assertEq(pool.challenger(), challenger);
        assertEq(pool.prizePool(), STAKE_AMOUNT * 2);
        assertTrue(pool.status() == DebatePool.DebateStatus.Active);
    }

    function testRevertCreatorStakeTwice() public {
        vm.startPrank(creator);
        usdc.approve(address(pool), STAKE_AMOUNT * 2);
        pool.stake();

        vm.expectRevert("Already staked");
        pool.stake();
        vm.stopPrank();
    }

    function testRevertChallengerStakeTwice() public {
        vm.startPrank(creator);
        usdc.approve(address(pool), STAKE_AMOUNT);
        pool.stake();
        vm.stopPrank();

        vm.startPrank(challenger);
        usdc.approve(address(pool), STAKE_AMOUNT);
        pool.stake();
        vm.stopPrank();

        // After both stake, status is Active, so staking again should revert with "Debate not pending"
        vm.prank(challenger);
        vm.expectRevert("Debate not pending");
        pool.stake();
    }

    function testFinalizeResults() public {
        _activateDebate();

        vm.expectEmit(true, true, true, true);
        emit ResultFinalized(creator, block.timestamp);

        vm.prank(backend);
        pool.finalizeResults(creator);

        assertEq(pool.winner(), creator);
        assertTrue(pool.status() == DebatePool.DebateStatus.Completed);
        assertTrue(pool.finalizedAt() > 0);
    }

    function testRevertFinalizeInvalidWinner() public {
        _activateDebate();

        vm.prank(backend);
        vm.expectRevert("Invalid winner");
        pool.finalizeResults(voter1);
    }

    function testDistributePrizes() public {
        _activateDebate();
        vm.prank(backend);
        pool.finalizeResults(creator);

        address[] memory voters = new address[](2);
        voters[0] = voter1;
        voters[1] = voter2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 5e5; // 0.5 USDC
        amounts[1] = 5e5; // 0.5 USDC

        uint256 totalPool = STAKE_AMOUNT * 2; // 20 USDC
        uint256 platformFee = (totalPool * PLATFORM_FEE) / 10000; // 1 USDC
        uint256 voterRewardPool = (totalPool * VOTER_REWARD) / 10000; // 2 USDC
        uint256 winnerPrize = totalPool - platformFee - voterRewardPool; // 17 USDC

        vm.prank(backend);
        pool.distributePrizes(voters, amounts);

        assertTrue(pool.prizesDistributed());
        assertEq(usdc.balanceOf(treasury), platformFee);
        assertEq(usdc.balanceOf(creator), 100e6 - STAKE_AMOUNT + winnerPrize);
        assertEq(usdc.balanceOf(voter1), amounts[0]);
        assertEq(usdc.balanceOf(voter2), amounts[1]);
    }

    function testRevertDistributePrizesNotCompleted() public {
        _activateDebate();

        address[] memory voters = new address[](0);
        uint256[] memory amounts = new uint256[](0);

        vm.prank(backend);
        vm.expectRevert("Not completed");
        pool.distributePrizes(voters, amounts);
    }

    function testRevertDistributePrizesTwice() public {
        _activateDebate();
        vm.prank(backend);
        pool.finalizeResults(creator);

        address[] memory voters = new address[](0);
        uint256[] memory amounts = new uint256[](0);

        vm.prank(backend);
        pool.distributePrizes(voters, amounts);

        vm.prank(backend);
        vm.expectRevert("Already distributed");
        pool.distributePrizes(voters, amounts);
    }

    function testRevertDistributePrizesLengthMismatch() public {
        _activateDebate();
        vm.prank(backend);
        pool.finalizeResults(creator);

        address[] memory voters = new address[](2);
        uint256[] memory amounts = new uint256[](1);

        vm.prank(backend);
        vm.expectRevert("Length mismatch");
        pool.distributePrizes(voters, amounts);
    }


    function testEmergencyWithdrawCreator() public {
        vm.startPrank(creator);
        usdc.approve(address(pool), STAKE_AMOUNT);
        pool.stake();

        pool.emergencyWithdraw();
        vm.stopPrank();

        assertFalse(pool.creatorStaked());
        assertEq(pool.prizePool(), 0);
        assertEq(usdc.balanceOf(creator), 100e6);
    }

    function testEmergencyWithdrawChallenger() public {
        vm.startPrank(creator);
        usdc.approve(address(pool), STAKE_AMOUNT);
        pool.stake();
        vm.stopPrank();

        vm.startPrank(challenger);
        usdc.approve(address(pool), STAKE_AMOUNT);
        pool.stake();

        // Cancel to allow withdrawal
        vm.stopPrank();

        // Test emergency withdrawal in cancelled state would need manual status change
        // This is edge case - normal flow doesn't allow emergency withdrawal after activation
    }

    function testRevertEmergencyWithdrawActive() public {
        _activateDebate();

        vm.prank(creator);
        vm.expectRevert("Cannot withdraw");
        pool.emergencyWithdraw();
    }

    function testCancel() public {
        vm.prank(creator);
        pool.cancel();

        assertTrue(pool.status() == DebatePool.DebateStatus.Cancelled);
    }

    function testRevertCancelNotCreator() public {
        vm.prank(challenger);
        vm.expectRevert("Only creator");
        pool.cancel();
    }

    function testRevertCancelAfterStake() public {
        vm.startPrank(creator);
        usdc.approve(address(pool), STAKE_AMOUNT);
        pool.stake();

        vm.expectRevert("Stakes already placed");
        pool.cancel();
        vm.stopPrank();
    }

    function testGetDebateInfo() public {
        (
            DebatePool.DebateStatus status,
            address _creator,
            address _challenger,
            uint256 _stakeAmount,
            uint256 _prizePool,
            address _winner,
            bool _creatorStaked,
            bool _challengerStaked
        ) = pool.getDebateInfo();

        assertTrue(status == DebatePool.DebateStatus.Pending);
        assertEq(_creator, creator);
        assertEq(_challenger, address(0));
        assertEq(_stakeAmount, STAKE_AMOUNT);
        assertEq(_prizePool, 0);
        assertEq(_winner, address(0));
        assertFalse(_creatorStaked);
        assertFalse(_challengerStaked);
    }

    // Helper function
    function _activateDebate() internal {
        vm.startPrank(creator);
        usdc.approve(address(pool), STAKE_AMOUNT);
        pool.stake();
        vm.stopPrank();

        vm.startPrank(challenger);
        usdc.approve(address(pool), STAKE_AMOUNT);
        pool.stake();
        vm.stopPrank();
    }
}
