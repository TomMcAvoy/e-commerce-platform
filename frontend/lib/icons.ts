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