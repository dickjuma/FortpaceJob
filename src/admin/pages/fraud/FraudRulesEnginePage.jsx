import React, { useState } from 'react';
import { 
  Zap, Plus, Play, Pause, Trash2, 
  ShieldCheck, AlertTriangle, Filter, Settings2, HelpCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const MOCK_RULES = [
  { id: 'RL-101', name: 'High Velocity Withdrawals', description: 'Flag users attempting > 3 withdrawals in 1 hour', trigger: 'withdrawal_count > 3', action: 'flag_user', status: 'active', priority: 'high' },
  { id: 'RL-102', name: 'New User High Value Contract', description: 'Require manual review for contracts > $5000 if user < 7 days old', trigger: 'contract_value > 5000 AND user_age < 7d', action: 'manual_review', status: 'active', priority: 'critical' },
  { id: 'RL-103', name: 'VPN Detection Check', description: 'Block access from known VPN/Proxy IP ranges', trigger: 'ip_type == "vpn"', action: 'block_access', status: 'paused', priority: 'medium' },
];

export default function FraudRulesEnginePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-brand-500/10 text-brand-600 rounded-xl shadow-sm">
              <Settings2 size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Fraud Rules Engine</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Automate platform security by defining logic-based triggers and enforcement actions.
          </p>
        </div>
        <button 
          onClick={() => toast.success('New Rule modal opened')}
          className="px-5 py-2.5 bg-surface-dark text-white dark:bg-brand-600 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Create New Rule
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_RULES.map(rule => (
          <div key={rule.id} className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group transition-all hover:border-brand-500/30">
            <div className="flex gap-4 items-start">
              <div className={cn(
                "p-3 rounded-2xl shrink-0",
                rule.status === 'active' ? "bg-emerald-50 text-success" : "bg-zinc-100 text-zinc-400"
              )}>
                <Zap size={24} fill={rule.status === 'active' ? "currentColor" : "none"} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-zinc-900 dark:text-white">{rule.name}</h3>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                    rule.priority === 'critical' ? 'bg-rose-100 text-rose-700' :
                    rule.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-brand-100 text-brand-700'
                  )}>
                    {rule.priority}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 font-medium max-w-xl">{rule.description}</p>
                <div className="pt-2 flex items-center gap-3">
                   <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
                     IF <span className="text-brand-500">{rule.trigger}</span>
                   </div>
                   <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
                     THEN <span className="text-rose-500 uppercase">{rule.action}</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              {rule.status === 'active' ? (
                <button 
                  onClick={() => toast.success(`Rule ${rule.id} paused.`)}
                  className="p-2.5 bg-surface dark:bg-zinc-800 text-zinc-500 hover:text-amber-500 rounded-xl transition-colors"
                  title="Pause Rule"
                >
                  <Pause size={18} />
                </button>
              ) : (
                <button 
                  onClick={() => toast.success(`Rule ${rule.id} activated.`)}
                  className="p-2.5 bg-emerald-50 text-success rounded-xl transition-colors"
                  title="Activate Rule"
                >
                  <Play size={18} />
                </button>
              )}
              <button 
                onClick={() => toast.success(`Editing rule ${rule.id}`)}
                className="p-2.5 bg-surface dark:bg-zinc-800 text-zinc-500 hover:text-brand-500 rounded-xl transition-colors"
              >
                <Settings2 size={18} />
              </button>
              <button 
                onClick={() => toast.success(`Rule ${rule.id} deleted.`)}
                className="p-2.5 bg-surface dark:bg-zinc-800 text-zinc-500 hover:text-rose-500 rounded-xl transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-600 rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-brand-200 uppercase text-[10px] font-black tracking-widest">
            <HelpCircle size={14} /> Documentation
          </div>
          <h2 className="text-xl font-bold italic">Need help building custom security logic?</h2>
          <p className="text-brand-100 text-sm max-w-xl opacity-90">
            Our rules engine uses a proprietary syntax for complex event processing. Check the system docs for all available triggers and data fields.
          </p>
        </div>
        <button className="relative z-10 px-6 py-3 bg-white text-brand-600 rounded-2xl font-black text-sm shadow-xl hover:bg-brand-50 transition-colors shrink-0">
          Open Rule Builder Docs
        </button>
        {/* Background Glows */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-brand-400/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
