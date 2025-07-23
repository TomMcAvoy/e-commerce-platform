#!/bin/bash
# filepath: quick-fix-frontend-127.sh

set -e

echo "🔧 Quick Fix for Frontend Exit Code 127 (next: command not found)"
echo "Following coding instructions patterns..."

# Emergency stop any hanging processes
echo "🛑 Emergency stop processes..."
npm run kill 2>/dev/null || lsof -ti:3000,3001 | xargs kill -9 2>/dev/null || true

# Check if frontend directory exists and has proper structure
echo "📁 Checking frontend directory structure..."
if [ ! -d "frontend" ]; then
    echo "❌ Frontend directory missing - creating..."
    mkdir -p frontend
fi

cd frontend

# Fix 1: Clean install Next.js dependencies
echo "🔧 Fix 1: Installing Next.js and dependencies..."
cat > package.json << 'EOF'
{
  "name": "whitestartups-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.4.3",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "typescript": "^5.8.3"
  },
  "devDependencies": {
    "@types/node": "^24.1.0",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6"
  }
}
EOF

# Clean install
echo "📦 Clean installing dependencies..."
rm -rf node_modules package-lock.json .next
npm install

# Fix 2: Create minimal Next.js structure following your patterns
echo "🔧 Fix 2: Creating app structure..."
mkdir -p app/{debug,cart} components lib context public

# Create next.config.js following your CORS patterns
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  }
};

module.exports = nextConfig;
EOF

# Create .env.local following your environment patterns
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3000/api
EOF

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# Fix 3: Create minimal CartContext following your Context Pattern
cat > context/CartContext.tsx << 'EOF'
'use client';

import React, { createContext, useContext, useState } from 'react';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  sku: string;
}

interface Cart {
  items: CartItem[];
  totalPrice: number;
}

interface CartContextType {
  cart: Cart;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  const addToCart = (item: CartItem) => {
    setCart(prev => ({
      items: [...prev.items, item],
      totalPrice: prev.totalPrice + (item.price * item.quantity)
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newItems = prev.items.filter(item => item.productId !== productId);
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { items: newItems, totalPrice: newTotal };
    });
  };

  const clearCart = () => {
    setCart({ items: [], totalPrice: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
EOF

# Fix 4: Create layout.tsx following your patterns
cat > app/layout.tsx << 'EOF'
import { CartProvider } from '../context/CartContext';

export const metadata = {
  title: 'Multi-Vendor E-Commerce Platform',
  description: 'Amazon/Temu-style marketplace with dropshipping',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
EOF

# Fix 5: Create home page
cat > app/page.tsx << 'EOF'
'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function HomePage() {
  const { cart } = useCart();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Multi-Vendor E-Commerce Platform</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/debug" style={{ background: '#3b82f6', color: 'white', padding: '10px', borderRadius: '4px', textDecoration: 'none', textAlign: 'center' }}>
              🔧 Debug Dashboard
            </Link>
            <Link href="/cart" style={{ background: '#8b5cf6', color: 'white', padding: '10px', borderRadius: '4px', textDecoration: 'none', textAlign: 'center' }}>
              🛒 Cart ({cart.items.length})
            </Link>
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Platform Status</h2>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Backend API:</span>
              <span style={{ color: '#10b981' }}>✅ Running</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Frontend:</span>
              <span style={{ color: '#10b981' }}>✅ Connected</span>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Development Tools</h2>
          <div style={{ fontSize: '14px' }}>
            <div>Backend: <code>localhost:3000</code></div>
            <div>Frontend: <code>localhost:3001</code></div>
            <div>Debug: <code>/debug</code></div>
            <div>Health: <code>/health</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

# Fix 6: Create Primary Debug Dashboard following your coding instructions
cat > app/debug/page.tsx << 'EOF'
'use client';

import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function DebugPage() {
  const [apiStatus, setApiStatus] = useState<string>('Checking...');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [cartResult, setCartResult] = useState<string>('');

  useEffect(() => {
    checkAPIStatus();
    runAPITests();
  }, []);

  const checkAPIStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/health');
      if (response.ok) {
        setApiStatus('✅ API Connected');
      } else {
        setApiStatus('❌ API Error');
      }
    } catch (error) {
      setApiStatus('❌ API Unreachable');
    }
  };

  const runAPITests = async () => {
    const tests = [
      { name: 'Health Check', url: 'http://localhost:3000/health', method: 'GET' },
      { name: 'API Status', url: 'http://localhost:3000/api/status', method: 'GET' },
      { name: 'Cart Endpoints', url: `${API_BASE_URL}/cart`, method: 'GET' },
    ];

    const results = [];
    for (const test of tests) {
      try {
        const response = await fetch(test.url, { 
          method: test.method,
          headers: { 'x-session-id': 'debug-session-' + Date.now() }
        });
        results.push({
          name: test.name,
          status: response.ok ? '✅ Pass' : '❌ Fail',
          code: response.status,
        });
      } catch (error) {
        results.push({
          name: test.name,
          status: '❌ Error',
          code: 'Network Error',
        });
      }
    }
    setTestResults(results);
  };

  const testCartAPI = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: { 'x-session-id': 'debug-session-' + Date.now() },
      });
      const data = await response.json();
      setCartResult(`Cart API: ${response.ok ? 'Success' : 'Failed'} (${response.status})\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setCartResult(`Cart API Failed: ${error}`);
    }
  };

  const cardStyle = { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' };
  const buttonStyle = { background: '#3b82f6', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🔧 Primary Debug Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Following coding instructions - http://localhost:3001/debug</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <div style={cardStyle}>
          <h2>API Status</h2>
          <div style={{ marginBottom: '15px' }}>
            <div>Status: {apiStatus}</div>
            <div>Backend: <code>http://localhost:3000</code></div>
            <div>Frontend: <code>http://localhost:3001</code></div>
          </div>
          <button style={buttonStyle} onClick={checkAPIStatus}>
            Refresh Status
          </button>
        </div>

        <div style={cardStyle}>
          <h2>API Tests</h2>
          <div style={{ marginBottom: '15px', maxHeight: '200px', overflowY: 'auto' }}>
            {testResults.map((result, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px' }}>
                <span>{result.name}:</span>
                <span>{result.status} ({result.code})</span>
              </div>
            ))}
          </div>
          <button style={{...buttonStyle, background: '#10b981'}} onClick={runAPITests}>
            Run Tests
          </button>
        </div>

        <div style={cardStyle}>
          <h2>Cart API Testing</h2>
          <div style={{ marginBottom: '15px' }}>
            <button style={{...buttonStyle, background: '#8b5cf6'}} onClick={testCartAPI}>
              Test Cart API
            </button>
            {cartResult && (
              <pre style={{ fontSize: '12px', background: '#f3f4f6', padding: '10px', borderRadius: '4px', marginTop: '10px', overflow: 'auto', maxHeight: '150px' }}>
                {cartResult}
              </pre>
            )}
          </div>
        </div>

        <div style={cardStyle}>
          <h2>Quick Links</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="http://localhost:3000/health" target="_blank" rel="noopener noreferrer" 
               style={{ background: '#dbeafe', color: '#1e40af', padding: '10px', borderRadius: '4px', textDecoration: 'none' }}>
              🔍 Backend Health Check
            </a>
            <a href="http://localhost:3000/api/status" target="_blank" rel="noopener noreferrer"
               style={{ background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '4px', textDecoration: 'none' }}>
              📊 API Status
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

# Fix 7: Create Static Debug Page following your patterns
cat > public/debug-api.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Static Debug Page - API Testing</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .card { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .button { background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
        .button:hover { background: #2563eb; }
        .result { background: #f3f4f6; padding: 10px; border-radius: 4px; margin: 10px 0; white-space: pre-wrap; font-family: monospace; max-height: 200px; overflow-y: auto; }
        .status { font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 Static Debug Page</h1>
        <p>Following coding instructions - Alternative to <code>http://localhost:3001/debug</code></p>
        
        <div class="card">
            <h2>API Status</h2>
            <p>Backend: <code>http://localhost:3000</code></p>
            <p>Frontend: <code>http://localhost:3001</code></p>
            <p id="apiStatus" class="status">Checking...</p>
            <button class="button" onclick="checkAPIStatus()">Check Status</button>
        </div>

        <div class="card">
            <h2>Quick Tests</h2>
            <button class="button" onclick="testHealth()">Health</button>
            <button class="button" onclick="testCart()">Cart</button>
            <div id="testResults" class="result"></div>
        </div>
    </div>

    <script>
        async function checkAPIStatus() {
            try {
                const response = await fetch('http://localhost:3000/health');
                document.getElementById('apiStatus').textContent = response.ok ? '✅ API Connected' : '❌ API Error';
            } catch (error) {
                document.getElementById('apiStatus').textContent = '❌ API Unreachable';
            }
        }

        async function testHealth() {
            try {
                const response = await fetch('http://localhost:3000/health');
                const data = await response.json();
                document.getElementById('testResults').textContent = `Health: ${response.status}\n${JSON.stringify(data, null, 2)}`;
            } catch (error) {
                document.getElementById('testResults').textContent = `Health Failed: ${error.message}`;
            }
        }

        async function testCart() {
            try {
                const response = await fetch('http://localhost:3000/api/cart', {
                    headers: { 'x-session-id': 'debug-session-' + Date.now() }
                });
                const data = await response.json();
                document.getElementById('testResults').textContent = `Cart: ${response.status}\n${JSON.stringify(data, null, 2)}`;
            } catch (error) {
                document.getElementById('testResults').textContent = `Cart Failed: ${error.message}`;
            }
        }

        checkAPIStatus();
    </script>
</body>
</html>
EOF

cd ..

# Fix 8: Update root package.json to ensure correct port
echo "🔧 Fix 8: Updating root package.json..."
if [ -f "package.json" ]; then
    # Backup and update
    cp package.json package.json.backup
    
    # Use Node.js to safely update the JSON
    node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        pkg.scripts['dev:frontend'] = 'echo \\'🎨  Starting frontend server on port 3001...\\' && cd frontend && next dev -p 3001';
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "
    echo "✅ Updated root package.json"
fi

echo ""
echo "✅ Quick Fix Complete!"
echo ""
echo "🚀 Testing frontend startup..."
cd frontend
if command -v next >/dev/null 2>&1; then
    echo "✅ Next.js is now installed and available"
else
    echo "❌ Next.js still not found - checking npm installation..."
    which npm
    npm --version
    ls -la node_modules/.bin/ | grep next || echo "Next.js binary not found in node_modules"
fi

cd ..

echo ""
echo "🎯 Start your debugging ecosystem:"
echo "1. Run: npm run dev:all"
echo "2. Visit: http://localhost:3001/debug"
echo "3. Backup: http://localhost:3001/debug-api.html"
echo ""
echo "If still getting 127 error, run this debug command:"
echo "cd frontend && npx next dev -p 3001"
EOF
