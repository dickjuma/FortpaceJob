/**
 * 9FORTESPACE Master Financial Spec — UI reference (v1)
 * Backend source of truth: fortebackend escorow_wallet/config/forteVault.config.js
 */
export const FORTE_VAULT_SPEC = {
  regulatory: {
    escrowOnly: true,
    noInterest: true,
    noGeneralDeposits: true,
    thirdPartyEscrowAgent: true,
    b2cPaybill: true,
  },
  buckets: {
    ESCROW_LIABILITY: 'Client/project funds held in vault (not Fortespace revenue)',
    PLATFORM_REVENUE: '10% project fees, subscriptions, boosts',
  },
  defaults: {
    platformCommissionPercent: 10,
    providerPayoutPercent: 90,
    currency: 'KES',
  },
  withdrawal: {
    minKes: 500,
    maxDailyKes: 50_000,
    safetyHoldHours: 24,
    mpesaB2cPassthrough: true,
  },
  gateways: {
    primary: 'M-Pesa Daraja (STK + B2C)',
    global: 'Paystack / Flutterwave',
  },
};
