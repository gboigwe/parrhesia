#!/bin/bash

# Parrhesia Production Deployment Script
# Run this script to deploy to Base mainnet

set -e

echo "🚀 Parrhesia Production Deployment"
echo "=================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ Error: .env.local file not found"
  echo "Please copy .env.example to .env.local and configure it"
  exit 1
fi

# Check required environment variables
required_vars=(
  "NEXT_PUBLIC_CHAIN_ID"
  "ANTHROPIC_API_KEY"
  "DATABASE_URL"
  "NEXTAUTH_SECRET"
)

for var in "${required_vars[@]}"; do
  if ! grep -q "^$var=" .env.local || grep -q "^$var=$" .env.local; then
    echo "❌ Error: $var is not set in .env.local"
    exit 1
  fi
done

echo "✅ Environment variables validated"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Run type checking
echo ""
echo "🔍 Running type checking..."
pnpm tsc --noEmit

# Build the application
echo ""
echo "🏗️  Building application..."
pnpm build

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "Next steps:"
echo "1. Deploy to Vercel: vercel --prod"
echo "2. Deploy contracts: cd contracts && forge script script/Deploy.s.sol --rpc-url base --broadcast --verify"
echo "3. Update NEXT_PUBLIC_DEBATE_FACTORY_MAINNET in Vercel environment variables"
echo "4. Configure Supabase database"
echo "5. Setup monitoring with Sentry"
echo ""
