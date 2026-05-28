import React from 'react';
import { ADMIN_ROLES } from '../../../config/users/userRoleConfig';
import { cn } from '../../../utils/cn';

/**
 * Renders an administrative role badge with its corresponding icon.
 */
const RoleBadge = ({ role, className }) => {
  const config = ADMIN_ROLES[role];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight",
      config.bg,
      config.color,
      className
    )}>
      <Icon size={12} strokeWidth={3} />
      {config.label}
    </span>
  );
};

export default RoleBadge;
