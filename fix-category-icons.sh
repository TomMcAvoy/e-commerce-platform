// NEW FILE - Create automation script
#!/bin/bash

echo "🔧 Fixing CategoryIcon syntax errors..."

# Navigate to project root from scripts directory
cd "$(dirname "$0")/.."

# Create UI components directory if it doesn't exist
mkdir -p frontend/components/ui

# Remove JSX from icons utility (replace entire file)
cat > frontend/lib/icons.ts << 'EOF'
import {
  VideoCameraIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  FireIcon,
  KeyIcon,
  EyeIcon,
  ComputerDesktopIcon,
  SparklesIcon,
  HomeIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { ComponentType, SVGProps } from 'react';

type HeroIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export function getCategoryIcon(categoryName: string): HeroIconComponent {
  const name = categoryName.toLowerCase();
  
  if (name.includes('surveillance') || name.includes('camera')) {
    return VideoCameraIcon;
  }
  if (name.includes('access') || name.includes('control')) {
    return KeyIcon;
  }
  if (name.includes('alarm') || name.includes('security')) {
    return ExclamationTriangleIcon;
  }
  if (name.includes('fire') || name.includes('smoke')) {
    return FireIcon;
  }
  if (name.includes('monitor') || name.includes('watch')) {
    return EyeIcon;
  }
  if (name.includes('electronics') || name.includes('technology')) {
    return ComputerDesktopIcon;
  }
  if (name.includes('smart') || name.includes('home')) {
    return HomeIcon;
  }
  if (name.includes('fashion') || name.includes('apparel')) {
    return SparklesIcon;
  }
  if (name.includes('garden') || name.includes('home')) {
    return HomeIcon;
  }
  
  return ShieldCheckIcon;
}

export function getCategoryEmoji(categoryName: string): string {
  const name = categoryName.toLowerCase();
  
  if (name.includes('surveillance') || name.includes('camera')) return '📹';
  if (name.includes('access') || name.includes('control')) return '🔐';
  if (name.includes('alarm')) return '🚨';
  if (name.includes('security')) return '🛡️';
  if (name.includes('smart') || name.includes('home')) return '🏠';
  if (name.includes('electronics')) return '💻';
  if (name.includes('fashion')) return '👕';
  if (name.includes('garden') || name.includes('home')) return '🏡';
  if (name.includes('fire')) return '🔥';
  
  return '📦';
}

export function getCategoryColorScheme(categoryName: string) {
  const name = categoryName.toLowerCase();
  
  if (name.includes('security') || name.includes('surveillance')) {
    return { primary: '#1e40af', background: '#eff6ff', text: '#1e3a8a' };
  }
  if (name.includes('electronics') || name.includes('technology')) {
    return { primary: '#7c3aed', background: '#f5f3ff', text: '#5b21b6' };
  }
  if (name.includes('fashion') || name.includes('apparel')) {
    return { primary: '#ec4899', background: '#fdf2f8', text: '#be185d' };
  }
  if (name.includes('home') || name.includes('garden')) {
    return { primary: '#059669', background: '#ecfdf5', text: '#047857' };
  }
  
  return { primary: '#6b7280', background: '#f9fafb', text: '#374151' };
}
EOF

# Create CategoryIcon component (new file)
cat > frontend/components/ui/CategoryIcon.tsx << 'EOF'
'use client';

import { getCategoryIcon, getCategoryEmoji } from '@/lib/icons';

interface CategoryIconProps {
  categoryName: string;
  className?: string;
  variant?: 'icon' | 'emoji';
}

export function CategoryIcon({ 
  categoryName, 
  className = 'w-6 h-6',
  variant = 'icon' 
}: CategoryIconProps) {
  if (variant === 'emoji') {
    const emoji = getCategoryEmoji(categoryName);
    return <span className={className}>{emoji}</span>;
  }

  const IconComponent = getCategoryIcon(categoryName);
  return <IconComponent className={className} />;
}
EOF

echo "✅ Fixed frontend/lib/icons.ts (removed JSX)"
echo "✅ Created frontend/components/ui/CategoryIcon.tsx"
echo "🎯 Syntax errors resolved"
echo ""
echo "Next: Update CategoryCard.tsx to import CategoryIcon"

chmod +x scripts/fix-category-icons.sh
