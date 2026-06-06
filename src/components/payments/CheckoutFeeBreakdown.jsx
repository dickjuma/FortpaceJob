import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useCheckoutFees } from '../../common/hooks/useCheckoutFees';

function formatKes(value) {
  return `KES ${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

/**
 * Shows Forte Vault fee split: client pays subtotal → escrow; provider receives net after platform %.
 */
export default function CheckoutFeeBreakdown({
  subtotal,
  appliesTo = 'ESCROW_RELEASE',
  showVaultNote = true,
  className = '',
}) {
  const { breakdown, isLoading } = useCheckoutFees(subtotal, appliesTo);

  if (!subtotal || Number(subtotal) <= 0) return null;

  return (
    <div className={`space-y-2 text-sm ${className}`}>
      <div className="flex justify-between text-zinc-600">
        <span>Subtotal (held in Forte Vault)</span>
        <span className="font-semibold text-zinc-900">{formatKes(breakdown.subtotal)}</span>
      </div>
      <div className="flex justify-between text-zinc-600">
        <span>Platform fee ({breakdown.platformPercent}%)</span>
        <span className="font-semibold text-zinc-900">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : formatKes(breakdown.platformFee)}
        </span>
      </div>
      <div className="flex justify-between text-[#4C1D95] font-bold border-t border-zinc-100 pt-2">
        <span>Provider receives (after release)</span>
        <span>{formatKes(breakdown.providerNet)}</span>
      </div>
      {showVaultNote && (
        <p className="text-xs text-zinc-500 flex items-start gap-1.5 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#4C1D95] shrink-0 mt-0.5" />
          Funds are purpose-bound escrow only (not a bank deposit). M-Pesa B2C fees apply on withdrawal.
        </p>
      )}
    </div>
  );
}


