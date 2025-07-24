#!/usr/bin/env bash
#
# fix_project_errors.sh
#
# This script applies critical fixes to the project, following best practices
# for macOS compatibility and script robustness.

# --- Unofficial Bash Strict Mode ---
# -e: exit on first error
# -u: exit on unset variables
# -o pipefail: exit on pipeline failure
set -euo pipefail

# --- Main Logic ---

# Function to safely run sed on macOS for in-place edits.
# Arg1: The sed expression (e.g., 's/foo/bar/g')
# Arg2: The file to modify
safe_sed() {
  local expression="$1"
  local file_path="$2"
  
  # The -i '' is the critical part for macOS compatibility.
  sed -i '' "${expression}" "${file_path}"
}

# Function to fix the password method name in the auth controller.
fix_auth_controller() {
  local target_file="src/controllers/authController.ts"
  local old_method="user.matchPassword(password)"
  local new_method="user.comparePassword(password)"

  echo "➡️  Checking auth controller..."
  if grep -q "${old_method}" "${target_file}"; then
    # Note the quoting on all variables
    safe_sed "s/${old_method}/${new_method}/" "${target_file}"
    echo "✅ Fixed password method in ${target_file}"
  else
    echo "ℹ️  Password method in ${target_file} is already correct. Skipping."
  fi
}

# Function to fix the test data in the dropshipping service test.
fix_dropshipping_test() {
  local target_file="src/__tests__/backend/DropshippingService.test.ts"
  local search_pattern="shippingAddress: { address1: '123 Main St'"
  local replacement="shippingAddress: { firstName: 'Test', lastName: 'User', address1: '123 Main St'"

  echo "➡️  Checking dropshipping test data..."
  if grep -q "${search_pattern}" "${target_file}"; then
    safe_sed "s|${search_pattern}|${replacement}|" "${target_file}"
    echo "✅ Added missing firstName/lastName to ${target_file}"
  else
    echo "ℹ️  Dropshipping test data appears correct. Skipping."
  fi
}


# --- Script Execution ---

echo "🚀 Starting automated fix process..."
echo "------------------------------------"

fix_auth_controller
fix_dropshipping_test

echo "------------------------------------"
echo "🎉 All fixes applied successfully. Please run 'npm test' again."

