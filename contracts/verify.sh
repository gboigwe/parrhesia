#!/bin/bash

echo "=== Parrhesia Smart Contracts Verification ==="
echo ""
echo "1. Running Foundry tests..."
forge test --match-contract "Debate" -vv
echo ""
echo "2. Checking gas optimizations..."
forge test --gas-report --match-contract "Debate" | grep "Deployment Cost"
echo ""
echo "3. Compilation check..."
forge build --sizes
echo ""
echo "=== Verification Complete ==="
