// src/components/icons/goldsmith-icon.tsx
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export const GoldsmithIcon = ({ className, ...props }: SVGProps<SVGSVGElement> & { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-gem", className)} // Default className, can be overridden
    {...props}
  >
    {/* Anvil-like shape */}
    <path d="M4 20h16" /> {/* Base of anvil */}
    <path d="M4 16h16" /> {/* Top surface of anvil */}
    {/* Hammer or tool shape */}
    <path d="M7 12c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.1-.36 2.1-.97 2.93-.61.83-1.43 1.52-2.4 1.97M17 8V4M7 8V4" />
    {/* Sparkle / Gem fragment */}
    <path d="m13.1 14.9-.5-1.5 1.4-1.4" />
    <path d="m12.5 17.4 1.4-1.4-.5-1.5" />
  </svg>
);
