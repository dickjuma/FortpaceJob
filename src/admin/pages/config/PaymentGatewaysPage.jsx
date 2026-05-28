import React from 'react';
import { 
  CreditCard, DollarSign, ShieldCheck, Zap, 
  Settings, CheckCircle2, AlertCircle, Plus, Globe
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const GATEWAYS = [
  { id: 'gw-1', name: 'M-PESA (Safaricom)', status: 'active', mode: 'live', type: 'mobile_money', volume: 'High' },
  { id: 'gw-2', name: 'Stripe Connect', status: 'active', mode: 'live', type: 'card_escrow', volume: 'Medium' },
  { id: 'gw-3', name: 'PayPal Payouts', status: 'maintenance', mode: 'sandbox', type: 'international', volume: 'Low' },
];

export default function PaymentGatewaysPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-brand-500/10 text-brand-600 rounded-xl shadow-sm">
              <CreditCard size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Payment Infrastructure</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Manage payment processing gateways, mobile money integrations, and payout providers.
          </p>
        </div>
        <button 
          onClick={() => toast.success('Gateway onboarding opened')}
          className="px-5 py-2.5 bg-surface-dark text-white dark:bg-brand-600 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Connect New Gateway
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {GATEWAYS.map(gw => (
          <div key={gw.id} className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-sm group transition-all hover:border-brand-500/30">
            <div className="flex items-center justify-between mb-8">
              <div className={cn(
                "p-3 rounded-2xl",
                gw.status === 'active' ? "bg-emerald-50 text-success" : "bg-amber-50 text-amber-500"
              )}>
                {gw.type === 'mobile_money' ? <Zap size={24} /> : <Globe size={24} />}
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                gw.mode === 'live' ? 'bg-rose-100 text-rose-700' : 'bg-zinc-100 text-zinc-600'
              )}>
                {gw.mode}
              </span>
            </div>
            
            <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-1">{gw.name}</h3>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">{gw.type.replace('_', ' ')}</p>

            <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", gw.status === 'active' ? "bg-success animate-pulse" : "bg-amber-500")} />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{gw.status}</span>
              </div>
              <button 
                onClick={() => toast.success(`Configuring ${gw.name}...`)}
                className="p-2 text-zinc-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
