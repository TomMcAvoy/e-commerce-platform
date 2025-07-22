#!/bin/bash

# Quick Setup Script for E-Commerce Platform
# This script helps new developers get started quickly

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 E-Commerce Platform Quick Setup${NC}"
echo -e "${BLUE}===================================${NC}"
echo ""

# Check if running in correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check Node.js
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js found: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

# Check npm
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm found: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found. Please install npm${NC}"
    exit 1
fi

# Check MongoDB (optional)
if command -v mongod >/dev/null 2>&1; then
    echo -e "${GREEN}✅ MongoDB found${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB not found. Install with: brew install mongodb-community${NC}"
fi

echo ""
echo -e "${YELLOW}📦 Installing dependencies...${NC}"

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created from .env.example${NC}"
    echo -e "${BLUE}💡 Please edit .env file with your configuration${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

echo ""
echo -e "${YELLOW}🔨 Building project...${NC}"

# Build TypeScript
npm run build

echo -e "${GREEN}✅ Build completed${NC}"
echo ""

# Create required directories
echo -e "${YELLOW}📁 Creating required directories...${NC}"
mkdir -p uploads
mkdir -p test-results
mkdir -p logs

echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# Make scripts executable
echo -e "${YELLOW}🔧 Making scripts executable...${NC}"
chmod +x test-api.sh
chmod +x run-all-tests.sh
[ -f "enhanced-test-suite.sh" ] && chmod +x enhanced-test-suite.sh
[ -f "tests/e2e/run-all-tests.sh" ] && chmod +x tests/e2e/run-all-tests.sh

echo -e "${GREEN}✅ Scripts made executable${NC}"
echo ""

echo -e "${BLUE}🎉 Setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}🚀 Next steps:${NC}"
echo "1. Edit .env file with your configuration"
echo "2. Start MongoDB (if using locally): brew services start mongodb-community"
echo "3. Start development servers: npm run dev:all"
echo "4. Open debug page: http://localhost:3001/debug"
echo "5. Run tests: npm test"
echo ""

echo -e "${BLUE}📚 Useful commands:${NC}"
echo "• npm run dev:all          - Start both servers"
echo "• npm run dev:server       - Start backend only (port 3000)"
echo "• npm run dev:frontend     - Start frontend only (port 3001)"
echo "• npm test                 - Run comprehensive tests"
echo "• npm run seed             - Seed database with sample data"
echo ""

echo -e "${BLUE}🔗 Quick links:${NC}"
echo "• Backend health: http://localhost:3000/health"
echo "• Frontend: http://localhost:3001"
echo "• Debug page: http://localhost:3001/debug"
echo "• Static debug: http://localhost:3001/debug-api.html"
echo ""

echo -e "${GREEN}Happy coding! 🎉${NC}"
