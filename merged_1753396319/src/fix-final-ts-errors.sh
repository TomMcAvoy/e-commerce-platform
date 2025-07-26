#!/bin/bash
# filepath: ./fix-final-ts-errors.sh

# ==============================================================================
# This script performs a comprehensive fix for persistent TypeScript errors.
#
# It resolves four main issues:
#   1. Renames 'src/utils/appError.ts' to 'src/utils/AppError.ts' if it exists.
#   2. Fixes all inconsistent import paths related to 'AppError'.
#   3. Corrects the import style for the default-exported 'AppError' class.
#   4. Fixes the incorrect path for the 'errorHandler' middleware.
# ==============================================================================

set -e

SRC_DIR="src"

echo "🚀 Starting comprehensive TypeScript consistency fix..."

# --- 1. Fix the root cause: Rename the file if it has the wrong casing ---
LOWERCASE_FILE="src/utils/appError.ts"
UPPERCASE_FILE="src/utils/AppError.ts"

if [ -f "$LOWERCASE_FILE" ]; then
    echo "   - Found file with incorrect casing: '$LOWERCASE_FILE'."
    # Use git mv for a case-sensitive rename that works on macOS/Windows
    git mv "$LOWERCASE_FILE" "$UPPERCASE_FILE"
    echo "   - Renamed to '$UPPERCASE_FILE' using git."
elif [ ! -f "$UPPERCASE_FILE" ]; then
    echo "   - WARNING: Could not find AppError.ts. Skipping rename."
fi


# --- 2. Find all TypeScript files and correct all import statements ---
echo "   - Scanning all .ts files to standardize imports..."
find "$SRC_DIR" -type f -name "*.ts" | while read -r file; do
    # Create a backup for safety
    cp "$file" "${file}.bak"

    # Fix #1: Correct path casing (appError -> AppError)
    sed -i '' "s|'../utils/appError'|'../utils/AppError'|g" "$file"
    sed -i '' "s|'./utils/appError'|'./utils/AppError'|g" "$file"

    # Fix #2: Correct import style (named -> default)
    sed -i '' "s|import { AppError } from|import AppError from|g" "$file"

    # Clean up the backup file
    rm "${file}.bak"
done

# --- 3. Fix the specific errorMiddleware path in src/index.ts ---
INDEX_FILE="src/index.ts"
if [ -f "$INDEX_FILE" ]; then
  if grep -q "'./middleware/errorMiddleware'" "$INDEX_FILE"; then
    echo "   - Correcting errorHandler import path in: $INDEX_FILE"
    sed -i '' "s|'./middleware/errorMiddleware'|'./middleware/errorHandler'|g" "$INDEX_FILE"
  fi
fi

echo ""
echo "✅ Success! All TypeScript errors should now be resolved."
echo "----------------------------------------------------------"
echo "Please run the tests again."
echo ""
echo "   npm test"
echo ""
