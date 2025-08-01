#!/bin/bash

# Kill existing servers
echo "Stopping existing servers..."
pkill -f "pnpm run dev:server"
pkill -f "pnpm run dev"
pkill -f "npm run dev:server"
pkill -f "npm run dev"
pkill -f "node.*3000"
pkill -f "next.*3001"
sleep 2

# Start backend server
echo "Starting backend server..."
nohup pnpm run dev:server > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 8

# Start frontend server
echo "Starting frontend server..."
cd frontend
nohup pnpm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
echo "Waiting for frontend to start..."
sleep 8

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Servers started. Check logs:"
echo "  Backend: tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""

# Test if servers are running
echo "Testing servers..."
echo -n "Backend (http://localhost:3000): "
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ OK"
else
    echo "❌ FAILED"
    echo "Backend logs:"
    tail -10 backend.log
fi

echo -n "Frontend (http://localhost:3001): "
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ OK"
else
    echo "❌ FAILED"
    echo "Frontend logs:"
    tail -10 frontend.log
fi

echo ""
echo "🚀 Servers are running!"
echo "   Frontend: http://localhost:3001"
echo "   Backend:  http://localhost:3000"
echo "   Debug:    http://localhost:3001/debug"