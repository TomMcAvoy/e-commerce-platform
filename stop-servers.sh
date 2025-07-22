#!/bin/bash

# Stop Script for E-Commerce Platform
# This script stops all development servers and related processes

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛑 Stopping E-Commerce Platform Development Servers${NC}"
echo -e "${BLUE}====================================================${NC}"
echo ""

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    local service_name=$2
    
    echo -e "${YELLOW}🔍 Checking port $port ($service_name)...${NC}"
    
    # Find processes on the port
    PIDS=$(lsof -ti :$port 2>/dev/null)
    
    if [ -n "$PIDS" ]; then
        echo -e "${RED}🔥 Killing processes on port $port:${NC}"
        for PID in $PIDS; do
            # Get process info
            PROCESS_INFO=$(ps -p $PID -o pid,ppid,comm,args --no-headers 2>/dev/null)
            if [ -n "$PROCESS_INFO" ]; then
                echo "   PID $PID: $PROCESS_INFO"
            fi
            
            # Try graceful termination first
            kill $PID 2>/dev/null
            sleep 1
            
            # Force kill if still running
            if kill -0 $PID 2>/dev/null; then
                echo -e "${RED}   Force killing PID $PID${NC}"
                kill -9 $PID 2>/dev/null
            fi
        done
        echo -e "${GREEN}✅ Port $port is now free${NC}"
    else
        echo -e "${GREEN}✅ Port $port is already free${NC}"
    fi
    echo ""
}

# Function to kill processes by name pattern
kill_by_pattern() {
    local pattern=$1
    local description=$2
    
    echo -e "${YELLOW}🔍 Looking for $description processes...${NC}"
    
    # Find processes matching the pattern
    PIDS=$(pgrep -f "$pattern" 2>/dev/null | grep -v $$)  # Exclude current script
    
    if [ -n "$PIDS" ]; then
        echo -e "${RED}🔥 Killing $description processes:${NC}"
        for PID in $PIDS; do
            PROCESS_INFO=$(ps -p $PID -o pid,ppid,comm,args --no-headers 2>/dev/null)
            if [ -n "$PROCESS_INFO" ]; then
                echo "   PID $PID: $PROCESS_INFO"
                kill $PID 2>/dev/null
                sleep 0.5
                
                # Force kill if still running
                if kill -0 $PID 2>/dev/null; then
                    echo -e "${RED}   Force killing PID $PID${NC}"
                    kill -9 $PID 2>/dev/null
                fi
            fi
        done
        echo -e "${GREEN}✅ $description processes stopped${NC}"
    else
        echo -e "${GREEN}✅ No $description processes found${NC}"
    fi
    echo ""
}

# Stop development servers by port
echo -e "${BLUE}📍 Stopping servers by port:${NC}"
kill_port 3010 "Backend API Server"
kill_port 3011 "Frontend Next.js Server"
kill_port 3002 "Alternative Frontend Port"

# Stop common development processes
echo -e "${BLUE}🔍 Stopping development processes:${NC}"
kill_by_pattern "npm.*dev" "npm dev"
kill_by_pattern "npm.*start" "npm start"
kill_by_pattern "next.*dev" "Next.js dev server"
kill_by_pattern "ts-node.*src/index.ts" "TypeScript backend"
kill_by_pattern "nodemon" "Nodemon"
kill_by_pattern "concurrently" "Concurrently"

# Stop specific build processes
echo -e "${BLUE}🏗️  Stopping build processes:${NC}"
kill_by_pattern "tsc.*-w" "TypeScript watch mode"
kill_by_pattern "webpack.*watch" "Webpack watch"

# Check for any remaining Node.js processes in the project directory
echo -e "${BLUE}🔍 Checking for remaining project processes:${NC}"
PROJECT_DIR="/Users/thomasmcavoy/GitHub/shoppingcart"
PROJECT_PROCESSES=$(ps aux | grep -E "node|npm" | grep "$PROJECT_DIR" | grep -v grep | grep -v $$ || true)

if [ -n "$PROJECT_PROCESSES" ]; then
    echo -e "${YELLOW}⚠️  Found remaining project processes:${NC}"
    echo "$PROJECT_PROCESSES"
    echo ""
    echo -e "${YELLOW}Do you want to kill these processes? (y/N):${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "$PROJECT_PROCESSES" | awk '{print $2}' | xargs kill -9 2>/dev/null || true
        echo -e "${GREEN}✅ Remaining processes killed${NC}"
    fi
else
    echo -e "${GREEN}✅ No remaining project processes found${NC}"
fi

echo ""

# Final port check
echo -e "${BLUE}🔍 Final port status check:${NC}"
PORT_3010=$(lsof -ti :3010 2>/dev/null)
PORT_3011=$(lsof -ti :3011 2>/dev/null)

if [ -z "$PORT_3010" ] && [ -z "$PORT_3011" ]; then
    echo -e "${GREEN}✅ All development servers stopped successfully!${NC}"
    echo -e "${GREEN}   Port 3010: Free${NC}"
    echo -e "${GREEN}   Port 3011: Free${NC}"
else
    echo -e "${YELLOW}⚠️  Some ports may still be in use:${NC}"
    [ -n "$PORT_3010" ] && echo -e "${RED}   Port 3010: In use (PID: $PORT_3010)${NC}"
    [ -n "$PORT_3011" ] && echo -e "${RED}   Port 3011: In use (PID: $PORT_3011)${NC}"
fi

echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo "• Backend server (port 3000): Stopped"
echo "• Frontend server (port 3001): Stopped"
echo "• Development processes: Stopped"
echo "• Build watchers: Stopped"
echo ""

echo -e "${BLUE}🚀 To restart development servers:${NC}"
echo "• Start both: npm run dev:all"
echo "• Backend only: npm run dev:server"
echo "• Frontend only: npm run dev:frontend"
echo ""

echo -e "${GREEN}🎉 Stop script completed!${NC}"
