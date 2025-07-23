#!/bin/bash

echo "🔧 Fixing critical TypeScript compilation errors..."
echo "=================================================="

# Fix AppError import case sensitivity
echo "📝 Fixing AppError import case consistency..."
sed -i 's|../utils/appError|../utils/AppError|g' src/controllers/authController.ts

# Remove duplicate getStatus declarations
echo "📝 Removing duplicate getStatus declarations..."
sed -i '/export const getStatus = (req: any, res: any)/d' src/controllers/authController.ts

# Create proper Express Request interface extension
echo "📝 Creating Express Request interface extension..."
cat > src/types/express.d.ts << 'EOF'
import { IUserDocument } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}
EOF

# Fix JWT signing configuration in User model
echo "📝 Fixing JWT signing configuration..."
cat > temp_user_jwt_fix.ts << 'EOF'
// Add proper JWT options type
import { SignOptions } from 'jsonwebtoken';

// Replace the getSignedJwtToken method with proper typing
UserSchema.methods.getSignedJwtToken = function(): string {
  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  };
  
  return jwt.sign(
    { id: this._id }, 
    process.env.JWT_SECRET as string, 
    options
  );
};
EOF

# Apply JWT fix to User model
sed -i '/return jwt.sign/,/});/c\
  const options: SignOptions = {\
    expiresIn: process.env.JWT_EXPIRE || '\''30d'\''\
  };\
  \
  return jwt.sign(\
    { id: this._id }, \
    process.env.JWT_SECRET as string, \
    options\
  );' src/models/User.ts

# Fix config test type issues
echo "📝 Fixing config test type issues..."
cat > src/utils/config.test.ts << 'EOF'
import { config } from './config';

describe('Config', () => {
  it('should have required environment variables', () => {
    expect(config).toBeDefined();
    expect(config.port).toBeDefined();
    expect(config.nodeEnv).toBeDefined();
  });

  it('should have database configuration', () => {
    expect(config.mongoUri).toBeDefined();
  });

  it('should have JWT configuration', () => {
    expect(config.jwtSecret).toBeDefined();
    expect(config.jwtExpire).toBeDefined();
  });

  it('should have proper environment setup', () => {
    expect(['development', 'production', 'test']).toContain(config.nodeEnv);
  });

  it('should have valid port number', () => {
    expect(typeof config.port).toBe('number');
    expect(config.port).toBeGreaterThan(0);
  });
});
EOF

# Fix dropshipping service test types
echo "📝 Fixing dropshipping service test types..."
sed -i 's/name: '\''Test Product'\''/\/\/ name: '\''Test Product'\'' \/\/ Remove name property/g' src/services/dropshipping/DropshippingService.test.ts
sed -i 's/name: '\''Test Product'\''/\/\/ name: '\''Test Product'\'' \/\/ Remove name property/g' src/__tests__/backend/DropshippingService.test.ts

# Add missing provider property to dropshipping mock products
sed -i '/category: '\''test'\''/a\
        provider: '\''printful'\'',' src/services/dropshipping/DropshippingService.test.ts

# Fix getAvailableProducts parameter type
sed -i 's/getAvailableProducts('\''printful'\'')/getAvailableProducts({ provider: '\''printful'\'' })/g' src/services/dropshipping/DropshippingService.test.ts

# Fix Jest configuration warning
echo "📝 Fixing Jest configuration..."
sed -i 's/moduleNameMapping/moduleNameMapper/g' jest.config.js

# Update package.json to include proper TypeScript imports
echo "📝 Ensuring @types/jsonwebtoken is installed..."
if ! npm list @types/jsonwebtoken >/dev/null 2>&1; then
  npm install --save-dev @types/jsonwebtoken
fi

# Fix authController Request type usage
echo "📝 Fixing authController Request type usage..."
sed -i 's/(req.user as IUserDocument)/req.user!/g' src/controllers/authController.ts

echo "=================================================="
echo "✅ Critical TypeScript errors have been fixed!"
echo "📋 Summary of changes:"
echo "   • Fixed AppError import case sensitivity"
echo "   • Removed duplicate getStatus declarations"
echo "   • Created Express Request interface extension"
echo "   • Fixed JWT signing configuration with proper types"
echo "   • Updated config tests to match actual config structure"
echo "   • Fixed dropshipping service test types"
echo "   • Fixed Jest configuration warning"
echo ""
echo "🧪 Run 'npm test' to verify all fixes work correctly."
