import React, { useState } from 'react';
import { 
  Globe, Search, Plus, X, Award, Briefcase, ChevronRight, Star, DollarSign, Clock, Eye
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function RemoteJobsPage() {
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Senior React Developer (Next.js focus)', client: 'Vercel Ecosystem', budget: 95, type: 'Hourly Rate', timezone: 'EST Overlap', async: 'Preferred' },
    { id: 2, title: 'Node.js backend API designer', client: 'Stripe Orchestrations', budget: 12000, type: 'Fixed Price', timezone: 'Global Async', async: 'Required' },
    { id: 3, title: 'AWS Cloud DevOps & CI/CD Builder', client: 'SaaS Flow systems', budget: 85, type: 'Hourly Rate', timezone: 'CET Overlap', async: 'Optional' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleApplySimulate = (title) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: 'Submitting remote proposal...',
        success: `Applied to "${title}" successfully! 🚀`,
        error: 'Failed to submit proposal.'
      }
    );
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Globe className="w-8 h-8 text-success" />
            Remote Jobs Directory
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Browse fully remote, asynchronous, and timezone-flexible engineering opportunities.
          </p>
        </div>
      </div>

      <div className="mb-6 max-w-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -tranzinc-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search remote contracts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-border rounded-xl bg-light-gray/40 text-sm focus:outline-none focus:border-success text-text-primary"
          />
        </div>
      </div>

      {/* Jobs list */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="bg-white border border-border p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border bg-success/10 text-success border-success/20">
                  {job.timezone}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border bg-[#2bb75c]/5 text-[#2bb75c] border-[#2bb75c]/20">
                  Async: {job.async}
                </span>
              </div>
              
              <h3 className="font-black text-sm text-text-primary leading-tight group-hover:text-success transition-colors cursor-pointer">{job.title}</h3>
              <p className="text-xs text-text-secondary font-bold">Client: {job.client}</p>
            </div>

            <div className="flex items-center gap-4 self-end md:self-center shrink-0">
              <div className="text-right">
                <p className="text-xs font-black text-text-secondary uppercase tracking-widest">{job.type}</p>
                <p className="font-black text-lg text-text-primary">${job.budget.toLocaleString()}{job.type === 'Hourly Rate' && '/hr'}</p>
              </div>
              <button 
                onClick={() => handleApplySimulate(job.title)}
                className="px-4 py-2 bg-success hover:bg-success/95 text-white font-black rounded-xl text-xs transition-colors shadow-lg shadow-[#2bb75c]/15 flex items-center gap-1"
              >
                Apply Remote
              </button>
            </div>
          </Card>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-text-secondary mx-auto mb-3" />
            <h4 className="font-bold text-text-primary">No remote jobs discovered</h4>
            <p className="text-xs text-text-secondary mt-1">Refine your search parameters or try another keyword.</p>
          </div>
        )}
      </div>

    </div>
  );
}

