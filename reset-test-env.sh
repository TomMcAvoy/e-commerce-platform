#!/bin/bash
# This script performs a complete reset of the backend test environment by
# consolidating all test files, fixing their imports, correcting critical
# code errors, and stabilizing the Jest configuration.

set -e

echo "🚀 Resetting and Rebuilding Test Environment..."
echo "=============================================="

# --- 1. Consolidate All Backend Test Files ---
echo "1. Consolidating all scattered test files..."
DEST_DIR="src/__tests__/backend"
mkdir -p "$DEST_DIR"

# Find all .test.ts files outside of frontend/ and node_modules/ and move them
# This will grab files from src/, shoppingcart/src/, whitestartups-shopping-online/src/, etc.
find . -type f -name "*.test.ts" -not -path "./frontend/*" -not -path "./node_modules/*" -not -path "./src/__tests__/setup.ts" | while read -r file; do
    # Check if the file is not already in the destination directory to avoid errors
    if [[ "$(dirname "$file")" != *"$DEST_DIR"* ]]; then
        echo "   - Moving $file to $DEST_DIR/"
        # Use a unique name in case of duplicates, then move
        new_name=$(basename "$file")
        if [ -f "$DEST_DIR/$new_name" ]; then
            new_name="${RANDOM}-${new_name}" # Avoid overwriting
        fi
        mv "$file" "$DEST_DIR/$new_name"
    fi
done
echo "   ✅ All backend test files moved to $DEST_DIR."


# --- 2. Fix Imports in ALL Consolidated Test Files ---
echo "2. Fixing import paths in all consolidated test files..."
for file in "$DEST_DIR"/*.test.ts; do
  if [ -f "$file" ]; then
    # Replace any variation of a relative import for the app/index file with the correct one.
    # This covers ../app, ../../app, ../index, ../../index etc.
    sed -i.bak -E "s|(from|require)\\s*\\(['\"])(../)+(app|index)(['\"])|\1('../../index')|g" "$file"
    rm -f "${file}.bak"
  fi
done
echo "   ✅ Import paths corrected."


# --- 3. Fix the User Model's JWT Function ---
echo "3. Replacing broken JWT function in User model..."
# This replaces the entire broken function with a correct one.
cat > src/models/User.ts << 'EOF'
// filepath: src/models/User.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  role: {
    type: String,
    enum: ['user', 'vendor', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function (): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);
EOF
echo "   ✅ User model fixed."


# --- 4. Stabilize Jest Configuration ---
echo "4. Updating Jest config to use new structure and increase timeout..."
cat > jest.config.js << 'EOF'
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  // IMPORTANT: Only look for tests in the new consolidated directory
  roots: ['<rootDir>/src/__tests__/backend'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/frontend/',
    '<rootDir>/src/__tests__/setup.ts'
  ],
  clearMocks: true,
  // Increase timeout to 60 seconds to prevent mongo-memory-server from failing
  testTimeout: 60000,
};
EOF
echo "   ✅ Jest configuration stabilized."


# --- Final Instructions ---
echo ""
echo "✅ Test Environment Reset Complete!"
echo "=================================="
echo ""
echo "The test environment has been rebuilt from the ground up."
echo "This should resolve all structural and configuration errors."
echo ""
echo "   Run the test command to verify:"
echo "   npm test"
echo ""
