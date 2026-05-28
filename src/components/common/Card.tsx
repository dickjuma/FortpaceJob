// @ts-nocheck
import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  hover?: boolean;
  footer?: React.ReactNode;
}

export const Card = ({ className, title, hover, children, footer, ...props }: any) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white border border-border rounded-lg shadow-sm transition-all duration-200 flex flex-col',
          hover && 'hover:shadow-lg hover:-tranzinc-y-0.5',
          className
        )
      )}
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
      )}
      <div className="p-6 flex-1">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-border bg-gray-50 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
