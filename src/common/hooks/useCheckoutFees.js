import { useMemo } from 'react';
import { useFeeCalculation, usePlatformFees } from './usePlatformFees';

/**
 * Forte Vault fee breakdown for checkout / hire / proposals.
 * @param {number} subtotalKes - gross amount before client-side display
 * @param {'ESCROW_RELEASE'|'HIRE_COMMITMENT'|'WITHDRAWAL'} appliesTo
 */
export function useCheckoutFees(subtotalKes, appliesTo = 'ESCROW_RELEASE') {
  const amount = Number(subtotalKes) || 0;
  const { data: publicFees } = usePlatformFees();
  const { data: calculated, isLoading, error } = useFeeCalculation(amount, { appliesTo }, amount > 0);

  const breakdown = useMemo(() => {
    if (calculated) {
      const split = calculated.escrowSplit || {};
      const platformFee = calculated.platformFee ?? split.platformFeeAmount ?? 0;
      const providerNet = calculated.netToFreelancer ?? split.providerPayoutAmount ?? amount - platformFee;
      const platformPercent =
        calculated.platformCommissionPercent ??
        split.platformFeePercent ??
        publicFees?.platformCommissionPercent ??
        10;
      return {
        subtotal: amount,
        platformFee,
        platformPercent,
        providerNet,
        escrowFee: calculated.escrowFee || 0,
        totalClientPays: amount,
        currency: calculated.currency || 'KES',
        fromApi: true,
      };
    }
    const pct = publicFees?.platformCommissionPercent ?? 10;
    const platformFee = (amount * pct) / 100;
    return {
      subtotal: amount,
      platformFee,
      platformPercent: pct,
      providerNet: amount - platformFee,
      escrowFee: 0,
      totalClientPays: amount,
      currency: 'KES',
      fromApi: false,
    };
  }, [amount, calculated, publicFees]);

  return { breakdown, isLoading, error, publicFees };
}
