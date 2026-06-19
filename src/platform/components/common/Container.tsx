// @ts-nocheck
import React from 'react';
import { cn } from './Button'; // Re-use the cn utility

export default function Container({ children, className }) {
  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
