import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';

const FINANCE_LINKS = [
  { label: "Overview", path: "/admin/finance" },
  { label: "Transactions", path: "/admin/finance/transactions" },
  { label: "Deposits", path: "/admin/finance/deposits" },
  { label: "Escrow", path: "/admin/finance/escrow" },
  { label: "Withdrawals", path: "/admin/finance/withdrawals" },
  { label: "Refunds", path: "/admin/finance/refunds" },
  { label: "Fees & Config", path: "/admin/finance/fees" },
  { label: "Fees Collected", path: "/admin/finance/fee-collection" },
  { label: "Subscriptions", path: "/admin/finance/subscriptions" },
  { label: "Reconciliation", path: "/admin/finance/reconciliation" },
  { label: "Payouts", path: "/admin/finance/payouts" },
  { label: "Tax", path: "/admin/finance/tax" },
  { label: "Wallets", path: "/admin/finance/wallets" },
];

export default function FinanceNavigation() {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-4 no-scrollbar border-b border-zinc-200 dark:border-zinc-800 mb-6">
      {FINANCE_LINKS.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          end={link.path === '/admin/finance'}
          className={({ isActive }) => cn(
            "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all",
            isActive 
              ? "bg-surface-dark text-white dark:bg-[#4C1D95] shadow-lg shadow-[#4C1D95]/25/20" 
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
          )}
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  );
}


