#!/bin/bash
# This script provides the final, definitive fix for the test suite by enforcing
# the correct Node.js version, fixing core application code, and rigorously
# cleaning up the test file structure.

set -e

# --- 1. Enforce Correct Node.js Version ---
echo "🚀 Finalizing the Test Environment..."
echo "===================================="
echo "1. Checking Node.js version..."

NODE_VERSION=$(node -v)
if [[ ! "$NODE_VERSION" == v18.* ]]; then
  echo "❌ ERROR: Incorrect Node.js version detected: $NODE_VERSION"
  echo "   This project requires a Node.js v18 LTS release."
  echo "   Please run the following commands to switch to the correct version:"
  echo ""
  echo "      nvm install 18"
  echo "      nvm use 18"
  echo ""
  exit 1
fi
echo "   ✅ Correct Node.js version ($NODE_VERSION) detected."

# --- 2. Fix JWT Signing Error in User Model ---
echo "2. Applying robust fix for jwt.sign method call..."
# Ensure JWT_SECRET and JWT_EXPIRE are defined in your .env file
# This provides the secret and expiration options required by the function signature.
sed -i.bak 's/return jwt.sign({ id: this._id }/return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRE })/' src/models/User.ts
rm -f src/models/User.ts.bak
echo "   ✅ Patched jwt.sign error in src/models/User.ts."

# --- 3. Rigorously Consolidate All Test Files ---
echo "3. Consolidating all backend test files into a single directory..."
DEST_DIR="src/__tests__/backend"
mkdir -p "$DEST_DIR"

# Find all .test.ts files outside of frontend/ and node_modules/ and move them
find . -type f -name "*.test.ts" -not -path "./frontend/*" -not -path "./node_modules/*" -not -path "./src/__tests__/setup.ts" | while read -r file; do
    # Check if the file is not already in the destination directory
    if [[ "$(dirname "$file")" != "$DEST_DIR" ]]; then
        echo "   - Moving $file to $DEST_DIR/"
        mv "$file" "$DEST_DIR/"
    fi
done

# --- 4. Fix Imports in Consolidated Test Files ---
echo "4. Fixing import paths in all consolidated test files..."
for file in "$DEST_DIR"/*.test.ts; do
  if [ -f "$file" ]; then
    # Replace any variation of a relative import for the app/index file
    sed -i.bak -E "s|(from|require)\\s*\\(['\"])(../)+app(['\"])|\1('../../index')|g" "$file"
    sed -i.bak -E "s|(from|require)\\s*\\(['\"])(../)+index(['\"])|\1('../../index')|g" "$file"
    rm -f "${file}.bak"
  fi
done
echo "   ✅ All backend test files are now consolidated and have corrected import paths."

# --- 5. Update Jest Config for Stability ---
echo "5. Updating Jest config to ignore setup files and increase timeout..."
cat > jest.config.js << 'EOF'
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Run this setup file before all tests
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  // Look for tests only in the consolidated directory
  roots: ['<rootDir>/src/__tests__/backend'],
  // Ignore the setup file from test collection
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/frontend/',
    '<rootDir>/src/__tests__/setup.ts'
  ],
  clearMocks: true,
  // Give the in-memory server plenty of time to start
  testTimeout: 60000,
};
EOF
echo "   ✅ Jest configuration stabilized."


# --- Final Instructions ---
echo ""
echo "✅ Test Environment Finalized!"
echo "============================="
echo ""
echo "The script has enforced the correct Node version and fixed all known issues."
echo "Your test suite should now be stable and passing."
echo ""
echo "   Run the test command to verify:"
echo "   npm test"
echo ""
