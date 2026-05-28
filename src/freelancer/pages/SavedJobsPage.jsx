import React, { useState, useEffect } from 'react';
import { Bookmark, Clock, MapPin, DollarSign, Briefcase, Heart, Search, Filter, Trash2, Send } from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// --- Skeleton Loader ---
const SavedJobsSkeleton = () => (
  <div className="space-y-8 animate-pulse pb-12">
    <div className="flex justify-between items-end">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-light-gray rounded-md"></div>
        <div className="h-4 w-48 bg-light-gray rounded-md"></div>
      </div>
      <div className="h-10 w-32 bg-light-gray rounded-md"></div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map(i => <div key={i} className="h-48 bg-light-gray rounded-2xl"></div>)}
    </div>
  </div>
);

// --- Mock Data ---
const MOCK_SAVED_JOBS = [
  {
    id: 'JOB-901',
    title: 'Senior React Developer for Fintech SaaS',
    company: 'PayFlow Global',
    type: 'Remote',
    budget: '$80 - $120 / hr',
    duration: '6+ Months',
    savedAt: '2 hours ago',
    tags: ['React', 'TypeScript', 'Fintech', 'Node.js']
  },
  {
    id: 'JOB-902',
    title: 'UI/UX Designer for Healthcare Dashboard',
    company: 'HealthSync App',
    type: 'Hybrid (New York)',
    budget: '$4,500 Fixed',
    duration: '1 Month',
    savedAt: '1 day ago',
    tags: ['Figma', 'UI Design', 'Healthcare', 'Prototyping']
  },
  {
    id: 'JOB-903',
    title: 'Smart Contract Auditor',
    company: 'Nexus Web3',
    type: 'Remote',
    budget: '$150 / hr',
    duration: '2 Weeks',
    savedAt: '3 days ago',
    tags: ['Solidity', 'Blockchain', 'Security', 'Auditing']
  }
];

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 800));
      setSavedJobs(MOCK_SAVED_JOBS);
      setLoading(false);
    };
    fetchSavedJobs();
  }, []);

  const handleUnsave = (id) => {
    toast.success('Job removed from saved list.', { icon: '🗑️' });
    setSavedJobs(prev => prev.filter(job => job.id !== id));
  };

  const handleApply = (id) => {
    navigate(`/freelancer/jobs/${id}`);
  };

  const filteredJobs = savedJobs.filter(job => {
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) && !job.company.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (loading) return <SavedJobsSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <Toaster position="top-right" />
      
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-red/10 text-accent-red rounded-xl shadow-sm border border-accent-red/20">
              <Heart size={24} className="fill-accent-red" />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Saved Jobs</h1>
          </div>
          <p className="text-sm text-text-secondary font-medium">
            Keep track of jobs you're interested in and apply when you're ready.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-border">
        <div className="relative w-full sm:w-96 group/search">
          <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-text-secondary group-focus-within/search:text-navy transition-colors" />
          <input 
            type="text" 
            placeholder="Search saved jobs..." 
            className="w-full pl-9 pr-4 py-2 bg-light-gray/50 border border-border rounded-lg text-sm font-medium focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" icon={<Filter size={14} />} className="hidden sm:flex">Filter List</Button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <Card className="text-center py-20 bg-white/50 backdrop-blur-md border-border shadow-sm">
            <Bookmark className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-text-primary">No saved jobs found</h3>
            <p className="text-sm text-text-secondary mt-1 mb-6">You haven't bookmarked any jobs yet. Start exploring the marketplace!</p>
            <Button variant="primary" onClick={() => navigate('/freelancer/jobs')}>Find Work</Button>
          </Card>
        ) : (
          filteredJobs.map(job => (
            <Card key={job.id} className="p-6 bg-white border-border shadow-sm hover:border-navy/50 transition-all hover:shadow-md group">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                
                {/* Job Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-accent-purple uppercase tracking-widest">{job.company}</span>
                    <span className="w-1 h-1 rounded-full bg-border"></span>
                    <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest bg-light-gray px-2 py-0.5 rounded-md">Saved {job.savedAt}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-navy transition-colors cursor-pointer" onClick={() => handleApply(job.id)}>
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
                      <MapPin size={14} className="text-navy" /> {job.type}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-md">
                      <DollarSign size={14} /> {job.budget}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
                      <Clock size={14} className="text-navy" /> {job.duration}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-light-gray text-text-secondary rounded-lg text-[10px] font-bold uppercase tracking-widest border border-border">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col justify-end gap-3 shrink-0">
                  <Button variant="primary" onClick={() => handleApply(job.id)} className="w-full lg:w-40 shadow-md">
                    Apply Now
                  </Button>
                  <Button variant="outline" onClick={() => handleUnsave(job.id)} className="w-full lg:w-40 border-border text-text-secondary hover:text-accent-red hover:border-accent-red/50 hover:bg-accent-red/5">
                    <Trash2 size={16} className="mr-2" /> Remove
                  </Button>
                </div>

              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
