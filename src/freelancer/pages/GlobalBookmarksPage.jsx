import React, { useState } from 'react';
import { 
  Bookmark, Briefcase, User, Star, Trash2, Globe, ShieldCheck, ChevronRight, X, ArrowUpRight
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function GlobalBookmarksPage() {
  const [bookmarks, setBookmarks] = useState({
    jobs: [
      { id: 1, title: 'Senior React Developer (Next.js focus)', client: 'Vercel Ecosystem', budget: 95, type: 'Hourly Rate' },
      { id: 2, title: 'Figma to React Frontend Specialist', client: 'Stripe Orchestrations', budget: 3500, type: 'Fixed Price' }
    ],
    gigs: [
      { id: 1, title: 'I will build a full-stack SaaS application in React and Node.js', price: 950, rating: 5.0, reviews: 45 }
    ],
    talent: [
      { id: 1, name: 'Elena Rodriguez', title: 'Lead Developer & PM', location: 'London, UK', success: '100%' }
    ]
  });

  const [activeTab, setActiveTab] = useState('jobs');

  const removeBookmark = (id, type, name) => {
    setBookmarks(prev => {
      const updatedList = prev[type].filter(item => item.id !== id);
      toast.success(`Removed bookmark: ${name}`);
      return {
        ...prev,
        [type]: updatedList
      };
    });
  };

  const handleActionSimulate = (name) => {
    toast.success(`Opening: ${name}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-8 h-8 text-success" />
            Global Bookmarks
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Access and manage your saved vacancies, gig templates, and profiles ledger.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border mb-6">
        {[
          { key: 'jobs', label: `Saved Jobs (${bookmarks.jobs.length})`, icon: Briefcase },
          { key: 'gigs', label: `Services (${bookmarks.gigs.length})`, icon: Globe },
          { key: 'talent', label: `Talent Profiles (${bookmarks.talent.length})`, icon: User }
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
        {activeTab === 'jobs' && bookmarks.jobs.map(job => (
          <Card key={job.id} className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:border-success/30 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-black text-sm text-text-primary group-hover:text-success transition-colors cursor-pointer">{job.title}</h3>
              <p className="text-xs text-text-secondary font-bold mt-1">Client: {job.client} • Budget: ${job.budget} ({job.type})</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleActionSimulate(job.title)} className="p-2 bg-light-gray/60 hover:bg-success hover:text-white rounded-xl transition-all text-text-secondary"><ArrowUpRight size={16} /></button>
              <button onClick={() => removeBookmark(job.id, 'jobs', job.title)} className="p-2 text-text-secondary hover:text-[#e63946] hover:bg-light-gray rounded-xl transition-all"><Trash2 size={16} /></button>
            </div>
          </Card>
        ))}

        {activeTab === 'gigs' && bookmarks.gigs.map(gig => (
          <Card key={gig.id} className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:border-success/30 transition-all flex justify-between items-center group">
            <div>
              <h3 className="font-black text-sm text-text-primary group-hover:text-success transition-colors cursor-pointer">{gig.title}</h3>
              <p className="text-xs text-text-secondary font-bold mt-1">Starting At: ${gig.price} • Rating: {gig.rating} ({gig.reviews} reviews)</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleActionSimulate(gig.title)} className="p-2 bg-light-gray/60 hover:bg-success hover:text-white rounded-xl transition-all text-text-secondary"><ArrowUpRight size={16} /></button>
              <button onClick={() => removeBookmark(gig.id, 'gigs', gig.title)} className="p-2 text-text-secondary hover:text-[#e63946] hover:bg-light-gray rounded-xl transition-all"><Trash2 size={16} /></button>
            </div>
          </Card>
        ))}

        {activeTab === 'talent' && bookmarks.talent.map(tal => (
          <Card key={tal.id} className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:border-success/30 transition-all flex justify-between items-center group">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm text-text-primary group-hover:text-success transition-colors cursor-pointer">{tal.name}</h3>
                <ShieldCheck className="w-14 h-14 bg-success/10 text-success rounded-xl shrink-0 flex items-center justify-center font-bold" />
              </div>
              <p className="text-xs text-text-secondary font-bold mt-0.5">{tal.title} • {tal.location}</p>
              <p className="text-[10px] text-success font-black uppercase tracking-wider mt-1">Job Success: {tal.success}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleActionSimulate(tal.name)} className="p-2 bg-light-gray/60 hover:bg-success hover:text-white rounded-xl transition-all text-text-secondary"><ArrowUpRight size={16} /></button>
              <button onClick={() => removeBookmark(tal.id, 'talent', tal.name)} className="p-2 text-text-secondary hover:text-[#e63946] hover:bg-light-gray rounded-xl transition-all"><Trash2 size={16} /></button>
            </div>
          </Card>
        ))}

        {bookmarks[activeTab].length === 0 && (
          <div className="text-center py-12">
            <Bookmark className="w-12 h-12 text-text-secondary mx-auto mb-3" />
            <h4 className="font-bold text-text-primary">No bookmarks saved</h4>
            <p className="text-xs text-text-secondary mt-1">Bookmark vacancies or profiles to manage them here.</p>
          </div>
        )}
      </div>

    </div>
  );
}
