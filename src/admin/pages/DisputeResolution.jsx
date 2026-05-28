import React from "react";
import { 
  Gavel, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  FileText, 
  Scale,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';
import { Activity } from 'lucide-react';
import AuditLogViewer from '../components/audit/AuditLogViewer';

const activeDisputes = [
  { id: "DSP-401", contract: "Web App Development", parties: "John vs Sarah", escrow: "$2,500.00", status: "EVIDENCE_PHASE", level: "L1", deadline: "4h remaining" },
  { id: "DSP-398", contract: "Logo Design Branding", parties: "Mike vs TechCorp", escrow: "$500.00", status: "ARBITRATION", level: "L3", deadline: "Expired" },
  { id: "DSP-405", contract: "Content Strategy", parties: "Anna vs Marketing Ltd", escrow: "$1,200.00", status: "INITIAL_REVIEW", level: "L1", deadline: "2d remaining" },
];

const DisputeResolution = () => {
  const [activeTab, setActiveTab] = React.useState('queue');
  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Dispute Resolution</h1>
          <p className="text-zinc-500 mt-1">Impartial arbitration for contract conflicts and escrow stalemates.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab(activeTab === 'queue' ? 'audit' : 'queue')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2",
              activeTab === 'audit' ? "bg-surface-dark text-white dark:bg-brand-600" : "bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-surface"
            )}
          >
            <Activity size={16} /> {activeTab === 'queue' ? 'Arbitration Logs' : 'Back to Queue'}
          </button>
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                A{i}
              </div>
            ))}
          </div>
          <p className="text-xs font-semibold text-zinc-400">3 Arbitrators Online</p>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <AuditLogViewer 
             moduleFilter="DISPUTES" 
             title="Dispute Resolution Trail"
             description="Historical record of all evidence submissions, arbitration rulings, and fund distributions."
           />
        </div>
      ) : (
        <>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
          {/* Active Disputes Queue */}
          <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900">Active Review Queue</h2>
              <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {activeDisputes.length} Cases Pending
              </span>
            </div>
            
            <div className="divide-y divide-zinc-50">
              {activeDisputes.map((caseItem) => (
                <div key={caseItem.id} className="p-6 hover:bg-surface transition-colors group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        caseItem.status === 'ARBITRATION' ? 'bg-rose-50 text-rose-500' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        <Gavel size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-tighter">{caseItem.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            caseItem.level === 'L3' ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-zinc-300'
                          }`}>LEVEL {caseItem.level}</span>
                        </div>
                        <h3 className="text-base font-bold text-zinc-900 mt-1">{caseItem.contract}</h3>
                        <p className="text-xs text-zinc-500 mt-1">Parties: <span className="font-semibold text-zinc-700">{caseItem.parties}</span> • Escrow: <span className="font-bold text-success">{caseItem.escrow}</span></p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 md:text-right">
                      <div className="hidden md:block">
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Resolution Status</p>
                        <p className="text-xs font-bold text-zinc-700 mt-1">{caseItem.status.replace('_', ' ')}</p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Time Remaining</p>
                        <p className={`text-xs font-bold mt-1 ${caseItem.deadline === 'Expired' ? 'text-rose-600' : 'text-zinc-700'}`}>
                          {caseItem.deadline}
                        </p>
                      </div>
                      <button 
                        onClick={() => toast.success(`Opening arbitration panel for ${caseItem.id}`)}
                        className="flex items-center gap-2 bg-surface-dark text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-success transition-all"
                      >
                        Take Action
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dispute Logic Policy info */}
          <div className="bg-surface-dark rounded-[32px] p-8 text-white">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-success/20 rounded-2xl text-success shrink-0">
                <Scale size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Impartiality Standard</h2>
                <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                  Every dispute resolution follows the Platform Fairness Protocol. Arbitrators must review submitted evidence from both parties before issuing a ruling. Once a ruling is issued, funds are automatically distributed and the decision is immutable.
                </p>
                <div className="mt-6 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={14} className="text-success" />
                    Evidence Verified
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={14} className="text-success" />
                    Double-Admin Check
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Stats Sidebar */}
          <div className="bg-white rounded-[32px] p-6 border border-zinc-200 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-6">Dispute Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-zinc-100">
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="text-rose-500" />
                  <span className="text-xs font-bold text-zinc-600">High Severity</span>
                </div>
                <span className="text-sm font-bold text-zinc-900">4</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-zinc-100">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-amber-500" />
                  <span className="text-xs font-bold text-zinc-600">Avg. Resolution</span>
                </div>
                <span className="text-sm font-bold text-zinc-900">18.4h</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-zinc-100">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-brand-500" />
                  <span className="text-xs font-bold text-zinc-600">Escrow in Conflict</span>
                </div>
                <span className="text-sm font-bold text-zinc-900">$14,200</span>
              </div>
            </div>
          </div>

          {/* Recent Decisions Feed */}
          <div className="bg-white rounded-[32px] p-6 border border-zinc-200 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-6">Recent Rulings</h3>
            <div className="space-y-4">
              {[
                { id: "DSP-395", outcome: "FULL_REFUND", date: "Today, 10:20 AM" },
                { id: "DSP-390", outcome: "PARTIAL_SPLIT", date: "Yesterday" },
                { id: "DSP-388", outcome: "FULL_RELEASE", date: "Yesterday" },
              ].map((r) => (
                <div key={r.id} className="flex items-center justify-between group cursor-pointer">
                  <div>
                    <p className="text-xs font-bold text-zinc-900">{r.id}</p>
                    <p className="text-[10px] text-zinc-400 font-medium">{r.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-success bg-emerald-50 px-2 py-0.5 rounded-md uppercase">{r.outcome.replace('_', ' ')}</span>
                    <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => window.location.href = '/admin/disputes/resolved'}
              className="mt-6 w-full py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-500 hover:bg-surface transition-colors"
            >
              View Resolution Archive
            </button>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default DisputeResolution;
