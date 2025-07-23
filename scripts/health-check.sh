#!/bin/bash
# Health check script following copilot debug ecosystem patterns

echo "🔍 E-Commerce Platform Health Check"
echo "=================================="

# Check if servers are running
echo "Checking backend server (port 3000)..."
if curl -f -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend server is healthy"
else
    echo "❌ Backend server is not responding"
fi

echo "Checking frontend server (port 3001)..."
if curl -f -s http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ Frontend server is healthy"
else
    echo "❌ Frontend server is not responding"
fi

# Check API endpoints
echo "Checking API status..."
if curl -f -s http://localhost:3000/api/status > /dev/null 2>&1; then
    echo "✅ API endpoints are responding"
else
    echo "❌ API endpoints are not responding"
fi

# Check debug dashboards
echo "Checking debug dashboards..."
if curl -f -s http://localhost:3001/debug > /dev/null 2>&1; then
    echo "✅ Debug dashboard is accessible"
else
    echo "⚠️  Debug dashboard may not be implemented yet"
fi

echo ""
echo "🔗 Debug Resources:"
echo "Primary Debug: http://localhost:3001/debug"
echo "Static Debug:  http://localhost:3001/debug-api.html"
echo "API Health:    http://localhost:3000/health"
echo "API Status:    http://localhost:3000/api/status"
