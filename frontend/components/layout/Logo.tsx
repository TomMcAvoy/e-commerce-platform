import React from 'react';

/**
 * Logo Component for the site header.
 * Updated with correct "Whitestart System Security Inc" branding.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="420" // Increased width for longer name
      height="40"
      viewBox="0 0 420 40" // Adjusted viewBox
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="420" height="40" rx="8" fill="#1F2937" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="16" // Adjusted font size for better fit
        fontWeight="bold"
        fill="white"
      >
        Whitestart System Security Inc
      </text>
    </svg>
  );
}