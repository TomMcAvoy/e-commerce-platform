import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <ShieldCheckIcon {...props} className={`text-blue-600 ${props.className || ''}`} />
);