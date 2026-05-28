import React, { useState } from 'react';
import { Briefcase, CheckCircle2, Mail, MessageSquare, Search, ShieldCheck, Star, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getShortlist } from './find-talent/talentMarketplaceData';

const tabs = ['all', 'interviewing', 'shortlisted', 'offered'];

const TalentShortlist = () => {
  const entries = getShortlist();
  const [activeTab, setActiveTab] = useState('all');
  const filteredEntries = activeTab === 'all' ? entries : entries.filter((entry) => entry.status === activeTab);

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Link className="text-sm font-medium text-brand-600 hover:text-brand-700 mb-2 inline-block" to="/find-talent">
              Back to talent hub
            </Link>
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Talent shortlist</h1>
            <p className="text-zinc-600">Candidates under consideration across your connected hiring pipeline.</p>
          </div>
          <Link className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors" to="/search-results">
            Invite more talent
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mb-8">
          <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface/50">
            <div className="flex gap-2 flex-wrap">
              {tabs.map((tab) => (
                <button
                  className={`px-4 py-2 text-sm rounded-lg shadow-sm ${
                    activeTab === tab ? 'bg-white border border-zinc-200 text-zinc-900 font-medium' : 'bg-transparent text-zinc-600 hover:bg-zinc-100'
                  }`}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab === 'all' ? `All (${entries.length})` : `${tab.charAt(0).toUpperCase() + tab.slice(1)} (${entries.filter((entry) => entry.status === tab).length})`}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
              <input className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm" placeholder="Search candidates..." type="text" />
            </div>
          </div>

          <div className="divide-y divide-zinc-100">
            {filteredEntries.map((entry) => (
              <div className="p-6 hover:bg-surface transition-colors flex flex-col md:flex-row gap-6 items-center" key={entry.talentId}>
                <div className="flex items-center gap-4 flex-1 w-full">
                  <img
                    alt={entry.talent.name}
                    className="w-16 h-16 rounded-full border border-zinc-200"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(entry.talent.name)}&background=random`}
                  />
                  <div>
                    <Link className="font-bold text-zinc-900 text-lg flex items-center gap-2 hover:text-brand-600 transition-colors" to={`/talent/${entry.talent.id}`}>
                      {entry.talent.name} <ShieldCheck className="w-4 h-4 text-success" title="Verified" />
                    </Link>
                    <p className="text-sm text-zinc-600 mb-1">{entry.talent.title}</p>
                    <div className="flex items-center gap-3 text-xs font-medium text-zinc-500 flex-wrap">
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-current" /> {entry.talent.rating}</span>
                      <span>{entry.talent.hourlyRate}/hr</span>
                      <span className="text-brand-600 bg-brand-50 px-2 py-0.5 rounded">{entry.match}% AI Match</span>
                      <span>{entry.job?.title}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="w-32">
                    {entry.status === 'interviewing' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider rounded-full border border-purple-200">
                        <MessageSquare className="w-3 h-3" /> Interviewing
                      </span>
                    ) : null}
                    {entry.status === 'shortlisted' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-wider rounded-full border border-zinc-200">
                        <CheckCircle2 className="w-3 h-3" /> Shortlisted
                      </span>
                    ) : null}
                    {entry.status === 'offered' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-200">
                        <Briefcase className="w-3 h-3" /> Offered
                      </span>
                    ) : null}
                  </div>

                  <div className="flex gap-2">
                    <Link className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-white hover:text-brand-600 transition-colors bg-surface" title="Message" to={`/talent/${entry.talent.id}/invite`}>
                      <Mail className="w-4 h-4" />
                    </Link>
                    <Link className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-white hover:text-success transition-colors bg-surface" title="Hire" to={`/talent/${entry.talent.id}/hire`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </Link>
                    <button className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-rose-600 transition-colors bg-surface" title="Remove" type="button">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentShortlist;
