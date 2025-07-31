#!/bin/bash

# Comprehensive Kill Script - Emergency stop for all development servers
# Works on macOS and Linux

echo "🚨 Stopping all development servers..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    echo -e "${YELLOW}Checking port $port...${NC}"
    
    # Get PIDs using the port
    pids=$(lsof -ti :$port 2>/dev/null)
    
    if [ -n "$pids" ]; then
        echo -e "${RED}Killing processes on port $port: $pids${NC}"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        sleep 1
        
        # Check if still running
        remaining=$(lsof -ti :$port 2>/dev/null)
        if [ -n "$remaining" ]; then
            echo -e "${RED}Force killing remaining processes: $remaining${NC}"
            echo "$remaining" | xargs kill -KILL 2>/dev/null || true
        fi
    else
        echo -e "${GREEN}Port $port is free${NC}"
    fi
}

# Kill processes on development ports
echo "🔍 Checking development ports..."
kill_port 3000
kill_port 3001
kill_port 3002
kill_port 3003
kill_port 5000
kill_port 8000

# Kill common development processes by name
echo ""
echo "🔍 Killing development processes..."

# Kill nodemon processes
echo "Killing nodemon processes..."
pkill -f nodemon 2>/dev/null || true
pgrep -f nodemon | xargs kill -9 2>/dev/null || true

# Kill Next.js processes
echo "Killing Next.js processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
pgrep -f "next.*dev" | xargs kill -9 2>/dev/null || true

# Kill ts-node processes
echo "Killing ts-node processes..."
pkill -f "ts-node" 2>/dev/null || true
pgrep -f "ts-node.*src/index" | xargs kill -9 2>/dev/null || true

# Kill npm/pnpm dev processes
echo "Killing npm/pnpm dev processes..."
pkill -f "npm.*dev" 2>/dev/null || true
pkill -f "pnpm.*dev" 2>/dev/null || true
pkill -f "yarn.*dev" 2>/dev/null || true

# Kill concurrently processes
echo "Killing concurrently processes..."
pkill -f concurrently 2>/dev/null || true

# Kill TypeScript compiler watch processes
echo "Killing TypeScript watch processes..."
pkill -f "tsc.*-w" 2>/dev/null || true
pkill -f "tsc.*--watch" 2>/dev/null || true

# Additional cleanup for stubborn processes
echo "Final cleanup..."
# Kill any node process with our project name
pkill -f "whitestart" 2>/dev/null || true
pkill -f "shoppingcart" 2>/dev/null || true

# Wait a moment for processes to die
sleep 2

echo ""
echo -e "${GREEN}✅ Server kill completed!${NC}"
echo ""

# Check final port status
echo "📊 Final port status:"
for port in 3000 3001 3002; do
    if lsof -ti :$port >/dev/null 2>&1; then
        echo -e "Port $port: ${RED}Still in use${NC}"
    else
        echo -e "Port $port: ${GREEN}Free${NC}"
    fi
done

echo ""
echo -e "${GREEN}🚀 All development servers stopped. Ready to restart!${NC}"
