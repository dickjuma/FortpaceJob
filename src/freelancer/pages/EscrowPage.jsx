import React, { useState, useEffect } from 'react';
import { Shield, Clock, AlertCircle, CheckCircle2, ChevronRight, Lock, Search, Filter, MessageSquare, AlertOctagon } from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';

// --- Skeleton Loaders ---
const EscrowSkeleton = () => (
  <div className="space-y-8 animate-pulse pb-12">
    <div className="flex justify-between items-end">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-light-gray rounded-md"></div>
        <div className="h-4 w-48 bg-light-gray rounded-md"></div>
      </div>
      <div className="h-10 w-32 bg-light-gray rounded-md"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <div key={i} className="h-32 bg-light-gray rounded-2xl"></div>)}
    </div>
    <div className="h-96 bg-light-gray rounded-2xl"></div>
  </div>
);

// --- Mock Data ---
const MOCK_ESCROW = [
  { id: 'ESC-8921', client: 'Nexus Tech', milestone: 'Backend API Integration', amount: 45000, status: 'Funded', date: 'May 20, 2026', releaseDate: 'Pending Approval' },
  { id: 'ESC-8920', client: 'Startup Inc', milestone: 'UI/UX Design Phase 1', amount: 35000, status: 'Released', date: 'May 18, 2026', releaseDate: 'May 25, 2026' },
  { id: 'ESC-8918', client: 'HealthSync App', milestone: 'Mobile App Wireframes', amount: 20000, status: 'In Dispute', date: 'May 10, 2026', releaseDate: 'On Hold' },
  { id: 'ESC-8915', client: 'Global Finance Corp', milestone: 'Security Audit', amount: 150000, status: 'Awaiting Funding', date: 'May 05, 2026', releaseDate: '-' },
];

export default function EscrowPage() {
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEscrow = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 800));
      setEscrows(MOCK_ESCROW);
      setLoading(false);
    };
    fetchEscrow();
  }, []);

  const handleAction = (id, action) => {
    if (action === 'request') {
      toast.success(`Release request sent for ${id}`, { icon: '💸' });
    } else if (action === 'dispute') {
      toast('Opening dispute resolution center...', { icon: '⚖️' });
    } else if (action === 'message') {
      toast.success('Opening messages');
    }
  };

  const filteredEscrows = escrows.filter(e => {
    if (filter !== 'All' && e.status !== filter) return false;
    if (searchTerm && !e.client.toLowerCase().includes(searchTerm.toLowerCase()) && !e.milestone.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (loading) return <EscrowSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <Toaster position="top-right" />
      
      {/* Premium Header */}
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-navy border-none text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-success/20 blur-[40px] rounded-full pointer-events-none group-hover:bg-success/30 transition-colors"></div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Lock size={14} className="text-success" /> Securely Funded
            </p>
            <h3 className="text-4xl font-black tracking-tight">KES 45k</h3>
            <p className="text-[10px] text-white/50 mt-2">Ready for release upon approval</p>
          </div>
        </Card>
        
        <Card className="bg-white border-border shadow-sm relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-warning/10 blur-[40px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 flex items-center gap-1">
              <Clock size={14} className="text-warning" /> Awaiting Funding
            </p>
            <h3 className="text-4xl font-black text-text-primary tracking-tight">KES 150k</h3>
            <p className="text-[10px] text-text-secondary mt-2">Do not start work until funded</p>
          </div>
        </Card>

        <Card className="bg-white border-border shadow-sm relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-accent-red/10 blur-[40px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 flex items-center gap-1">
              <AlertOctagon size={14} className="text-accent-red" /> In Dispute
            </p>
            <h3 className="text-4xl font-black text-accent-red tracking-tight">KES 20k</h3>
            <p className="text-[10px] text-text-secondary mt-2">Under review by Trust & Safety</p>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-border">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto custom-scrollbar">
          {['All', 'Funded', 'Awaiting Funding', 'Released', 'In Dispute'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all whitespace-nowrap",
                filter === f 
                  ? "bg-navy text-white shadow-sm" 
                  : "text-text-secondary hover:text-navy hover:bg-light-gray"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64 group/search">
          <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-text-secondary group-focus-within/search:text-navy transition-colors" />
          <input 
            type="text" 
            placeholder="Search milestones..." 
            className="w-full pl-9 pr-4 py-2 bg-light-gray/50 border border-border rounded-lg text-sm font-medium focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Escrow List */}
      <div className="space-y-4">
        {filteredEscrows.length === 0 ? (
          <Card className="text-center py-20 bg-white/50 backdrop-blur-md border-border shadow-sm">
            <Shield className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-text-primary">No escrow records found</h3>
            <p className="text-sm text-text-secondary mt-1">There are no escrow funds matching the current filter.</p>
          </Card>
        ) : (
          filteredEscrows.map(escrow => (
            <Card key={escrow.id} className="p-0 overflow-hidden bg-white border-border shadow-sm hover:border-navy/50 transition-colors">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 p-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-navy uppercase tracking-widest bg-navy/10 px-2 py-0.5 rounded-md">
                      {escrow.id}
                    </span>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest",
                      escrow.status === 'Funded' ? 'bg-success/10 text-success border border-success/20' :
                      escrow.status === 'Awaiting Funding' ? 'bg-warning/10 text-warning border border-warning/20' :
                      escrow.status === 'In Dispute' ? 'bg-accent-red/10 text-accent-red border border-accent-red/20 animate-pulse' :
                      'bg-light-gray text-text-secondary border border-border'
                    )}>
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
                      <Clock size={14} className="text-navy" /> Added {escrow.date}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-border hidden sm:block"></div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
                      <ChevronRight size={14} className="text-navy" /> Release: {escrow.releaseDate}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-border hidden sm:block"></div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-md">
                      KES {escrow.amount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-col gap-2 justify-end w-full md:w-auto">
                  {escrow.status === 'Funded' && (
                    <>
                      <Button variant="primary" size="sm" className="shadow-md" onClick={() => handleAction(escrow.id, 'request')}>
                        <CheckCircle2 size={14} className="mr-1.5" /> Request Release
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAction(escrow.id, 'message')}>
                        <MessageSquare size={14} className="mr-1.5" /> Message Client
                      </Button>
                    </>
                  )}

                  {escrow.status === 'Awaiting Funding' && (
                    <Button variant="outline" size="sm" onClick={() => handleAction(escrow.id, 'message')}>
                      <AlertCircle size={14} className="mr-1.5" /> Remind Client
                    </Button>
                  )}

                  {escrow.status === 'In Dispute' && (
                    <Button variant="outline" size="sm" className="border-accent-red text-accent-red hover:bg-accent-red/10" onClick={() => handleAction(escrow.id, 'dispute')}>
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
