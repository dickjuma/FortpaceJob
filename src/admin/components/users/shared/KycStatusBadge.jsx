import { ShieldCheck, ShieldAlert, ShieldX, ShieldQuestion } from 'lucide-react';
import { KYC_STATUSES } from '../../../config/users/userRoleConfig';
import { cn } from '../../../utils/cn';

/**
 * Renders the KYC verification status with semantic icons and colors.
 */
const KycStatusBadge = ({ status, className }) => {
  const config = KYC_STATUSES[status] || KYC_STATUSES.not_submitted;

  const getIcon = () => {
    switch (status) {
      case 'verified': return <ShieldCheck size={14} />;
      case 'pending': return <ShieldAlert size={14} />;
      case 'rejected': return <ShieldX size={14} />;
      default: return <ShieldQuestion size={14} />;
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest",
      config.bg,
      config.color,
      className
    )}>
      {getIcon()}
      {config.label}
    </span>
  );
};

export default KycStatusBadge;
