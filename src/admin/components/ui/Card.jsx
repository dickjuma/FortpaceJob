import React from 'react';
import { cn } from '../../utils/cn';

const Card = ({ 
  children, 
  className, 
  hover = false, 
  padding = 'md',
  onClick 
}) => {
  const paddingMap = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        'bg-surface dark:bg-surface-dark-secondary border border-surface-border dark:border-surface-dark-border rounded-card shadow-card transition-all duration-200',
        paddingMap[padding],
        hover && 'hover:shadow-card-hover hover:-tranzinc-y-0.5 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
