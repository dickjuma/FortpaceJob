import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Repeat, Calendar, Clock, User, CheckCircle2, 
  Settings, Play, Pause, Plus, AlertCircle, RefreshCw
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function ClientRecurringProjectsPage() {
  const queryClient = useQueryClient();
  const [showNewModal, setShowNewModal] = useState(false);

  const { data: recurringJobsData } = useQuery({
    queryKey: ['client', 'recurringProjects'],
    queryFn: async () => {
      return [
        {
          id: 'REC-001',
          title: 'Weekly Blog Post Content',
          freelancer: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=s1' },
          frequency: 'Weekly',
          nextExecution: 'May 24, 2026',
          budget: '$150/cycle',
          status: 'Active',
          completedCycles: 12
        },
        {
          id: 'REC-002',
          title: 'Monthly Server Maintenance',
          freelancer: { name: 'David Kim', avatar: 'https://i.pravatar.cc/150?u=d2' },
          frequency: 'Monthly',
          nextExecution: 'June 1, 2026',
          budget: '$500/cycle',
          status: 'Active',
          completedCycles: 3
        },
        {
          id: 'REC-003',
          title: 'Bi-weekly Podcast Editing',
          freelancer: { name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?u=a3' },
          frequency: 'Bi-weekly',
          nextExecution: 'May 28, 2026',
          budget: '$300/cycle',
          status: 'Paused',
          completedCycles: 8
        }
      ];
    }
  });

  const jobs = recurringJobsData || [];

  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(['client', 'recurringProjects'], old => 
        old?.map(j => j.id === id ? { ...j, status: j.status === 'Active' ? 'Paused' : 'Active' } : j)
      );
    }
  });

  const toggleStatus = (id) => {
    toggleMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#4C1D95]" /> Recurring Projects
            </h1>
            <p className="text-zinc-500 font-medium">Automate repeated hiring and milestone renewals.</p>
          </div>
          <button 
            onClick={() => setShowNewModal(true)}
            className="px-6 py-3 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> New Recurring Job
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Main Content: Jobs List */}
        <div className="flex-1 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Active Automations</p>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white">2</h3>
            </div>
            <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Monthly Spend (Est)</p>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white">$1,100</h3>
            </div>
            <div className="bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10 p-6 rounded-2xl border border-[#4C1D95]/20 dark:border-[#4C1D95]/20/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#4C1D95] dark:text-[#4C1D95] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#4C1D95] dark:text-[#4C1D95] mb-1">Upcoming Billing</p>
                  <p className="text-xs font-medium text-[#4C1D95]/80 dark:text-[#4C1D95]/80">$150 will be charged on May 24 for "Weekly Blog Post".</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <motion.div 
                key={job.id} layout
                className={cn(
                  "bg-white dark:bg-surface-dark rounded-2xl border shadow-sm overflow-hidden flex flex-col md:flex-row transition-colors",
                  job.status === 'Active' ? "border-zinc-200 dark:border-zinc-800" : "border-zinc-100 dark:border-zinc-800/50 opacity-75"
                )}
              >
                
                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-bold text-[#4C1D95] bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10 px-2 py-1 rounded-md inline-block mb-2">
                        {job.frequency}
                      </span>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{job.title}</h3>
                      <p className="text-xs font-mono text-zinc-400 mt-1">{job.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-zinc-900 dark:text-white">{job.budget}</p>
                      <p className="text-xs font-bold text-zinc-500">{job.completedCycles} cycles completed</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-zinc-50 dark:border-zinc-800/50">
                    <div className="flex items-center gap-2">
                      <img src={job.freelancer.avatar} alt="Freelancer" className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700" />
                      <div>
                        <p className="text-xs font-bold text-zinc-400 uppercase leading-none mb-1">Assigned To</p>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white leading-none">{job.freelancer.name}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase leading-none mb-1">Next Execution</p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1 leading-none">
                        <Calendar className="w-3.5 h-3.5 text-[#4C1D95]" /> {job.nextExecution}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="p-6 md:w-56 bg-surface/50 dark:bg-surface-dark/50 flex flex-col justify-center items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className={cn(
                      "text-xs font-bold uppercase tracking-wider mb-2",
                      job.status === 'Active' ? "text-success" : "text-amber-500"
                    )}>
                      {job.status}
                    </span>
                    <button 
                      onClick={() => toggleStatus(job.id)}
                      className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95",
                        job.status === 'Active' ? "bg-amber-500 shadow-amber-500/30" : "bg-success shadow-emerald-500/30"
                      )}
                    >
                      {job.status === 'Active' ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-1" />}
                    </button>
                  </div>
                  <button className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1 mt-2">
                    <Settings className="w-3 h-3" /> Automation Settings
                  </button>
                </div>

              </motion.div>
            ))}
          </div>

        </div>

        {/* Right Column: Settings */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Global Rules</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded text-[#4C1D95] focus:ring-[#4C1D95] border-zinc-300" />
                <div>
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Require Approval</p>
                  <p className="text-xs text-zinc-500 font-medium mt-1">Review work before the next cycle starts and payment is released.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded text-[#4C1D95] focus:ring-[#4C1D95] border-zinc-300" />
                <div>
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Auto-fund Escrow</p>
                  <p className="text-xs text-zinc-500 font-medium mt-1">Automatically charge primary payment method 1 day before next execution.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


