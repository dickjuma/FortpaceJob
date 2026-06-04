// Financial configuration constants

export const TRANSACTION_STATUSES = {
  completed: { label: 'Completed', bg: 'bg-emerald-100 dark:bg-emerald-900/30', color: 'text-success dark:text-success' },
  pending: { label: 'Pending', bg: 'bg-amber-100 dark:bg-amber-900/30', color: 'text-amber-600 dark:text-amber-400' },
  failed: { label: 'Failed', bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
  refunded: { label: 'Refunded', bg: 'bg-zinc-100 dark:bg-zinc-800', color: 'text-zinc-600 dark:text-zinc-400' },
};

export const INVOICE_STATUSES = {
  paid: { label: 'Paid', bg: 'bg-emerald-100 dark:bg-emerald-900/30', color: 'text-success dark:text-success' },
  unpaid: { label: 'Unpaid', bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
  overdue: { label: 'Overdue', bg: 'bg-rose-100 dark:bg-rose-900/30', color: 'text-rose-600 dark:text-rose-400' },
  draft: { label: 'Draft', bg: 'bg-zinc-100 dark:bg-zinc-800', color: 'text-zinc-600 dark:text-zinc-400' },
};

export const ESCROW_STATUSES = {
  funded: { label: 'Funded', bg: 'bg-[#2bb75c]/10 dark:bg-[#2bb75c]/30', color: 'text-[#2bb75c] dark:text-[#2bb75c]' },
  released: { label: 'Released', bg: 'bg-emerald-100 dark:bg-emerald-900/30', color: 'text-success dark:text-success' },
  disputed: { label: 'Disputed', bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
  refunded: { label: 'Refunded', bg: 'bg-zinc-100 dark:bg-zinc-800', color: 'text-zinc-600 dark:text-zinc-400' },
};

export const PAYMENT_METHODS = {
  mpesa: { label: 'M-PESA', icon: 'smartphone' },
  card: { label: 'Card', icon: 'credit-card' },
  bank: { label: 'Bank Transfer', icon: 'building' },
  paypal: { label: 'PayPal', icon: 'globe' },
};

export const FEE_STRUCTURES = {
  platform_fee_percent: 10.0,
  withdrawal_fee_fixed: 50.0, // KES
  escrow_fee_percent: 2.5,
};

