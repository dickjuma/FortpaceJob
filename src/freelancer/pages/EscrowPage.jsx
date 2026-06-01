import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Shield, Clock, AlertCircle, CheckCircle2, ChevronRight, Lock, Search, AlertOctagon, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { contractAPI } from '../../common/services/api';
import { useConfirm } from '../../common/context/ConfirmContext';

const EscrowSkeleton = () => (
  <div className="space-y-8 animate-pulse pb-12">
    <div className="flex justify-between items-end">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-light-gray rounded-md" />
        <div className="h-4 w-48 bg-light-gray rounded-md" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-light-gray rounded-2xl" />
      ))}
    </div>
    <div className="h-96 bg-light-gray rounded-2xl" />
  </div>
);

function mapContractStatus(status) {
  const s = String(status || '').toUpperCase();
  if (s === 'DISPUTED' || s === 'DISPUTE') return 'In Dispute';
  if (s === 'COMPLETED' || s === 'RELEASED') return 'Released';
  if (s === 'ACTIVE' || s === 'FUNDED') return 'Funded';
  if (s === 'PENDING' || s === 'DRAFT') return 'Awaiting Funding';
  return 'Funded';
}

function contractToEscrowRow(contract) {
  const milestone = contract.milestones?.[0];
  const amount = Number(milestone?.amount ?? contract.totalAmount ?? 0);
  return {
    id: contract.id,
    contractId: contract.id,
    milestoneId: milestone?.id,
    client: contract.clientName || contract.clientId || 'Client',
    milestone: milestone?.title || contract.title || 'Contract milestone',
    amount,
    status: mapContractStatus(contract.status),
    date: contract.createdAt
      ? new Date(contract.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      : '—',
    releaseDate:
      contract.status === 'COMPLETED'
        ? contract.updatedAt
          ? new Date(contract.updatedAt).toLocaleDateString()
          : 'Released'
        : 'Pending approval',
  };
}

export default function EscrowPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const loadEscrows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await contractAPI.getMyContracts({ limit: 50 });
      const list = res?.data ?? res?.contracts ?? (Array.isArray(res) ? res : []);
      setEscrows(list.map(contractToEscrowRow));
    } catch {
      toast.error('Could not load escrow contracts.');
      setEscrows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEscrows();
  }, [loadEscrows]);

  const summary = useMemo(() => {
    const funded = escrows.filter((e) => e.status === 'Funded').reduce((s, e) => s + e.amount, 0);
    const awaiting = escrows.filter((e) => e.status === 'Awaiting Funding').reduce((s, e) => s + e.amount, 0);
    const dispute = escrows.filter((e) => e.status === 'In Dispute').reduce((s, e) => s + e.amount, 0);
    return { funded, awaiting, dispute };
  }, [escrows]);

  const handleRequestRelease = async (escrow) => {
    const ok = await confirm({
      title: 'Request release',
      message: `Request release of KES ${escrow.amount.toLocaleString()} for "${escrow.milestone}"? The client will be notified to approve.`,
      confirmLabel: 'Request release',
      critical: false,
    });
    if (!ok) return;

    const toastId = toast.loading('Submitting release request…');
    try {
      if (!escrow.milestoneId) {
        throw new Error('No milestone found on this contract.');
      }
      await contractAPI.submitMilestone(escrow.milestoneId);
      toast.success('Release request submitted.', { id: toastId });
      loadEscrows();
    } catch (err) {
      toast.error(err?.message || 'Release request failed.', { id: toastId });
    }
  };

  const handleOpenDispute = async (escrow) => {
    const ok = await confirm({
      title: 'Open dispute',
      message: `Open a dispute for contract ${escrow.id}? Trust & Safety will review escrow funds.`,
      confirmLabel: 'Open dispute',
      critical: true,
    });
    if (!ok) return;
    navigate(`/freelancer/disputes?contract=${escrow.contractId}`);
  };

  const filteredEscrows = escrows.filter((e) => {
    if (filter !== 'All' && e.status !== filter) return false;
    if (
      searchTerm &&
      !e.client.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !e.milestone.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  if (loading) return <EscrowSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-success/10 text-success rounded-xl shadow-sm border border-success/20">
              <Shield size={24} />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Escrow Protection</h1>
          </div>
          <p className="text-sm text-text-secondary font-medium">
            Track funded milestones, request releases, and manage disputes securely.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#222222] border-none text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-success/20 blur-[40px] rounded-full pointer-events-none group-hover:bg-success/30 transition-colors" />
          <div className="relative z-10">
            <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Lock size={14} className="text-success" /> Securely Funded
            </p>
            <h3 className="text-4xl font-black tracking-tight">KES {summary.funded.toLocaleString()}</h3>
            <p className="text-[10px] text-white/50 mt-2">Ready for release upon approval</p>
          </div>
        </Card>

        <Card className="bg-white border-border shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 flex items-center gap-1">
              <Clock size={14} className="text-warning" /> Awaiting Funding
            </p>
            <h3 className="text-4xl font-black text-text-primary tracking-tight">KES {summary.awaiting.toLocaleString()}</h3>
            <p className="text-[10px] text-text-secondary mt-2">Do not start work until funded</p>
          </div>
        </Card>

        <Card className="bg-white border-border shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 flex items-center gap-1">
              <AlertOctagon size={14} className="text-[#e63946]" /> In Dispute
            </p>
            <h3 className="text-4xl font-black text-[#e63946] tracking-tight">KES {summary.dispute.toLocaleString()}</h3>
            <p className="text-[10px] text-text-secondary mt-2">Under review by Trust and Safety</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-border">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto custom-scrollbar">
          {['All', 'Funded', 'Awaiting Funding', 'Released', 'In Dispute'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all whitespace-nowrap',
                filter === f
                  ? 'bg-[#222222] text-white shadow-sm'
                  : 'text-text-secondary hover:text-[#222222] hover:bg-light-gray'
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64 group/search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within/search:text-[#222222] transition-colors" />
          <input
            type="text"
            placeholder="Search milestones..."
            className="w-full pl-9 pr-4 py-2 bg-light-gray/50 border border-border rounded-lg text-sm font-medium focus:outline-none focus:border-[#222222] focus:ring-1 focus:ring-navy transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredEscrows.length === 0 ? (
          <Card className="text-center py-20 bg-white/50 backdrop-blur-md border-border shadow-sm">
            <Shield className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-text-primary">No escrow records found</h3>
            <p className="text-sm text-text-secondary mt-1">Active contracts with milestones appear here.</p>
          </Card>
        ) : (
          filteredEscrows.map((escrow) => (
            <Card key={escrow.id} className="p-0 overflow-hidden bg-white border-border shadow-sm hover:border-[#222222]/50 transition-colors">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 p-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-[#222222] uppercase tracking-widest bg-[#222222]/10 px-2 py-0.5 rounded-md">
                      {escrow.id}
                    </span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest',
                        escrow.status === 'Funded'
                          ? 'bg-success/10 text-success border border-success/20'
                          : escrow.status === 'Awaiting Funding'
                            ? 'bg-warning/10 text-warning border border-warning/20'
                            : escrow.status === 'In Dispute'
                              ? 'bg-[#e63946]/10 text-[#e63946] border border-[#e63946]/20 animate-pulse'
                              : 'bg-light-gray text-text-secondary border border-border'
                      )}
                    >
                      {escrow.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary tracking-tight">{escrow.milestone}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-text-secondary">Client:</span>
                    <span className="text-sm font-bold text-text-primary">{escrow.client}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
                      <Clock size={14} className="text-[#222222]" /> Added {escrow.date}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-border hidden sm:block" />
                    <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
                      <ChevronRight size={14} className="text-[#222222]" /> Release: {escrow.releaseDate}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-md">
                      KES {escrow.amount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-col gap-2 justify-end w-full md:w-auto">
                  {escrow.status === 'Funded' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        className="shadow-md"
                        onClick={() => handleRequestRelease(escrow)}
                      >
                        <CheckCircle2 size={14} className="mr-1.5" /> Request Release
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/freelancer/messages')}
                      >
                        <MessageSquare size={14} className="mr-1.5" /> Message Client
                      </Button>
                    </>
                  )}

                  {escrow.status === 'Awaiting Funding' && (
                    <Button variant="outline" size="sm" onClick={() => navigate('/freelancer/messages')}>
                      <AlertCircle size={14} className="mr-1.5" /> Remind Client
                    </Button>
                  )}

                  {escrow.status === 'In Dispute' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#e63946] text-[#e63946] hover:bg-[#e63946]/10"
                      onClick={() => handleOpenDispute(escrow)}
                    >
                      <AlertOctagon size={14} className="mr-1.5" /> View Dispute
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
