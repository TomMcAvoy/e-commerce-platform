#!/bin/bash

# Quick Kill Script - Emergency stop for development servers
# This is a faster, more aggressive version of the stop script

echo "🚨 Emergency stop: Killing all development servers..."

# Kill processes on development ports
echo "Killing processes on ports 3000, 3001, 3002..."
lsof -ti :3000 :3001 :3002 2>/dev/null | xargs kill -9 2>/dev/null || true

# Kill common development processes
echo "Killing npm, node, and development processes..."
pkill -f "npm.*dev" 2>/dev/null || true
pkill -f "npm.*start" 2>/dev/null || true
pkill -f "next.*dev" 2>/dev/null || true
pkill -f "ts-node.*src/index.ts" 2>/dev/null || true
pkill -f nodemon 2>/dev/null || true
pkill -f concurrently 2>/dev/null || true
pkill -f "tsc.*-w" 2>/dev/null || true

echo "✅ Emergency stop completed!"
echo ""
echo "Ports status:"
echo "Port 3000: $(lsof -ti :3000 2>/dev/null && echo 'Still in use' || echo 'Free')"
echo "Port 3001: $(lsof -ti :3001 2>/dev/null && echo 'Still in use' || echo 'Free')"
