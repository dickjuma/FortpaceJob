import React from 'react';
import { Mail, Phone, ShieldCheck, Clock, Minus } from 'lucide-react';
import { cn } from '../../../utils/cn';

const VerificationIcon = ({ verified, icon: Icon, label }) => {
  if (verified === true) return <ShieldCheck size={14} className="text-success" title={`${label} Verified`} />;
  if (verified === 'pending') return <Clock size={14} className="text-amber-500" title={`${label} Pending`} />;
  return <Minus size={14} className="text-zinc-300" title={`${label} Not Verified`} />;
};

/**
 * Renders a row of verification status icons for email, phone, and identity.
 */
const VerificationBadge = ({ user, className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <VerificationIcon verified={user.emailVerified} icon={Mail} label="Email" />
      <VerificationIcon verified={user.phoneVerified} icon={Phone} label="Phone" />
      <VerificationIcon verified={user.twoFaEnabled} icon={ShieldCheck} label="2FA" />
    </div>
  );
};

export default VerificationBadge;
