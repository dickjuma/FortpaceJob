import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, Clock, FileText, BarChart2, Zap, ArrowRight, XCircle } from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';

// --- Skeleton Loaders ---
const ProposalSkeleton = () => (
  <div className="space-y-8 animate-pulse pb-12">
    <div className="flex justify-between items-end">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-light-gray rounded-md"></div>
        <div className="h-4 w-48 bg-light-gray rounded-md"></div>
      </div>
      <div className="h-10 w-32 bg-light-gray rounded-md"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-light-gray rounded-2xl"></div>)}
    </div>
    <div className="h-96 bg-light-gray rounded-2xl"></div>
  </div>
);

// --- Mock Data ---
const MOCK_PROPOSALS = [
  { id: 1, jobTitle: 'Senior React Developer for Enterprise Dashboard', client: 'Acme Corp', amount: 'KES 8,500/hr', status: 'Submitted', date: '2 hours ago' },
  { id: 2, jobTitle: 'Full Stack Node.js Migration', client: 'FinTech Solutions', amount: 'KES 1,500,000', status: 'Viewed', date: '1 day ago' },
  { id: 3, jobTitle: 'UI/UX Mobile App Redesign', client: 'Startup Inc', amount: 'KES 450,000', status: 'Shortlisted', date: '3 days ago' },
  { id: 4, jobTitle: 'Frontend Developer (Vue to React)', client: 'Legacy Systems', amount: 'KES 6,000/hr', status: 'Declined', date: '1 week ago' },
];

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card hover className="relative overflow-hidden group bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm">
    <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-accent-purple/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-accent-purple/10 transition-colors"></div>
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", colorClass)}>
        <Icon size={20} />
      </div>
    </div>
    <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1 relative z-10">{title}</p>
    <h3 className="text-3xl font-black text-text-primary tracking-tight relative z-10">{value}</h3>
  </Card>
);

export default function ProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All Proposals');

  useEffect(() => {
    // Simulate API fetch
    const fetchProposals = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 1000));
      setProposals(MOCK_PROPOSALS);
      setLoading(false);
    };
    fetchProposals();
  }, [filter]);

  const getProgressWidth = (status) => {
    switch(status) {
      case 'Submitted': return 'w-1/4 bg-text-secondary';
      case 'Viewed': return 'w-2/4 bg-accent-purple';
      case 'Shortlisted': return 'w-3/4 bg-success shadow-[0_0_10px_rgba(34,197,94,0.5)]';
      case 'Declined': return 'w-full bg-accent-red';
      default: return 'w-0';
    }
  };

  const handleWithdraw = (id, e) => {
    e.stopPropagation();
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="font-bold">Withdraw Proposal?</span>
        <span className="text-sm">This action cannot be undone.</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => toast.dismiss(t.id)}>Cancel</Button>
          <Button size="sm" variant="primary" className="bg-accent-red" onClick={() => {
            setProposals(prev => prev.filter(p => p.id !== id));
            toast.dismiss(t.id);
            toast.success('Proposal withdrawn');
          }}>Withdraw</Button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  if (loading && proposals.length === 0) return <ProposalSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <Toaster position="top-right" />
      
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-purple/10 text-accent-purple rounded-xl shadow-sm border border-accent-purple/20">
              <Send size={24} />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Proposal Management</h1>
          </div>
          <p className="text-sm text-text-secondary font-medium">
            Track your submitted proposals, client views, and interview invitations in real-time.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button onClick={() => toast('Searching for new jobs...', { icon: '🔍' })} variant="primary" className="shadow-lg">
            <Zap size={16} className="mr-2" /> Find More Jobs
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Proposals" value="12" icon={Clock} colorClass="bg-navy/10 text-navy" />
        <StatCard title="Client Views" value="45" icon={FileText} colorClass="bg-accent-purple/10 text-accent-purple" />
        <StatCard title="Interviews" value="3" icon={CheckCircle} colorClass="bg-success/10 text-success" />
        <StatCard title="Win Rate" value="24%" icon={BarChart2} colorClass="bg-accent-red/10 text-accent-red" />
      </div>

      {/* Modern Proposals Table */}
      <Card className="p-0 overflow-hidden relative shadow-sm border-border bg-white/60 backdrop-blur-xl">
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-accent-purple/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="p-6 md:p-8 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 bg-white/50">
          <h2 className="text-xl font-black text-text-primary tracking-tight">Recent Proposals</h2>
          
          <div className="flex items-center gap-3">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-4 pr-10 py-2.5 bg-white border border-border text-text-primary rounded-lg text-sm font-bold outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-colors cursor-pointer appearance-none shadow-sm"
            >
              <option>All Proposals</option>
              <option>Active</option>
              <option>Shortlisted</option>
              <option>Archived</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          {proposals.length === 0 && !loading ? (
            <div className="text-center py-20">
              <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-text-primary">No proposals found</h3>
              <p className="text-sm text-text-secondary mt-1">You haven't submitted any proposals matching this filter.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-light-gray/50 border-b border-border text-text-secondary text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-8 py-5">Job Title / Client</th>
                  <th className="px-8 py-5">Submitted</th>
                  <th className="px-8 py-5">Proposed Bid</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {proposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-light-gray/30 transition-colors cursor-pointer group" onClick={() => toast(`Opening proposal ${proposal.id}`)}>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-text-primary group-hover:text-accent-purple transition-colors truncate max-w-[300px]">
                          {proposal.jobTitle}
                        </span>
                        <span className="text-[10px] text-text-secondary font-bold mt-1 uppercase tracking-widest">
                          Client: {proposal.client}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                        {proposal.date}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-text-primary">
                        {proposal.amount}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className={cn(
                          "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1",
                          proposal.status === 'Shortlisted' ? 'bg-success/10 text-success' :
                          proposal.status === 'Viewed' ? 'bg-accent-purple/10 text-accent-purple' :
                          proposal.status === 'Declined' ? 'bg-accent-red/10 text-accent-red' :
                          'bg-light-gray text-text-secondary'
                        )}>
                          {proposal.status}
                        </span>
                        <div className="w-16 h-1 bg-light-gray rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all duration-1000", getProgressWidth(proposal.status))}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button onClick={e => handleWithdraw(proposal.id, e)} variant="outline" size="sm" className="border-accent-red text-accent-red hover:bg-accent-red/10 px-2">
                          <XCircle size={16} />
                        </Button>
                        <Button onClick={(e) => { e.stopPropagation(); toast('Viewing details...', { icon: '📄' }); }} variant="outline" size="sm">
                          Details <ArrowRight size={14} className="ml-1" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
