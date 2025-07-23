#!/bin/bash
# Emergency kill script for stuck processes

echo "💀 Emergency Process Killer"
echo "=========================="
echo "Killing all processes on ports 3000-3001..."

# Kill processes by port
echo "🔫 Killing processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No processes on port 3000"

echo "🔫 Killing processes on port 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "No processes on port 3001"

# Kill Node processes that might be hanging
echo "🔫 Killing hanging Node processes..."
pkill -f "node.*3000" 2>/dev/null || echo "No Node processes on port 3000"
pkill -f "next.*3001" 2>/dev/null || echo "No Next.js processes on port 3001"
pkill -f "nodemon" 2>/dev/null || echo "No nodemon processes"

echo "✅ Emergency kill completed!"
echo "You can now run: npm run dev:all"
