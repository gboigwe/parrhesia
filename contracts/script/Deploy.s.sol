// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/DebateFactory.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DeployScript is Script {
    // Base Mainnet USDC address
    address constant USDC_BASE_MAINNET = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    // Base Sepolia USDC address (for testing only)
    address constant USDC_BASE_SEPOLIA = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address treasury = vm.envOr("TREASURY_ADDRESS", deployer);

        // Detect network - use mainnet by default
        uint256 chainId = block.chainid;
        address usdcAddress = chainId == 84532 ? USDC_BASE_SEPOLIA : USDC_BASE_MAINNET;
        string memory network = chainId == 84532 ? "Base Sepolia (Testnet)" : "Base Mainnet";

        console.log("Network:", network);
        console.log("Deployer:", deployer);
        console.log("Treasury:", treasury);
        console.log("USDC:", usdcAddress);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy implementation
        DebateFactory implementation = new DebateFactory();
        console.log("Implementation deployed at:", address(implementation));

        // Prepare initialization data
        bytes memory initData = abi.encodeWithSelector(
            DebateFactory.initialize.selector,
            usdcAddress,
            treasury
        );

        // Deploy proxy
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(implementation),
            initData
        );

        console.log("Proxy deployed at:", address(proxy));
        console.log("DebateFactory initialized successfully");

        // Verify configuration
        DebateFactory factory = DebateFactory(address(proxy));
        console.log("Platform fee:", factory.platformFeePercent(), "bps");
        console.log("Voter reward:", factory.voterRewardPercent(), "bps");
        console.log("Min stake:", factory.MIN_STAKE());
        console.log("Max stake:", factory.MAX_STAKE());

        vm.stopBroadcast();
    }
}
