import React, { useState } from 'react';
import { 
  MapPin, Search, Plus, X, Award, Briefcase, ChevronRight, Star, DollarSign, Clock, Eye
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function NearbyJobsPage() {
  const [jobs, setJobs] = useState([
    { id: 1, title: 'On-site Network infrastructure Upgrade', client: 'Apex Holdings', distance: '2.4 miles', budget: 1800, type: 'Fixed Price', duration: '3 days', location: 'San Francisco, CA' },
    { id: 2, title: 'Corporate Video Production & Photography', client: 'Cloudfront Media', distance: '5.1 miles', budget: 3500, type: 'Fixed Price', duration: '5 days', location: 'Oakland, CA' },
    { id: 3, title: 'Enterprise Firewall Security Audit', client: 'Bay Area Cyberlabs', distance: '0.8 miles', budget: 150, type: 'Hourly Rate', duration: '20 hours', location: 'San Francisco, CA' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleApplySimulate = (title) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: 'Submitting nearby proposal details...',
        success: `Successfully applied to "${title}"! 🚀`,
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
            <MapPin className="w-8 h-8 text-success" />
            Nearby Contracts (Offline)
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Discover in-person, on-site contracts matching your location coordinates.
          </p>
        </div>
      </div>

      <div className="mb-6 max-w-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -tranzinc-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search nearby positions..." 
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
                  {job.distance} away
                </span>
                <span className="text-xs text-text-secondary font-bold flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
              </div>
              
              <h3 className="font-black text-sm text-text-primary leading-tight group-hover:text-success transition-colors cursor-pointer">{job.title}</h3>
              <p className="text-xs text-text-secondary font-bold">Client: {job.client} • Duration: {job.duration}</p>
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
                Apply On-site
              </button>
            </div>
          </Card>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-text-secondary mx-auto mb-3" />
            <h4 className="font-bold text-text-primary">No nearby jobs discovered</h4>
            <p className="text-xs text-text-secondary mt-1">Try expanding your active geographical parameters.</p>
          </div>
        )}
      </div>

    </div>
  );
}

