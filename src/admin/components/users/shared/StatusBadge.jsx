import React from 'react';
import { USER_STATUSES } from '../../../config/users/userRoleConfig';
import { cn } from '../../../utils/cn';

/**
 * Renders a semantic status pill for user accounts.
 */
const StatusBadge = ({ status, size = 'md', className }) => {
  const config = USER_STATUSES[status] || USER_STATUSES.inactive;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 font-bold uppercase tracking-widest rounded-full",
      size === 'sm' ? "px-2 py-0.5 text-[9px]" : "px-3 py-1 text-[10px]",
      config.bg,
      config.color,
      className
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
