import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, MessageSquare, Users, Calendar, AlertCircle } from 'lucide-react';
import { useAgencyContractApproval } from '../services/agencyHooks';

const STEPS = [
  { id: 1, name: 'Legal review', owner: 'Legal Ops', status: 'Approved' },
  { id: 2, name: 'Finance approval', owner: 'Finance Lead', status: 'Pending' },
  { id: 3, name: 'Executive sign-off', owner: 'COO', status: 'Pending' },
];

export default function ContractApprovalWorkflowPage() {
  const { id } = useParams();
  const { data, isLoading } = useAgencyContractApproval(id);
  const contract = data || {
    id,
    title: 'FinCorp ERP Rollout',
    client: 'FinCorp Bank',
    value: '$148,000',
    description: 'Enterprise software delivery contract requiring legal, finance, and executive approval before execution.',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="rounded-[28px] bg-[#222222] text-white p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-success/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-success" />
              <span className="text-xs font-black uppercase tracking-widest text-success">Approval workflow</span>
            </div>
            <h1 className="font-display text-3xl font-black">{contract.title}</h1>
            <p className="text-white/70 text-sm mt-2 max-w-2xl">{contract.description}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60">Contract value</p>
            <p className="font-display text-2xl font-black">{contract.value}</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-72 rounded-2xl bg-surface-muted animate-pulse" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="font-display font-bold text-xl text-brand-900 mb-6">Approval stages</h3>
            <div className="space-y-4">
              {STEPS.map((step, index) => (
                <div key={step.id} className="relative flex gap-4">
                  {index !== STEPS.length - 1 && <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-border" />}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${step.status === 'Approved' ? 'bg-success text-white' : 'bg-amber-50 text-amber-700'}`}>
                    {step.status === 'Approved' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 rounded-2xl border border-border bg-surface-soft p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-display font-bold text-brand-900">{step.name}</h4>
                        <p className="text-sm text-ink-secondary mt-1">{step.owner}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${step.status === 'Approved' ? 'bg-success/10 text-success' : 'bg-amber-50 text-amber-700'}`}>{step.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="font-display font-bold text-xl text-brand-900 mb-4">Pending approvers</h3>
              <div className="space-y-3">
                {['Finance Lead', 'COO'].map((approver) => (
                  <div key={approver} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <div className="w-9 h-9 rounded-full bg-[#4C1D95]/10 text-[#4C1D95] flex items-center justify-center font-bold text-xs">{approver.slice(0, 2).toUpperCase()}</div>
                    <div className="flex-1">
                      <p className="font-bold text-ink-primary">{approver}</p>
                      <p className="text-xs text-ink-secondary">Awaiting approval</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-3">
              <h3 className="font-display font-bold text-xl text-brand-900">Actions</h3>
              <button className="w-full rounded-xl bg-[#4C1D95] py-2.5 text-sm font-bold text-white inline-flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Approve</button>
              <button className="w-full rounded-xl border border-danger/30 py-2.5 text-sm font-bold text-danger inline-flex items-center justify-center gap-2"><XCircle className="w-4 h-4" /> Reject</button>
              <button className="w-full rounded-xl border border-border py-2.5 text-sm font-bold text-ink-primary inline-flex items-center justify-center gap-2"><MessageSquare className="w-4 h-4" /> Request changes</button>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="font-display font-bold text-xl text-brand-900 mb-4">Contract details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-ink-secondary">Client</span><span className="font-bold text-ink-primary">{contract.client}</span></div>
                <div className="flex justify-between"><span className="text-ink-secondary">Status</span><span className="font-bold text-ink-primary">Pending approvals</span></div>
                <div className="flex justify-between"><span className="text-ink-secondary flex items-center gap-2"><Calendar className="w-4 h-4" /> Created</span><span className="font-bold text-ink-primary">Jun 12, 2026</span></div>
                <div className="flex justify-between"><span className="text-ink-secondary flex items-center gap-2"><Users className="w-4 h-4" /> Stakeholders</span><span className="font-bold text-ink-primary">6</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
