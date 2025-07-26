#!/bin/bash
# filepath: ./fix-ts-imports.sh

# ==============================================================================
# This script fixes critical TypeScript compilation errors by enforcing
# consistent import paths and styles across the entire project.
#
# It resolves three main issues:
#   1. Inconsistent casing in 'AppError' imports (e.g., 'appError' vs. 'AppError').
#   2. Incorrect import style for the default-exported 'AppError' class.
#   3. Incorrect path for the 'errorHandler' middleware import in 'src/index.ts'.
# ==============================================================================

set -e

SRC_DIR="src"
echo "🚀 Scanning for TypeScript files in '$SRC_DIR' to enforce consistency..."

# --- 1. Find all TypeScript files and correct the imports ---
find "$SRC_DIR" -type f -name "*.ts" | while read -r file; do
  # Use a temporary variable to track if a change was made
  changed=false

  # --- Fix 1: Standardize 'AppError' path casing ---
  # Correct both relative paths ('../' and './') for both quote types
  if grep -q -E "from '(\.\/|\.\.\/)utils/appError'" "$file"; then
    echo "   - Fixing AppError path casing in: $file"
    sed -i.bak "s|from '\.\./utils/appError'|from '../utils/AppError'|g; s|from '\./utils/appError'|from './utils/AppError'|g" "$file"
    changed=true
  fi

  # --- Fix 2: Correct named import to default import for AppError ---
  if grep -q "import { AppError }" "$file"; then
    echo "   - Fixing AppError import style in: $file"
    sed -i.bak "s|import { AppError } from|import AppError from|g" "$file"
    changed=true
  fi

  # Clean up backup file if changes were made
  if [ "$changed" = true ]; then
    rm "${file}.bak"
  fi
done

# --- 3. Fix the specific errorMiddleware path in src/index.ts ---
INDEX_FILE="src/index.ts"
if [ -f "$INDEX_FILE" ] && grep -q "'./middleware/errorMiddleware'" "$INDEX_FILE"; then
  echo "   - Correcting errorHandler import path in: $INDEX_FILE"
  sed -i.bak "s|'./middleware/errorMiddleware'|'./middleware/errorHandler'|g" "$INDEX_FILE"
  rm "${INDEX_FILE}.bak"
fi

echo ""
echo "✅ Success! All TypeScript import inconsistencies have been resolved."
echo "--------------------------------------------------------------------"
echo "The compilation errors should now be gone. Please run the tests again."
echo ""
echo "   npm test"
echo ""
