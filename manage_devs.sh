#!/bin/bash
# filepath: ./manage_devs.sh

# ==============================================================================
# Development Environment Management Script for E-commerce Platform
# ==============================================================================
#
# This script provides a centralized command interface for managing the
# development lifecycle of the multi-vendor e-commerce platform.
#
# Usage:
#   ./manage_devs.sh [command]
#   ./manage_devs.sh test backend
#
# To make this script executable, run:
#   chmod +x manage_devs.sh
#
# ==============================================================================

# --- Configuration ---
# Exit immediately if a command exits with a non-zero status.
set -e

# --- Helper Functions ---
# Function to display usage information
usage() {
  echo "🚀 E-commerce Platform Development Manager"
  echo "-------------------------------------------"
  echo "Usage: $0 {setup|start|stop|restart|test|db|status}"
  echo ""
  echo "Commands:"
  echo "  setup                - Installs all dependencies for backend and frontend."
  echo "  start                - Starts both backend and frontend development servers."
  echo "  stop                 - Stops all running development servers."
  echo "  restart              - Restarts all development servers."
  echo "  test [target]        - Runs tests. Targets: all, backend, frontend, e2e, api."
  echo "  db [action]          - Manages database. Actions: seed, reset, clean."
  echo "  status               - Checks the health of running services."
  echo ""
  exit 1
}

# --- Command Definitions ---

# Setup command
run_setup() {
  echo "⚙️  Running initial project setup..."
  npm run setup
  echo "✅ Setup complete. Dependencies are installed."
}

# Start command
run_start() {
  echo "🚀 Starting all services (Backend & Frontend)..."
  npm run dev:all
}

# Stop command
run_stop() {
  echo "🛑 Stopping all services..."
  npm run kill
  echo "✅ Services stopped."
}

# Restart command
run_restart() {
  echo "🔄 Restarting all services..."
  run_stop
  sleep 2 # Give ports time to free up
  run_start
}

# Test command
run_test() {
  case "$1" in
    backend)
      echo "🧪 Running backend tests..."
      npm run test:backend
      ;;
    frontend)
      echo "🧪 Running frontend tests..."
      npm run test:frontend
      ;;
    e2e)
      echo "🧪 Running end-to-end tests..."
      npm run test:e2e
      ;;
    api)
      echo "🧪 Running API health tests..."
      npm run test:api
      ;;
    all|"")
      echo "🧪 Running all backend and frontend tests..."
      npm run test
      ;;
    *)
      echo "❌ Error: Unknown test target '$1'."
      usage
      ;;
  esac
  echo "✅ Testing complete."
}

# Database command
run_db() {
  case "$1" in
    seed)
      echo "🌱 Seeding database..."
      npm run seed
      ;;
    reset)
      echo "🔄 Resetting database (clean + seed)..."
      npm run db:reset
      ;;
    clean)
      echo "🧹 Cleaning (wiping) the database..."
      npm run db:clean
      ;;
    *)
      echo "❌ Error: Unknown db action '$1'."
      usage
      ;;
  esac
  echo "✅ Database operation complete."
}

# Status command
run_status() {
    echo "🩺 Checking service status..."
    npm run test:api || echo "🔴 API health check failed. Is the server running?"
}


# --- Main Script Logic ---
COMMAND=$1
SUB_COMMAND=$2

# Display usage if no command is provided
if [ -z "$COMMAND" ]; then
  usage
fi

# Case statement to route to the correct function
case "$COMMAND" in
  setup)
    run_setup
    ;;
  start)
    run_start
    ;;
  stop)
    run_stop
    ;;
  restart)
    run_restart
    ;;
  test)
    run_test "$SUB_COMMAND"
    ;;
  db)
    run_db "$SUB_COMMAND"
    ;;
  status)
    run_status
    ;;
  *)
    echo "❌ Error: Unknown command '$COMMAND'"
    usage
    ;;
esac

exit 0
