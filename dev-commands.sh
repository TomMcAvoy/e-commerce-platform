#!/bin/bash

# Development Commands Quick Reference
# This project uses PNPM as the package manager

echo "🚀 WhiteStartups Development Commands"
echo "====================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}📦 Package Manager: PNPM${NC}"
echo "This project uses pnpm, not npm!"
echo ""

echo -e "${GREEN}🔧 Development Commands:${NC}"
echo "pnpm run dev:server       # Start backend server (port 3000)"
echo "pnpm run dev:frontend     # Start frontend (port 3001)" 
echo "pnpm run dev:all          # Start both servers"
echo ""

echo -e "${GREEN}🛑 Stop/Kill Commands:${NC}"
echo "pnpm run kill             # Kill all development servers"
echo "pnpm run stop             # Same as kill"
echo "./kill-servers.sh         # Direct script execution"
echo ""

echo -e "${GREEN}🏗️  Build Commands:${NC}"
echo "pnpm run build            # Build TypeScript"
echo "pnpm start                # Start production server"
echo ""

echo -e "${GREEN}🧪 Test Commands:${NC}"
echo "pnpm test                 # Run Jest tests"
echo "pnpm run test:e2e         # Run Playwright e2e tests"
echo "./scripts/test-social-features.sh  # Test social media features"
echo ""

echo -e "${GREEN}💾 Database Commands:${NC}"
echo "pnpm run seed             # Seed basic data"
echo "pnpm run seed:full        # Seed comprehensive data"
echo "pnpm run db:clear         # Clear database"
echo "pnpm run db:reset         # Reset database"
echo ""

echo -e "${GREEN}🤖 Social Media AI Commands:${NC}"
echo "./scripts/setup-social-ai.sh      # Setup AI features"
echo "./scripts/test-social-features.sh # Test AI features"
echo ""

echo -e "${YELLOW}⚠️  Common Issues:${NC}"
echo "• Use 'pnpm' not 'npm'"
echo "• If kill doesn't work, run: ./kill-servers.sh"
echo "• Check ports 3000 (backend) and 3001 (frontend)"
echo "• Make sure MongoDB is running"
echo ""

echo -e "${BLUE}🆘 Emergency Commands:${NC}"
echo "pnpm run kill:emergency   # Force kill by port"
echo "lsof -ti :3000 | xargs kill -9  # Kill port 3000"
echo "lsof -ti :3001 | xargs kill -9  # Kill port 3001"
echo ""

echo -e "${GREEN}✅ Current Status:${NC}"

# Check if processes are running
if lsof -ti :3000 >/dev/null 2>&1; then
    echo "Backend (port 3000): Running"
else
    echo "Backend (port 3000): Stopped"
fi

if lsof -ti :3001 >/dev/null 2>&1; then
    echo "Frontend (port 3001): Running"  
else
    echo "Frontend (port 3001): Stopped"
fi

# Check if MongoDB is running
if pgrep mongod >/dev/null 2>&1; then
    echo "MongoDB: Running"
else
    echo "MongoDB: Not detected (might be running as service)"
fi

echo ""
echo -e "${YELLOW}💡 Tip: Bookmark this command: ${GREEN}./dev-commands.sh${NC}"