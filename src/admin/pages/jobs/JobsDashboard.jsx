import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Search, Filter, Plus, 
  MoreVertical, Eye, Edit, Trash2, 
  Activity, AlertCircle, CheckCircle2,
  Clock, MapPin, DollarSign
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import AuditLogViewer from '../../components/audit/AuditLogViewer';
import AdminActionModal from '../../components/ui/AdminActionModal';
import MarketplaceDetailModal from '../../components/marketplace/MarketplaceDetailModal';
import MarketplaceEditModal from '../../components/marketplace/MarketplaceEditModal';

const MOCK_JOBS = Array.from({ length: 15 }, (_, i) => ({
  id: `JOB-${7700 + i}`,
  title: [
    'Senior React Developer for Fintech App',
    'Mobile UI/UX Designer Needed',
    'Fullstack Node.js Engineer',
    'Logo & Brand Identity Design',
    'Content Writer for Technical Blog'
  ][i % 5],
  client: `Client Name ${i}`,
  budget: 50000 + (i * 15000),
  status: i % 4 === 0 ? 'completed' : i % 3 === 0 ? 'disputed' : 'active',
  proposals: 12 + i,
  location: i % 2 === 0 ? 'Nairobi, Kenya' : 'Remote',
  posted: new Date(Date.now() - Math.random() * 500000000).toISOString(),
}));

export default function JobsDashboard() {
  const [activeTab, setActiveTab] = useState('management');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionModal, setActionModal] = useState({ isOpen: false, type: '', data: null });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  const triggerAction = (type, data) => {
    setActionModal({ isOpen: true, type, data });
  };

  const handleAction = (action, job) => {
    if (action === 'View') {
      setSelectedJob(job);
      setIsViewModalOpen(true);
    } else if (action === 'Edit') {
      setSelectedJob(job);
      setIsEditModalOpen(true);
    } else if (action === 'Flag') {
      triggerAction('delist-item', job);
    }
  };

  const stats = [
    { label: 'Live Projects', value: '142', icon: Briefcase, color: 'brand' },
    { label: 'Completed', value: '2,840', icon: CheckCircle2, color: 'emerald' },
    { label: 'Total Volume', value: '12.4M', icon: DollarSign, color: 'blue' },
    { label: 'Disputed', value: '34', icon: AlertCircle, color: 'rose' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-brand-500/10 text-brand-600 rounded-xl shadow-sm">
              <Briefcase size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Project Hub</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Monitor the entire lifecycle of job postings, from creation to final milestone approval.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab(activeTab === 'management' ? 'audit' : 'management')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2",
              activeTab === 'audit' ? "bg-surface-dark text-white dark:bg-brand-600" : "bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-surface"
            )}
          >
            <Activity size={16} /> {activeTab === 'management' ? 'Audit Trail' : 'Back to Hub'}
          </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <AuditLogViewer 
             moduleFilter="JOB,CONTRACT,PROPOSAL" 
             title="Project & Job Audit"
             description="Monitoring job creations, contract awards, and milestone approvals."
           />
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center",
                  stat.color === 'brand' ? 'bg-brand-50 text-brand-600' :
                  stat.color === 'emerald' ? 'bg-emerald-50 text-success' :
                  stat.color === 'blue' ? 'bg-brand-50 text-brand-600' :
                  'bg-rose-50 text-rose-600'
                )}>
                  <stat.icon size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-surface dark:bg-zinc-800/50">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search project titles or clients..." 
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest font-black border-b border-zinc-200 dark:border-zinc-800">
                    <th className="p-4">Project Title / Posted</th>
                    <th className="p-4">Client</th>
                    <th className="p-4 text-right">Budget (KES)</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="p-4"><div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-48" /></td>
                        <td className="p-4"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-32" /></td>
                        <td className="p-4 text-right"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-20 ml-auto" /></td>
                        <td className="p-4 text-center"><div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded w-16 mx-auto" /></td>
                        <td className="p-4 text-right"><div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-24 ml-auto" /></td>
                      </tr>
                    ))
                  ) : (
                    MOCK_JOBS.map(job => (
                      <tr key={job.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 group transition-colors text-sm">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-900 dark:text-white group-hover:text-brand-600 transition-colors">{job.title}</span>
                            <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-500 font-medium">
                              <span className="flex items-center gap-1"><Clock size={10} /> {format(new Date(job.posted), 'MMM dd, yyyy')}</span>
                              <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-zinc-700 dark:text-zinc-300">
                          {job.client}
                        </td>
                        <td className="p-4 text-right font-black text-zinc-900 dark:text-white">
                          {job.budget.toLocaleString()}
                        </td>
                        <td className="p-4 text-center">
                          <span className={cn(
                            "inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                            job.status === 'active' ? 'bg-brand-50 text-brand-600' :
                            job.status === 'completed' ? 'bg-emerald-50 text-success' :
                            'bg-rose-50 text-rose-600'
                          )}>
                            {job.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleAction('View', job)} className="p-2 text-zinc-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all" title="View Detail"><Eye size={16} /></button>
                            <button onClick={() => handleAction('Edit', job)} className="p-2 text-zinc-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all" title="Edit Content"><Edit size={16} /></button>
                            <button onClick={() => handleAction('Flag', job)} className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delist/Flag"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <MarketplaceDetailModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        data={selectedJob}
        type="job"
      />

      <MarketplaceEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={selectedJob}
        type="job"
      />

      <AdminActionModal 
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        actionType={actionModal.type}
        data={actionModal.data}
        onSuccess={() => toast.success('Job status updated')}
      />
    </div>
  );
}
