import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle2, AlertCircle, ShieldCheck, Download, MoreVertical, Search, UploadCloud, MessageSquare } from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';
import { useFreelancerContracts, useSignContract, useFreelancerDashboard } from '../services/freelancerHooks';

// --- Skeleton Loaders ---
const ContractSkeleton = () => (
  <div className="space-y-6 animate-pulse pb-12">
    <div className="flex justify-between items-end">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-light-gray rounded-md"></div>
        <div className="h-4 w-48 bg-light-gray rounded-md"></div>
      </div>
      <div className="h-10 w-32 bg-light-gray rounded-md"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <div key={i} className="h-24 bg-light-gray rounded-2xl"></div>)}
    </div>
    <div className="space-y-4">
      {[1, 2].map(i => <div key={i} className="h-64 bg-light-gray rounded-2xl"></div>)}
    </div>
  </div>
);

export default function ContractsPage() {
  const [filter, setFilter] = useState('All Contracts');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const { data: dashboardData } = useFreelancerDashboard();
  const { data, isLoading: loading } = useFreelancerContracts({ 
    page, 
    limit: 10, 
    search: searchTerm,
    status: filter === 'All Contracts' ? undefined : filter.toUpperCase() 
  });
  
  const contracts = data?.items || [];
  
  const signContractMutation = useSignContract();

  // Dynamic calculations for KPIs
  const totalEscrow = dashboardData?.wallet?.locked || 0;
  
  const calculatedEscrow = contracts.reduce((sum, c) => {
    const msSum = (c.milestones || []).reduce((mSum, m) => {
      const status = m.status?.toUpperCase() || '';
      if (status === 'LOCKED' || status === 'PENDING' || status === 'IN_REVIEW' || status === 'ACTIVE') {
        return mSum + (m.amount || 0);
      }
      return mSum;
    }, 0);
    return sum + (msSum || c.totalAmount || 0);
  }, 0);

  const displayEscrow = totalEscrow || calculatedEscrow || 0;

  const activeContractsCount = dashboardData?.contracts?.active || contracts.filter(c => {
    const status = c.status?.toUpperCase() || '';
    return status === 'ACTIVE' || status === 'IN_PROGRESS';
  }).length || 0;

  const pendingApprovalsCount = contracts.filter(c => {
    const status = c.status?.toUpperCase() || '';
    return status === 'PENDING_SIGNATURE' || status === 'PENDING' || status === 'PENDING_APPROVAL';
  }).length || 0;

  const handleUpload = (e) => {
    e.stopPropagation();
    toast.success('Document uploaded to contract secure storage.', { icon: '📄' });
  };

  const handleSign = (id, e) => {
    e.stopPropagation();
    signContractMutation.mutate({ contractId: id, data: {} }, {
      onSuccess: () => {
        toast.success(`Contract ${id} digitally signed successfully.`, { icon: '✍️' });
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to sign contract');
      }
    });
  };

  if (loading && contracts.length === 0) return <ContractSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <Toaster position="top-right" />

      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#222222] text-white rounded-xl shadow-sm">
              <FileText size={24} />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Contract Management</h1>
          </div>
          <p className="text-sm text-text-secondary font-medium max-w-2xl">
            Securely manage your active agreements, track milestone deliveries, and monitor escrow funding in real-time.
          </p>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-[#222222] to-[#222222]/90 text-white shadow-lg border-none relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-white/10 blur-[40px] rounded-full pointer-events-none"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-2">Total In Escrow</p>
            <h3 className="text-3xl font-black tracking-tight">KES {displayEscrow.toLocaleString()}</h3>
            <p className="text-[10px] font-semibold text-success bg-success/20 w-fit px-2 py-0.5 rounded-full mt-2 flex items-center gap-1">
              <ShieldCheck size={10} /> Fully Secured
            </p>
          </div>
        </Card>
        <Card className="bg-white border-border shadow-sm flex flex-col justify-between">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Active Contracts</p>
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-black text-text-primary tracking-tight">{activeContractsCount}</h3>
            <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-md">
              Live Agreements
            </span>
          </div>
        </Card>
        <Card className="bg-white border-border shadow-sm flex flex-col justify-between">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Pending Approvals</p>
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-black text-[#e63946] tracking-tight">{pendingApprovalsCount}</h3>
            <span className={cn(
              "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md",
              pendingApprovalsCount > 0 ? "text-[#e63946] bg-[#e63946]/10 animate-pulse" : "text-text-secondary bg-light-gray"
            )}>
              {pendingApprovalsCount > 0 ? "Requires Signature" : "All Signed"}
            </span>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-border">
        <div className="relative w-full sm:w-96 group/input">
          <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-text-secondary group-focus-within/input:text-[#222222] transition-colors" />
          <input 
            type="text" 
            placeholder="Search by client or contract ID..." 
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-gray/50 border border-border text-sm font-medium focus:outline-none focus:border-[#222222] focus:ring-1 focus:ring-navy transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 bg-white border border-border text-text-primary rounded-lg text-sm font-bold outline-none focus:border-[#222222] cursor-pointer appearance-none shadow-sm"
        >
          <option>All Contracts</option>
          <option>In Progress</option>
          <option>Pending Signature</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Contracts List */}
      <div className="space-y-6">
        {contracts.length === 0 && !loading ? (
          <Card className="text-center py-20">
            <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-text-primary">No contracts found</h3>
            <p className="text-sm text-text-secondary mt-1">You don't have any contracts matching this criteria.</p>
          </Card>
        ) : (
          contracts.map(contract => (
            <Card key={contract.id} className="p-0 overflow-hidden bg-white border-border shadow-sm hover:border-[#222222]/50 transition-colors group">
              {/* Card Header */}
              <div className="p-6 border-b border-border bg-light-gray/20 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-[#222222] uppercase tracking-widest">{contract.id}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest",
                      contract.status === 'In Progress' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    )}>
                      {contract.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">{contract.title || contract.job?.title || 'Untitled Contract'}</h2>
                  <p className="text-sm font-semibold text-text-secondary mt-1">Client: {contract.client?.companyName || contract.client?.name || 'Client'}</p>
                </div>
                
                <div className="flex flex-col md:items-end">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Total Value</p>
                  <p className="text-2xl font-black text-text-primary">
                    {contract.totalAmount ? `KES ${contract.totalAmount.toLocaleString()}` : contract.totalEscrow}
                  </p>
                </div>
              </div>

              {/* Progress & Quick Actions */}
              <div className="p-6 border-b border-border bg-white flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="w-full md:w-1/2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Project Progress</span>
                    <span className="text-xs font-black text-text-primary">{contract.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-light-gray rounded-full overflow-hidden">
                    <div className="h-full bg-[#222222] rounded-full transition-all duration-1000" style={{ width: `${contract.progress}%` }}></div>
                  </div>
                  <p className="text-[10px] font-semibold text-text-secondary mt-2 flex items-center gap-1">
                    <Clock size={12} /> Due: {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : contract.dueDate || 'TBD'}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
                  <Button variant="outline" size="sm" onClick={() => toast('Opening messages', { icon: '💬'})}>
                    <MessageSquare size={14} className="mr-2" /> Message Client
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleUpload}>
                    <UploadCloud size={14} className="mr-2" /> Upload File
                  </Button>
                  {contract.status === 'PENDING_SIGNATURE' || contract.status === 'Pending Signature' && (
                    <Button variant="primary" size="sm" className="bg-[#e63946]" onClick={(e) => handleSign(contract.id, e)} disabled={signContractMutation.isPending}>
                      {signContractMutation.isPending ? 'Signing...' : 'Sign Agreement'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Milestones Tracker */}
              <div className="p-6 bg-light-gray/10">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-widest mb-4">Milestone Timeline</h4>
                <div className="space-y-4">
                  {(contract.milestones || []).map((milestone, idx) => (
                    <div key={milestone.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center mt-1">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2",
                          (milestone.status === 'COMPLETED' || milestone.status === 'Paid') ? "bg-success border-success text-white" :
                          (milestone.status === 'IN_REVIEW' || milestone.status === 'In Review') ? "bg-warning border-warning text-white" :
                          "bg-white border-border text-transparent"
                        )}>
                          {(milestone.status === 'COMPLETED' || milestone.status === 'Paid') && <CheckCircle2 size={12} />}
                          {(milestone.status === 'IN_REVIEW' || milestone.status === 'In Review') && <Clock size={12} />}
                        </div>
                        {idx !== contract.milestones.length - 1 && (
                          <div className={cn(
                            "w-0.5 h-full mt-1",
                            (milestone.status === 'COMPLETED' || milestone.status === 'Paid') ? "bg-success" : "bg-border"
                          )}></div>
                        )}
                      </div>
                      
                      <div className="flex-1 bg-white border border-border rounded-lg p-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:border-[#222222] transition-colors cursor-pointer group/ms" onClick={() => toast.success(`Viewing details for milestone: ${milestone.name || milestone.title}`)}>
                        <div>
                          <p className="text-sm font-bold text-text-primary group-hover/ms:text-[#222222] transition-colors">{milestone.name || milestone.title}</p>
                          <p className="text-[10px] font-semibold text-text-secondary mt-0.5 flex items-center gap-1">
                            <Clock size={10} /> Target: {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : milestone.date || 'TBD'}
                          </p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                          <span className="text-sm font-black text-text-primary">{milestone.amount ? `KES ${milestone.amount.toLocaleString()}` : 'TBD'}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest w-16 text-center",
                            (milestone.status === 'COMPLETED' || milestone.status === 'Paid') ? "bg-success/10 text-success" :
                            (milestone.status === 'IN_REVIEW' || milestone.status === 'In Review') ? "bg-warning/10 text-warning animate-pulse" :
                            "bg-light-gray text-text-secondary"
                          )}>
                            {milestone.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
