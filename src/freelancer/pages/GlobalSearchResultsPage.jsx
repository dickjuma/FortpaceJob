import React, { useState } from 'react';
import { 
  Search, Briefcase, User, Star, Globe, ShieldCheck, ChevronRight, X, ArrowUpRight
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function GlobalSearchResultsPage() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [query, setQuery] = useState('React');

  const results = {
    jobs: [
      { id: 1, title: 'Senior React Developer (Next.js focus)', client: 'Vercel Ecosystem', budget: 95, type: 'Hourly Rate' },
      { id: 2, title: 'Figma to React Frontend Specialist', client: 'Stripe Orchestrations', budget: 3500, type: 'Fixed Price' }
    ],
    gigs: [
      { id: 1, title: 'I will build a full-stack SaaS application in React and Node.js', price: 950, rating: 5.0, reviews: 45 },
      { id: 2, title: 'I will fix complex state bugs and optimize your React frontend', price: 150, rating: 4.9, reviews: 89 }
    ],
    talent: [
      { id: 1, name: 'Alex Morgan', title: 'Senior Full-Stack React Developer', location: 'San Francisco, CA', success: '98%' },
      { id: 2, name: 'Sarah Jenkins', title: 'Lead Developer & Architect', location: 'London, UK', success: '100%' }
    ]
  };

  const handleActionSimulate = (name) => {
    toast.success(`Redirecting to: ${name}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Search Header Input */}
      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm mb-8">
        <h1 className="text-xl font-black text-text-primary mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-success" />
          Global Search Results
        </h1>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -tranzinc-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs, talents, services..."
            className="pl-11 pr-4 py-3 w-full border border-border rounded-xl bg-light-gray focus:outline-none focus:border-success focus:bg-white text-sm text-text-primary font-bold"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border mb-6">
        {[
          { key: 'jobs', label: `Jobs (${results.jobs.length})`, icon: Briefcase },
          { key: 'gigs', label: `Gigs (${results.gigs.length})`, icon: Globe },
          { key: 'talent', label: `Talent (${results.talent.length})`, icon: User }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "pb-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-1.5",
              activeTab === tab.key 
                ? "border-success text-text-primary" 
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="space-y-4">
        {activeTab === 'jobs' && results.jobs.map(job => (
          <Card key={job.id} className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:border-success/30 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-black text-sm text-text-primary group-hover:text-success transition-colors cursor-pointer">{job.title}</h3>
              <p className="text-xs text-text-secondary font-bold mt-1">Client: {job.client} • Budget: ${job.budget} ({job.type})</p>
            </div>
            <button onClick={() => handleActionSimulate(job.title)} className="p-2 bg-light-gray/60 hover:bg-success hover:text-white rounded-xl transition-all text-text-secondary"><ArrowUpRight size={16} /></button>
          </Card>
        ))}

        {activeTab === 'gigs' && results.gigs.map(gig => (
          <Card key={gig.id} className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:border-success/30 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-black text-sm text-text-primary group-hover:text-success transition-colors cursor-pointer">{gig.title}</h3>
              <p className="text-xs text-text-secondary font-bold mt-1">Starting At: ${gig.price} • Rating: {gig.rating} ({gig.reviews} reviews)</p>
            </div>
            <button onClick={() => handleActionSimulate(gig.title)} className="p-2 bg-light-gray/60 hover:bg-success hover:text-white rounded-xl transition-all text-text-secondary"><ArrowUpRight size={16} /></button>
          </Card>
        ))}

        {activeTab === 'talent' && results.talent.map(tal => (
          <Card key={tal.id} className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:border-success/30 transition-all flex justify-between items-center group">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm text-text-primary group-hover:text-success transition-colors cursor-pointer">{tal.name}</h3>
                <ShieldCheck size={14} className="text-success" />
              </div>
              <p className="text-xs text-text-secondary font-bold mt-0.5">{tal.title} • {tal.location}</p>
              <p className="text-[10px] text-success font-black uppercase tracking-wider mt-1">Job Success: {tal.success}</p>
            </div>
            <button onClick={() => handleActionSimulate(tal.name)} className="p-2 bg-light-gray/60 hover:bg-success hover:text-white rounded-xl transition-all text-text-secondary"><ArrowUpRight size={16} /></button>
          </Card>
        ))}
      </div>

    </div>
  );
}
