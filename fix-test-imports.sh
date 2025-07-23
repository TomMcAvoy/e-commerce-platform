#!/bin/bash
# filepath: ./fix-test-imports.sh

# ==============================================================================
# This script fixes test suite failures by ensuring that all backend test
# files correctly import the Express 'app' instance from 'src/index.ts'.
# This version is compatible with both macOS (BSD) and Linux (GNU) sed.
# ==============================================================================

set -e

TEST_DIR="src/__tests__/backend"
APP_IMPORT_STATEMENT="import app from '../../index';"
REQUEST_IMPORT_STATEMENT="import request from 'supertest';"

echo "🚀 Standardizing imports in backend test files..."

# --- 1. Check if the test directory exists ---
if [ ! -d "$TEST_DIR" ]; then
  echo "❌ Error: The test directory was not found at '$TEST_DIR'."
  exit 1
fi

# --- 2. Find all TypeScript test files in the directory ---
find "$TEST_DIR" -type f -name "*.test.ts" | while read -r file; do
  echo "   - Checking file: $file"

  # --- Add 'import request from "supertest";' if it's missing ---
  if ! grep -qF "$REQUEST_IMPORT_STATEMENT" "$file"; then
    echo "     - Adding 'supertest' import..."
    # Use the 'i' (insert) command for better portability between sed versions.
    # The syntax "1i\\"$'\n'"TEXT" is robust for macOS.
    sed -i.bak "1i\\
$REQUEST_IMPORT_STATEMENT
" "$file"
    rm "${file}.bak"
  fi

  # --- Add 'import app from "../../index";' if it's missing ---
  if ! grep -qF "$APP_IMPORT_STATEMENT" "$file"; then
    echo "     - Adding 'app' import..."
    sed -i.bak "1i\\
$APP_IMPORT_STATEMENT
" "$file"
    rm "${file}.bak"
  fi
done

echo ""
echo "✅ Success! All backend test files have been updated with the correct imports."
echo "--------------------------------------------------------------------------"
echo "The test errors should now be resolved. Please run the tests again."
echo ""
echo "   npm test"
echo ""
