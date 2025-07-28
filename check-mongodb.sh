#!/bin/bash

# Simple script to check if MongoDB is running
# Run this from a regular terminal, not from VS Code

echo "Checking if MongoDB is running..."

# Try mongosh first (newer MongoDB versions)
if command -v mongosh &> /dev/null; then
  echo "Using mongosh to check MongoDB..."
  mongosh --eval "db.adminCommand('ping')" &> /dev/null
  if [ $? -eq 0 ]; then
    echo "✅ MongoDB is running!"
    exit 0
  fi
fi

# Try mongo as fallback (older MongoDB versions)
if command -v mongo &> /dev/null; then
  echo "Using mongo to check MongoDB..."
  mongo --eval "db.adminCommand('ping')" &> /dev/null
  if [ $? -eq 0 ]; then
    echo "✅ MongoDB is running!"
    exit 0
  fi
fi

# If we get here, MongoDB is not running
echo "❌ MongoDB is not running or not accessible."
echo ""
echo "To start MongoDB on macOS, try:"
echo "  brew services start mongodb-community"
echo ""
echo "To start MongoDB on Linux, try:"
echo "  sudo systemctl start mongod"
echo ""
echo "To start MongoDB on Windows, start the MongoDB service from Services."
echo ""
echo "After starting MongoDB, run this script again to verify it's running."
exit 1