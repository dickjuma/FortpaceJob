import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, DollarSign, Briefcase, Filter, ChevronRight, Bookmark, ThumbsUp, ThumbsDown, Zap, ShieldCheck, Target } from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';
import { useFreelancer } from '../context/FreelancerContext';

// --- Skeleton Loaders ---
const JobCardSkeleton = () => (
  <Card className="animate-pulse flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <div className="h-6 w-3/4 bg-light-gray rounded-md"></div>
        <div className="h-4 w-1/4 bg-light-gray rounded-md"></div>
      </div>
      <div className="h-8 w-8 bg-light-gray rounded-full"></div>
    </div>
    <div className="flex gap-4">
      <div className="h-4 w-20 bg-light-gray rounded-md"></div>
      <div className="h-4 w-20 bg-light-gray rounded-md"></div>
      <div className="h-4 w-20 bg-light-gray rounded-md"></div>
    </div>
    <div className="space-y-2 mt-2">
      <div className="h-4 w-full bg-light-gray rounded-md"></div>
      <div className="h-4 w-5/6 bg-light-gray rounded-md"></div>
    </div>
    <div className="flex gap-2 mt-4">
      <div className="h-6 w-16 bg-light-gray rounded-full"></div>
      <div className="h-6 w-16 bg-light-gray rounded-full"></div>
    </div>
  </Card>
);

// --- Mock Data ---
const MOCK_JOBS = [
  { 
    id: 1, 
    title: 'Senior React Developer for FinTech Dashboard', 
    client: 'Global Finance Corp', 
    budget: 'KES 500,000', 
    type: 'Fixed Price',
    postedAt: '2 mins ago',
    description: 'We are looking for an experienced React developer to help build our new analytics dashboard. Must have experience with complex state management.',
    skills: ['React', 'TypeScript', 'Tailwind'],
    verified: true,
    matchScore: 98,
    isUrgent: true
  },
  { 
    id: 2, 
    title: 'UI/UX Designer for SaaS Mobile App', 
    client: 'HealthSync App', 
    budget: 'KES 8,500/hr', 
    type: 'Hourly',
    postedAt: '15 mins ago',
    description: 'Need a talented designer to revamp our iOS and Android mobile applications. Looking for modern, clean, and accessible design patterns.',
    skills: ['Figma', 'UI/UX', 'Mobile Design'],
    verified: true,
    matchScore: 85,
    isUrgent: false
  },
  { 
    id: 3, 
    title: 'Node.js Backend Architecture Optimization', 
    client: 'TechFlow Solutions', 
    budget: 'KES 350,000', 
    type: 'Fixed Price',
    postedAt: '1 hour ago',
    description: 'Our Express.js backend is experiencing bottleneck issues. We need an expert to refactor the database queries and implement caching layers.',
    skills: ['Node.js', 'Express', 'Redis', 'PostgreSQL'],
    verified: false,
    matchScore: 72,
    isUrgent: false
  }
];

export default function JobsPage() {
  const { accountType, isOfflineProvider } = useFreelancer();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Matches');
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());

  useEffect(() => {
    // Simulate initial data load
    const fetchJobs = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 1200));
      setJobs(MOCK_JOBS);
      setLoading(false);
    };
    fetchJobs();
  }, [activeFilter]);

  const toggleSaveJob = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        toast('Job removed from saved list');
      } else {
        newSet.add(id);
        toast.success('Job saved successfully');
      }
      return newSet;
    });
  };

  const handleApply = (id, e) => {
    e.preventDefault();
    toast.success('Redirecting to application flow...', { icon: '🚀' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <Toaster position="top-right" />
      
      {/* Premium Header Banner */}
      <div className="bg-navy border border-border rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden group">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-accent-purple/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-accent-purple/30 transition-colors duration-700"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-accent-red/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-accent-red/20 transition-colors duration-700"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10 flex items-center gap-2">
              <Zap size={12} className="text-accent-red" /> AI-Powered Matching
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">Find enterprise projects that match your expertise.</h1>
          <p className="text-sm font-medium text-text-secondary mb-8 max-w-2xl text-white/80">We've scanned thousands of postings and curated these specifically for your {accountType} profile.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 bg-white/5 p-2 rounded-xl backdrop-blur-md border border-white/10">
            <div className="relative flex-1 group/input">
              <Search className="absolute left-4 top-1/2 -tranzinc-y-1/2 w-5 h-5 text-white/50 group-focus-within/input:text-white transition-colors" />
              <input 
                type="text" 
                placeholder="Search by keywords, skills, or clients..." 
                className="w-full pl-12 pr-4 py-3.5 rounded-lg bg-transparent border-none text-white font-medium placeholder:text-white/50 focus:outline-none focus:ring-0 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && toast.success('Searching...')}
              />
            </div>
            <Button variant="primary" size="lg" className="bg-white text-navy hover:bg-light-gray rounded-lg shadow-lg" onClick={() => toast.success('Searching...')}>
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        
        {/* Left Sidebar - Filters (Sticky) */}
        <div className="w-full xl:w-80 shrink-0 sticky top-24">
          <Card className="bg-white/60 backdrop-blur-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-text-primary uppercase tracking-widest text-xs flex items-center gap-2">
                <Filter size={14} /> Filters
              </h3>
              <button className="text-[10px] font-bold text-text-secondary uppercase tracking-widest hover:text-accent-red transition-colors" onClick={() => toast('Filters cleared')}>Clear All</button>
            </div>

            <div className="space-y-8">
              {isOfflineProvider && (
                <div>
                  <h4 className="font-bold text-text-primary text-xs tracking-widest uppercase mb-3">Work Location</h4>
                  <div className="space-y-3">
                    {['Remote Only', 'Hybrid', 'On-Site / Nearby'].map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded-md border-2 border-border group-hover:border-accent-purple flex items-center justify-center transition-colors">
                          {type === 'Remote Only' && <div className="w-2.5 h-2.5 bg-accent-purple rounded-sm" />}
                        </div>
                        <span className="text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-bold text-text-primary text-xs tracking-widest uppercase mb-3">Job Type</h4>
                <div className="space-y-3">
                  {['Any Job Type', 'Hourly', 'Fixed Price'].map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 rounded-md border-2 border-border group-hover:border-accent-purple flex items-center justify-center transition-colors">
                        {type === 'Any Job Type' && <div className="w-2.5 h-2.5 bg-accent-purple rounded-sm" />}
                      </div>
                      <span className="text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-text-primary text-xs tracking-widest uppercase mb-3">Client Info</h4>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded-md border-2 border-border group-hover:border-accent-purple flex items-center justify-center transition-colors">
                    <div className="w-2.5 h-2.5 bg-accent-purple rounded-sm" />
                  </div>
                  <span className="text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors">Payment Verified</span>
                </label>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Feed - Job Listings */}
        <div className="flex-1 w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-text-primary tracking-tight">Jobs matching your profile</h2>
            <div className="flex bg-light-gray/50 rounded-lg p-1 border border-border backdrop-blur-sm">
              {['All Matches', 'Most Recent', 'Saved'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all whitespace-nowrap",
                    activeFilter === filter ? "bg-white text-navy shadow-sm border border-border" : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <>
                <JobCardSkeleton />
                <JobCardSkeleton />
                <JobCardSkeleton />
              </>
            ) : jobs.length === 0 ? (
              <Card className="text-center py-12">
                <Search className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-text-primary">No jobs found</h3>
                <p className="text-sm text-text-secondary mt-1">Try adjusting your filters or search terms.</p>
              </Card>
            ) : (
              jobs.map(job => (
                <a href="#" key={job.id} onClick={(e) => { e.preventDefault(); toast(`Viewing Job Details: ${job.id}`); }} className="block group">
                  <Card hover className="bg-white border-border shadow-sm group-hover:border-accent-purple/50 transition-colors">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        {job.isUrgent && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-accent-red/10 text-accent-red px-2 py-0.5 rounded-md uppercase tracking-widest mb-2 animate-pulse">
                            Urgent Hiring
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-text-primary group-hover:text-navy transition-colors tracking-tight">{job.title}</h3>
                        <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-text-secondary">
                          <span className={job.verified ? "text-navy flex items-center gap-1" : ""}>
                            {job.client}
                            {job.verified && <ShieldCheck size={12} className="text-success" />}
                          </span>
                          <span>•</span>
                          <span>Posted {job.postedAt}</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => toggleSaveJob(job.id, e)}
                        className={cn(
                          "p-2 rounded-full transition-colors",
                          savedJobs.has(job.id) ? "bg-accent-purple/10 text-accent-purple" : "bg-light-gray text-text-secondary hover:bg-border hover:text-navy"
                        )}
                      >
                        <Bookmark size={18} className={savedJobs.has(job.id) ? "fill-current" : ""} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-4 text-xs font-bold text-text-primary">
                      <div className="flex items-center gap-1.5 bg-light-gray/50 px-2 py-1 rounded-md border border-border">
                        <DollarSign size={14} className="text-text-secondary" /> {job.type}: {job.budget}
                      </div>
                      <div className="flex items-center gap-1.5 bg-success/10 text-success px-2 py-1 rounded-md border border-success/20">
                        <Target size={14} /> {job.matchScore}% Match
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary mb-5 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map(skill => (
                          <span key={skill} className="text-[10px] font-bold bg-light-gray text-text-secondary px-2.5 py-1 rounded-md uppercase tracking-widest border border-border">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <Button variant="primary" size="sm" className="shrink-0 shadow-sm" onClick={(e) => handleApply(job.id, e)}>
                        Apply Now
                      </Button>
                    </div>
                  </Card>
                </a>
              ))
            )}

            {!loading && jobs.length > 0 && (
              <div className="flex justify-center pt-8">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast.loading('Loading more jobs...', { duration: 1000 })}>
                  Load More Jobs
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
