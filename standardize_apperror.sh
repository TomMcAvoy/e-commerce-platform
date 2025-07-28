#!/bin/bash

# This script finds all .ts files in the src/ directory and corrects
# various incorrect import statements for the AppError class.
# It uses the `sed -i ''` syntax, which is required for in-place editing on macOS.

echo "Searching for TypeScript files and standardizing AppError imports..."

# Use a `while` loop to process each file found by `find`
find src -name "*.ts" | while read file; do
  # --- Stage 1: Fix imports from incorrect locations (like middleware) ---
  # Replace imports from `errorHandler` middleware (2 levels deep)
  sed -i '' "s|import { AppError } from '../../middleware/errorHandler'|import AppError from '../../utils/AppError'|g" "$file"
  # Replace imports from `errorHandler` middleware (1 level deep)
  sed -i '' "s|import { AppError } from '../middleware/errorHandler'|import AppError from '../utils/AppError'|g" "$file"

  # --- Stage 2: Fix incorrect casing in the path ---
  # Correct `appError` to `AppError` in the path (2 levels deep)
  sed -i '' "s|from '../../utils/appError'|from '../../utils/AppError'|g" "$file"
  # Correct `appError` to `AppError` in the path (1 level deep)
  sed -i '' "s|from '../utils/appError'|from '../utils/AppError'|g" "$file"

  # --- Stage 3: Fix incorrect import type (named vs. default) ---
  # Change named import { AppError } to default import AppError
  sed -i '' "s|import { AppError } from '\(.*\)/utils/AppError'|import AppError from '\1/utils/AppError'|g" "$file"
  sed -i '' "s|import { AppError } from '\(.*\)/AppError'|import AppError from '\1/AppError'|g" "$file"
done

echo "✅ Done. All found AppError imports have been standardized for the project."
