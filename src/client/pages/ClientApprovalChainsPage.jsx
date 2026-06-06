import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, UserCheck, Plus, 
  Settings, Users, DollarSign, ArrowRight, CheckCircle 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ClientApprovalChainsPage() {
  const [thresholds, setThresholds] = useState([
    { id: 1, tier: 'Level 1: Auto-Release', limit: 'Up to KES 50,000', approver: 'Direct Manager / Auto' },
    { id: 2, tier: 'Level 2: Department Head', limit: 'KES 50,001 - KES 150,000', approver: 'Product Director' },
    { id: 3, tier: 'Level 3: Executive Board', limit: 'KES 150,001+', approver: 'Chief Financial Officer' }
  ]);

  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 'APP-092', contract: 'Substation Site Construction Allowance', amount: 125000, requestedBy: 'Sarah Jenkins (Ops)', tier: 'Level 2' },
    { id: 'APP-074', contract: 'Emergency Structural Repairs Survey', amount: 180000, requestedBy: 'Elena Rostova (QA)', tier: 'Level 3' }
  ]);

  const handleApprove = (id, contract, amount) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Authorizing KES ${amount.toLocaleString()} allocation for ${contract}...`,
        success: () => {
          setPendingApprovals(prev => prev.filter(a => a.id !== id));
          return `Budget authorization successful! Escrow contract initialized. 🔒`;
        },
        error: 'Authorization failed.'
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white">
      <Toaster position="top-right" />

      {/* Header title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Corporate Approval Chains</h1>
          <p className="text-xs font-semibold text-light-gray/50 mt-1">Configure automated budget limits, define tiered department hierarchy rules, and approve pending payroll runs.</p>
        </div>

        <Button onClick={() => toast.success('New threshold rule initialized.')} className="bg-success border-none rounded-xl text-xs font-bold py-2.5 flex items-center gap-1.5 shadow-lg shadow-[#4C1D95]/20">
          <Plus className="w-4 h-4" /> Add Custom Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Tiered Threshold Rules List */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 border border-white/10 bg-white/5 rounded-3xl space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5"><Settings className="w-4 h-4 text-success" /> Threshold Matrix</h3>
            
            <div className="space-y-4">
              {thresholds.map(rule => (
                <div key={rule.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                  <h4 className="text-xs font-black text-white">{rule.tier}</h4>
                  <div className="flex justify-between text-[10px] font-bold text-light-gray/60">
                    <span>Release Limit:</span>
                    <span className="text-success font-mono">{rule.limit}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-light-gray/60">
                    <span>Authorized Approver:</span>
                    <span className="text-white">{rule.approver}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side: Pending Authorizations Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-white/10 bg-white/5 p-6 rounded-3xl">
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2"><UserCheck className="w-4 h-4 text-success" /> Awaiting Corporate Authorization ({pendingApprovals.length})</h3>
            
            {pendingApprovals.length === 0 ? (
              <div className="py-12 text-center text-light-gray/30 text-xs font-bold">All pending budget approvals are cleared! 🚀</div>
            ) : (
              <div className="space-y-4">
                {pendingApprovals.map(req => (
                  <div key={req.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-success uppercase tracking-wider">{req.id}</span>
                        <span className="text-[9px] font-black uppercase bg-white/10 px-2 py-0.5 rounded text-light-gray">{req.tier} Required</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{req.contract}</h4>
                      <p className="text-[10px] text-light-gray/50 font-semibold">Requested by: {req.requestedBy}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                      <span className="text-base font-black text-white">KES {req.amount.toLocaleString()}</span>
                      <Button 
                        onClick={() => handleApprove(req.id, req.contract, req.amount)}
                        className="bg-success hover:bg-success/90 border-none font-bold text-[10px] py-2 px-4 rounded-xl shadow"
                      >
                        Approve Allocation
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}


