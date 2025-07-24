#!/bin/bash
# filepath: fix-tailwind-postcss-corrected.sh

set -e

echo "🔧 Fixing Tailwind CSS PostCSS Configuration (Following Copilot Instructions)"
echo "Multi-vendor e-commerce platform - Debugging & Testing Ecosystem..."

cd frontend

# Fix 1: Install correct Tailwind CSS and PostCSS dependencies
echo "📦 Installing correct Tailwind CSS PostCSS dependencies..."
npm uninstall tailwindcss @tailwindcss/postcss
npm install tailwindcss@^3.4.0 autoprefixer@^10.4.21 postcss@^8.5.6

# Fix 2: Create PostCSS configuration file (this was missing)
echo "⚙️ Creating postcss.config.js..."
cat > postcss.config.js << 'POSTCSS_EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
POSTCSS_EOF

# Fix 3: Update Tailwind config to use stable v3 format
echo "🎨 Creating stable tailwind.config.js..."
cat > tailwind.config.js << 'TAILWIND_EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors following Copilot instructions
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        // Category-specific colors for landing pages
        mens: {
          50: '#f8fafc',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
        },
        sports: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        hardware: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        social: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        affiliate: {
          50: '#fdf4ff',
          500: '#c084fc',
          600: '#a855f7',
          700: '#9333ea',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-right': 'slideRight 0.8s ease-out',
      },
    },
  },
  plugins: [],
}
TAILWIND_EOF

# Fix 4: Update package.json with stable dependencies
echo "📝 Updating package.json with stable dependencies..."
cat > package.json << 'PACKAGE_EOF'
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
    "@headlessui/react": "^1.7.17",
    "@heroicons/react": "^2.0.18",
    "next": "^15.4.3",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "typescript": "^5.8.3"
  },
  "devDependencies": {
    "@types/node": "^24.1.0",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.0"
  }
}
PACKAGE_EOF

# Fix 5: Clear cache and reinstall
echo "🧹 Clearing cache and reinstalling dependencies..."
rm -rf node_modules .next package-lock.json
npm install

# Fix 6: Update globals.css with proper Tailwind directives
echo "🎨 Creating globals.css with proper Tailwind configuration..."
cat > app/globals.css << 'CSS_EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

/* Base layer following Copilot instructions */
@layer base {
  body {
    @apply bg-gray-50 text-gray-900 font-sans antialiased;
  }
}

/* Component layer following architecture patterns */
@layer components {
  .container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  /* Button variants following UI patterns */
  .btn {
    @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50;
  }

  .btn-primary {
    @apply btn bg-brand-500 text-white hover:bg-brand-600 px-4 py-2;
  }

  .btn-secondary {
    @apply btn bg-sports-500 text-white hover:bg-sports-600 px-4 py-2;
  }

  .btn-outline {
    @apply btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2;
  }

  /* Card styles following component patterns */
  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }

  .card-header {
    @apply border-b border-gray-200 pb-4 mb-4;
  }

  .card-title {
    @apply text-lg font-semibold text-gray-900;
  }

  /* Landing page components following project conventions */
  .hero-section {
    @apply relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 overflow-hidden;
  }

  .hero-content {
    @apply text-center z-10 max-w-4xl mx-auto px-6;
  }

  .hero-title {
    @apply text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 mb-6;
  }

  .hero-subtitle {
    @apply text-lg md:text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto;
  }

  .cta-button {
    @apply inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300;
  }

  .category-card {
    @apply group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500;
  }

  .category-card-content {
    @apply absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white;
  }

  .product-grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
  }

  .product-card {
    @apply bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden;
  }

  /* Affiliate sidebar following project-specific conventions */
  .affiliate-sidebar {
    @apply fixed right-4 top-20 w-80 h-[calc(100vh-6rem)] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-40;
  }

  .affiliate-item {
    @apply flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer;
  }

  /* Debug dashboard following debugging ecosystem patterns */
  .debug-container {
    @apply container mx-auto px-4 py-8;
  }

  .debug-card {
    @apply card hover:shadow-md transition-shadow;
  }

  .debug-grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
  }

  .debug-status {
    @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium;
  }

  .debug-status-success {
    @apply debug-status bg-green-50 text-green-700;
  }

  .debug-status-error {
    @apply debug-status bg-red-50 text-red-700;
  }

  .debug-status-warning {
    @apply debug-status bg-yellow-50 text-yellow-700;
  }

  /* Form styles following authentication patterns */
  .form-input {
    @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm;
  }

  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }
}

/* Custom animations following architecture patterns */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideRight {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Loading spinner following UI patterns */
.spinner {
  @apply animate-spin rounded-full border-2 border-gray-300 border-t-brand-500;
}

/* Utility classes following project conventions */
@layer utilities {
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  
  .bg-blur {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.9);
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-600;
}
CSS_EOF

cd ..

# Fix 7: Update root package.json to ensure proper dev:frontend script
echo "📝 Updating root package.json following server management patterns..."
if [ -f "package.json" ]; then
    node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        // Following Critical Development Workflows from Copilot instructions
        pkg.scripts = pkg.scripts || {};
        pkg.scripts['dev:frontend'] = 'echo \\'🎨  Starting frontend server on port 3001...\\' && cd frontend && npm run dev';
        
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
        console.log('✅ Updated root package.json with proper dev:frontend script');
    "
fi

echo ""
echo "🎉 Tailwind CSS PostCSS Configuration Fixed!"
echo ""
echo "📋 Following Copilot Instructions - Changes Applied:"
echo "1. ✅ Installed stable Tailwind CSS v3.4.0 with PostCSS"
echo "2. ✅ Created missing postcss.config.js file"
echo "3. ✅ Updated tailwind.config.js with category-specific colors"
echo "4. ✅ Fixed package.json with stable dependency versions"
echo "5. ✅ Created globals.css following architecture patterns"
echo "6. ✅ Cleared cache and reinstalled dependencies"
echo "7. ✅ Updated root scripts following server management patterns"
echo ""
echo "🚀 Your Debugging & Testing Ecosystem is ready:"
echo "• Primary Debug Dashboard: http://localhost:3001/debug"
echo "• Static Debug Page: http://localhost:3001/debug-api.html"
echo "• API Health Endpoints: http://localhost:3000/health"
echo "• Backend API Status: http://localhost:3000/api/status"
echo ""
echo "🎯 Critical Development Workflows:"
echo "• Quick start: npm run dev:all"
echo "• Emergency stop: npm run kill"
echo "• Test DropshippingService: npm test"
echo ""
echo "✅ PostCSS configuration issue resolved - ready for multi-vendor platform!"
