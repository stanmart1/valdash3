#!/bin/bash

# Solana Validator Dashboard - Program Verification Script
PROGRAM_ID="9KxB22cPSBkKXJJ9wusjQkfeVUrbT5qzCWdhCpnW5dpC"
REPO_URL="https://github.com/stanmart1/valdash3"
COMMIT_HASH=$(git rev-parse HEAD)

echo "🔨 Building verifiable program..."
anchor build --verifiable

echo "📤 Uploading verification metadata..."
solana-verify verify-from-repo $REPO_URL --program-id $PROGRAM_ID --commit-hash $COMMIT_HASH

echo "✅ Verification complete!"
echo "🔗 Check status at: https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"