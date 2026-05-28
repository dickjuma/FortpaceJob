import React from 'react';

export default function Card({
  title,
  children,
  footer,
  hover = false,
  className = '',
}) {
  return (
    <div 
      className={`bg-white border border-border rounded-lg shadow-sm ${hover ? 'transition-shadow hover:shadow-lg' : ''} ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-border bg-light-gray/50 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
}
