#!/bin/bash
# Quick start script for new developers (copilot-instructions.md)

echo "🚀 E-Commerce Platform Quick Start"
echo "=================================="
echo "Following copilot-instructions.md workflow"
echo ""

# Check if this is first run
if [ ! -f ".env" ] || [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  First time setup detected - running full setup..."
    npm run setup
fi

echo "🔧 Starting health check..."
./scripts/health-check.sh

echo ""
echo "🚀 Starting both servers..."
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "Use 'npm run kill' if servers don't stop properly"

npm run dev:all
