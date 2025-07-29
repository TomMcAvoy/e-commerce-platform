#!/bin/bash

# Kill existing servers
pkill -f "npm run dev:server"
pkill -f "npm run dev"

# Start backend server
echo "Starting backend server..."
nohup npm run dev:server > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend server
echo "Starting frontend server..."
cd frontend
nohup npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 5

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Servers started. Check logs:"
echo "  Backend: tail -f backend.log"
echo "  Frontend: tail -f frontend.log"

# Test if servers are running
echo "Testing servers..."
curl -s http://localhost:3000/health && echo " - Backend OK"
curl -s http://localhost:3001 > /dev/null && echo " - Frontend OK"