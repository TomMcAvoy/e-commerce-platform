#!/bin/bash
# filepath: ./fix-all-tests.sh

# ==============================================================================
# This script performs a comprehensive fix on the entire backend test suite.
# It resolves two major issues:
#   1. Duplicate import declarations (mixing 'import' and 'require').
#   2. Incorrect relative paths for module imports.
# ==============================================================================

set -e

TEST_DIR="src/__tests__/backend"

echo "🚀 Starting comprehensive fix for the backend test suite..."

# --- 1. Check if the test directory exists ---
if [ ! -d "$TEST_DIR" ]; then
  echo "❌ Error: The test directory was not found at '$TEST_DIR'."
  exit 1
fi

# --- 2. Iterate over all test files to fix them ---
find "$TEST_DIR" -type f -name "*.test.ts" | while read -r file; do
  echo "   - Processing file: $file"

  # --- Step A: Remove all old/conflicting import styles for app and supertest ---
  # This creates a clean slate in each file.
  sed -i.bak -e "/require('supertest')/d" \
             -e "/require('..\/..\/index')/d" \
             -e "/import app from/d" \
             -e "/import request from/d" "$file"

  # --- Step B: Add the standardized ES Module imports to the top of the file ---
  # This ensures every test file has the correct, non-conflicting imports.
  sed -i.bak "1i\\
import request from 'supertest';\\
import app from '../../index';
" "$file"

  # --- Step C: Fix incorrect relative paths for project modules ---
  # This corrects paths like '../models' to '../../models'
  sed -i.bak -e "s|from '../models/|from '../../models/|g" \
             -e "s|from '../services/|from '../../services/|g" \
             -e "s|from '../types/|from '../../types/|g" \
             -e "s|from '../controllers/|from '../../controllers/|g" \
             -e "s|from '../utils/|from '../../utils/|g" \
             -e "s|from './config'|from '../../config'|g" \
             -e "s|from './types'|from '../../types'|g" \
             -e "s|from './DropshippingService'|from '../../services/dropshipping/DropshippingService'|g" "$file"

  # Clean up the backup file created by sed
  rm "${file}.bak"
done

echo ""
echo "✅ Success! All backend test files have been cleaned and corrected."
echo "------------------------------------------------------------------"
echo "The test suite should now be free of import and path errors."
echo "Please run the tests again."
echo ""
echo "   npm test"
echo ""
