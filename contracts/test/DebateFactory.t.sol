// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/DebateFactory.sol";
import "../src/DebatePool.sol";
import "./mocks/MockUSDC.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DebateFactoryTest is Test {
    DebateFactory public factory;
    DebateFactory public implementation;
    MockUSDC public usdc;

    address public owner = address(1);
    address public treasury = address(2);
    address public user1 = address(3);
    address public user2 = address(4);

    uint256 constant MIN_STAKE = 5e6; // 5 USDC
    uint256 constant MAX_STAKE = 1000e6; // 1000 USDC
    uint256 constant VALID_STAKE = 10e6; // 10 USDC

    event DebateCreated(
        uint256 indexed debateId,
        address indexed debatePool,
        address indexed creator,
        uint256 stakeAmount
    );

    function setUp() public {
        vm.startPrank(owner);

        // Deploy mock USDC
        usdc = new MockUSDC();

        // Deploy implementation
        implementation = new DebateFactory();

        // Deploy proxy
        bytes memory initData = abi.encodeWithSelector(
            DebateFactory.initialize.selector,
            address(usdc),
            treasury
        );

        ERC1967Proxy proxy = new ERC1967Proxy(
            address(implementation),
            initData
        );

        factory = DebateFactory(address(proxy));

        vm.stopPrank();

        // Fund users with USDC
        usdc.mint(user1, 1000e6);
        usdc.mint(user2, 1000e6);
    }

    function testInitialization() public view {
        assertEq(address(factory.usdc()), address(usdc));
        assertEq(factory.treasury(), treasury);
        assertEq(factory.platformFeePercent(), 500); // 5%
        assertEq(factory.voterRewardPercent(), 1000); // 10%
        assertEq(factory.debateCount(), 0);
    }

    function testCreateDebateSuccess() public {
        vm.startPrank(user1);

        address debatePool = factory.createDebate(VALID_STAKE);

        vm.stopPrank();

        assertTrue(debatePool != address(0));
        assertEq(factory.debateCount(), 1);
        assertEq(factory.debates(1), debatePool);
        assertTrue(factory.isDebate(debatePool));
    }

    function testCreateDebateMinStake() public {
        vm.prank(user1);
        address debatePool = factory.createDebate(MIN_STAKE);
        assertTrue(debatePool != address(0));
    }

    function testCreateDebateMaxStake() public {
        vm.prank(user1);
        address debatePool = factory.createDebate(MAX_STAKE);
        assertTrue(debatePool != address(0));
    }

    function testRevertCreateDebateStakeTooLow() public {
        vm.prank(user1);
        vm.expectRevert("Stake too low");
        factory.createDebate(MIN_STAKE - 1);
    }

    function testRevertCreateDebateStakeTooHigh() public {
        vm.prank(user1);
        vm.expectRevert("Stake too high");
        factory.createDebate(MAX_STAKE + 1);
    }

    function testMultipleDebates() public {
        vm.prank(user1);
        address debate1 = factory.createDebate(VALID_STAKE);

        vm.prank(user2);
        address debate2 = factory.createDebate(VALID_STAKE * 2);

        assertEq(factory.debateCount(), 2);
        assertEq(factory.debates(1), debate1);
        assertEq(factory.debates(2), debate2);
        assertTrue(debate1 != debate2);
    }

    function testUpdatePlatformFee() public {
        vm.prank(owner);
        factory.updatePlatformFee(750); // 7.5%
        assertEq(factory.platformFeePercent(), 750);
    }

    function testRevertUpdatePlatformFeeTooHigh() public {
        vm.prank(owner);
        vm.expectRevert("Fee too high");
        factory.updatePlatformFee(1001); // > 10%
    }

    function testUpdateVoterReward() public {
        vm.prank(owner);
        factory.updateVoterReward(1500); // 15%
        assertEq(factory.voterRewardPercent(), 1500);
    }

    function testRevertUpdateVoterRewardTooHigh() public {
        vm.prank(owner);
        vm.expectRevert("Reward too high");
        factory.updateVoterReward(2001); // > 20%
    }

    function testUpdateTreasury() public {
        address newTreasury = address(5);
        vm.prank(owner);
        factory.updateTreasury(newTreasury);
        assertEq(factory.treasury(), newTreasury);
    }

    function testRevertUpdateTreasuryInvalidAddress() public {
        vm.prank(owner);
        vm.expectRevert("Invalid treasury");
        factory.updateTreasury(address(0));
    }

    function testPauseUnpause() public {
        vm.prank(owner);
        factory.pause();

        vm.prank(user1);
        vm.expectRevert();
        factory.createDebate(VALID_STAKE);

        vm.prank(owner);
        factory.unpause();

        vm.prank(user1);
        address debatePool = factory.createDebate(VALID_STAKE);
        assertTrue(debatePool != address(0));
    }

    function testGetDebate() public {
        vm.prank(user1);
        address debatePool = factory.createDebate(VALID_STAKE);

        assertEq(factory.getDebate(1), debatePool);
    }
}
