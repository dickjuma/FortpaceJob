import React, { useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCcw, 
  Search,
  Filter,
  Download,
  MoreHorizontal,
  CircleDollarSign,
  Landmark,
  ShieldAlert,
  Percent,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTransactions, useEscrowSummary, usePendingWithdrawals, useFinancialActions, useFeeRules } from "../hooks/useFinancial";
import { ConfirmModal, SuccessOverlay } from "../components/ui/AdminModals";

const FinancialControl = () => {
  const { data: transactionsData, isLoading, error, refetch } = useTransactions();
  const { data: escrowSummary } = useEscrowSummary();
  const { data: pendingWithdrawals } = usePendingWithdrawals();
  const { data: feeRulesData } = useFeeRules();
  const { approveWithdrawal, rejectWithdrawal, runReconciliation, toggleFeeRule } = useFinancialActions();
  const [rejectTarget, setRejectTarget] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const feeRules = feeRulesData || [];

  const transactions = transactionsData?.data || [];

  const formatTransaction = (tx) => ({
    id: tx.id || tx.txId,
    user: tx.user?.email || tx.userId || 'Unknown',
    date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : tx.date || 'N/A',
    type: tx.type?.replace('_', ' ') || 'N/A',
    amount: tx.amount ? (typeof tx.amount === 'number' ? `$${tx.amount.toLocaleString()}` : tx.amount) : '$0',
    status: tx.status || 'PENDING',
  });

  const formattedTransactions = transactions.map(formatTransaction);

  if (isLoading) return (
    <div className="p-8 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2bb75c]/20" />
    </div>
  );

  if (error) return <div className="p-8 text-rose-500">Failed to load financial data: {error?.message}</div>;

  const escrowTotal = escrowSummary
    ? (escrowSummary.activeEscrow || 0) + (escrowSummary.releasedEscrow || 0)
    : null;
  const escrowToday = escrowSummary?.todayInflow ?? null;
  const heldFunds = escrowSummary?.heldFunds ?? escrowSummary?.flaggedFunds ?? null;

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      {/* Modals */}
      <ConfirmModal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={(reason) => {
          rejectWithdrawal.mutate(
            { wdId: rejectTarget, reason },
            {
              onSuccess: () => { setRejectTarget(null); setSuccessMsg('Withdrawal rejected successfully.'); },
            }
          );
        }}
        title="Reject Withdrawal?"
        message="This action will reject the withdrawal request and notify the user."
        requireReason
        reasonLabel="Reason for rejection"
        variant="danger"
        isPending={rejectWithdrawal.isPending}
      />
      {successMsg && <SuccessOverlay isOpen message={successMsg} onClose={() => setSuccessMsg(null)} />}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Financial Control</h1>
          <p className="text-zinc-500 mt-1 font-medium">Monitor platform liquidity, escrow ledger, and transaction integrity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => runReconciliation.mutate({})}
            disabled={runReconciliation.isPending}
            className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {runReconciliation.isPending ? <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"/> : <RefreshCcw size={18} />}
            Run Global Reconciliation
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#222222] rounded-[24px] p-8 text-white relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Landmark size={24} className="text-emerald-400" />
              </div>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-emerald-500/20">Live Ledger</span>
            </div>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-6">Total Platform Escrow</p>
            <h3 className="text-4xl font-black mt-2 tracking-tight">
              {escrowTotal !== null ? `$${escrowTotal.toLocaleString()}` : '—'}
            </h3>
            <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 w-fit px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <ArrowUpRight size={14} />
              {escrowToday !== null ? `+$${Number(escrowToday).toLocaleString()} today` : 'Loading...'}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/20 blur-[80px] rounded-full translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        </div>

        <div className="bg-white dark:bg-[#222222] rounded-[24px] p-8 border border-zinc-200 dark:border-white/10 shadow-sm transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-success/10 rounded-xl text-success">
              <CircleDollarSign size={24} />
            </div>
            <button className="text-zinc-400 hover:text-success transition-colors"><RefreshCcw size={18} /></button>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest mt-6">Pending Withdrawals</p>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-2 tracking-tight">
            {pendingWithdrawals?.length != null ? `${pendingWithdrawals.length} requests` : '—'}
          </h3>
          <p className="mt-4 text-xs font-bold text-success bg-success/10 w-fit px-2.5 py-1 rounded-lg">
            {pendingWithdrawals?.length ?? 0} requests awaiting approval
          </p>
        </div>

        <div className="bg-white dark:bg-[#222222] rounded-[24px] p-8 border border-zinc-200 dark:border-white/10 shadow-sm transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
              <ShieldAlert size={24} />
            </div>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest mt-6">Held Funds (Flags)</p>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-2 tracking-tight">
            {heldFunds !== null ? `$${Number(heldFunds / 100).toLocaleString()}` : '—'}
          </h3>
          <p className="mt-4 text-xs font-bold text-rose-500 bg-rose-500/10 w-fit px-2.5 py-1 rounded-lg uppercase tracking-tighter">Immediate audit required</p>
        </div>
      </div>

      {/* Dynamic Fee Engine Configuration */}
      <div className="bg-white dark:bg-[#222222] rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Platform Fee Engine</h2>
            <p className="text-sm text-zinc-500 font-medium">Manage dynamic commission rates applied during wallet and escrow operations.</p>
          </div>
          <button className="flex items-center gap-2 bg-success text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-[#2bb75c]/20">
            <Percent size={16} />
            New Rule
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feeRules.length === 0 ? (
            <div className="col-span-full py-8 text-center text-zinc-500 font-medium">
              No dynamic fee rules configured. Platform operates at 0% fees.
            </div>
          ) : (
            feeRules.map(rule => (
              <div key={rule.id} className="p-4 border border-zinc-200 dark:border-white/10 rounded-2xl flex flex-col gap-2 transition-all hover:border-success/50">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-zinc-900 dark:text-white truncate pr-2">{rule.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase shrink-0 ${rule.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {rule.active ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium space-y-1">
                  <p>Applied to: <span className="text-zinc-900 dark:text-white font-bold">{rule.appliesTo}</span></p>
                  <p>Rate/Amount: <span className="text-success font-bold">{rule.type === 'PERCENTAGE' ? `${rule.value * 100}%` : `KES ${rule.value}`}</span></p>
                </div>
                <button 
                  onClick={() => toggleFeeRule.mutate({ ruleId: rule.id })}
                  disabled={toggleFeeRule.isPending}
                  className="mt-2 text-xs font-bold w-full py-2 rounded-lg bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50 text-zinc-700 dark:text-zinc-300"
                >
                  Toggle Rule
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modern Transaction Ledger Table */}
      <div className="bg-white dark:bg-[#222222] rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden relative">
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-success/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="p-6 md:p-8 border-b border-zinc-100 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Transaction Ledger</h2>
            <p className="text-sm text-zinc-500 font-medium">Full immutable history of platform value movement.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-success transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Find TX ID..." 
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-white/5 border border-transparent focus:border-success/50 focus:ring-1 focus:ring-success/50 rounded-xl text-sm outline-none transition-all dark:text-white"
              />
            </div>
            <button className="p-2.5 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/10 transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-white/5 border-b border-zinc-100 dark:border-white/10 text-zinc-500 dark:text-zinc-400 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-8 py-5">Transaction ID</th>
                <th className="px-8 py-5">User</th>
                <th className="px-8 py-5">Type</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
<tbody className="divide-y divide-zinc-50 dark:divide-white/5">
               {formattedTransactions.map((tx) => (
                 <tr key={tx.id} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                   <td className="px-8 py-6">
                     <span className="font-mono text-xs font-bold text-zinc-400 group-hover:text-success transition-colors">{tx.id}</span>
                   </td>
                   <td className="px-8 py-6">
                     <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-success transition-colors">{tx.user}</p>
                     <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">{tx.date}</p>
                   </td>
                   <td className="px-8 py-6">
                     <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-white/10 px-2.5 py-1 rounded-lg">{tx.type}</span>
                   </td>
                   <td className="px-8 py-6 font-black text-sm">
                     <span className={tx.amount?.startsWith('+') ? 'text-emerald-500' : 'text-zinc-900 dark:text-white'}>{tx.amount}</span>
                   </td>
                   <td className="px-8 py-6">
                     <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                       tx.status === 'COMPLETED' || tx.status === 'SUCCESS' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 
                       tx.status === 'PENDING' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 
                       'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'
                     }`}>
                       <span className={`w-1.5 h-1.5 rounded-full ${
                         tx.status === 'COMPLETED' || tx.status === 'SUCCESS' ? 'bg-emerald-500' : 
                         tx.status === 'PENDING' ? 'bg-amber-500' : 
                         'bg-rose-500'
                       }`}></span>
                       {tx.status}
                     </span>
                   </td>
                   <td className="px-8 py-6 text-right">
                     <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                       {tx.status === 'PENDING' && tx.type?.toUpperCase() === 'WITHDRAWAL' && (
                         <>
                            <button 
                              onClick={() => {
                                approveWithdrawal.mutate(
                                  { wdId: tx.id },
                                  { onSuccess: () => setSuccessMsg('Withdrawal approved successfully.') }
                                );
                              }}
                              disabled={approveWithdrawal.isPending}
                              className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => setRejectTarget(tx.id)}
                              className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-colors"
                            >
                              Reject
                            </button>
                         </>
                       )}
                       <button className="p-2 text-zinc-400 hover:text-success hover:bg-success/10 rounded-xl transition-all">
                         <MoreHorizontal size={18} />
                       </button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-zinc-50/50 dark:bg-white/5 flex items-center justify-center relative z-10 border-t border-zinc-100 dark:border-white/10">
          <Link
            to="/admin/finance/transactions"
            className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-success dark:hover:text-success transition-colors uppercase tracking-widest flex items-center gap-2"
          >
            View Full Financial History <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FinancialControl;
