import React from 'react';
import { Bookmark, Bell, Edit2, Trash2, ArrowRight, Play, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const SAVED_SEARCHES = [
  {
    id: 1,
    name: 'Senior React Native Devs',
    query: 'React Native Developer',
    filters: ['Job Success: 90%+', 'Hourly: $30-$60', 'Location: US/Canada'],
    newResults: 12,
    lastRun: '2 hours ago',
    alertFrequency: 'Daily'
  },
  {
    id: 2,
    name: 'Local Emergency Plumbers',
    query: 'Plumber',
    filters: ['Distance: 10 miles', 'Availability: Now', 'Rating: 4.5+'],
    newResults: 3,
    lastRun: '1 day ago',
    alertFrequency: 'Instant'
  },
  {
    id: 3,
    name: 'Figma UX Designers',
    query: 'UX/UI Designer',
    filters: ['Category: Design', 'Budget: $1k-$5k'],
    newResults: 0,
    lastRun: '1 week ago',
    alertFrequency: 'Weekly'
  }
];

const SavedSearches = () => {
  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">Saved Searches</h1>
              <p className="text-zinc-600">Manage your saved queries, filters, and email alerts.</p>
            </div>
            <button className="bg-white border border-zinc-200 hover:bg-surface text-zinc-700 px-4 py-2 rounded-lg font-medium shadow-sm flex items-center gap-2 transition-colors">
              <Settings className="w-4 h-4" />
              Alert Settings
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {SAVED_SEARCHES.map((search, index) => (
              <div key={search.id} className={`p-6 ${index !== SAVED_SEARCHES.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-bold text-zinc-900">{search.name}</h2>
                      {search.newResults > 0 && (
                        <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {search.newResults} New
                        </span>
                      )}
                    </div>
                    
                    <div className="text-zinc-500 text-sm mb-3">
                      <span className="font-medium text-zinc-700">Query:</span> "{search.query}"
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {search.filters.map(filter => (
                        <span key={filter} className="bg-zinc-100 text-zinc-600 text-xs font-medium px-2 py-1 rounded">
                          {filter}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-4 md:w-48">
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <Bell className="w-4 h-4" />
                      {search.alertFrequency} Alerts
                    </div>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button className="flex-1 md:flex-none justify-center flex items-center gap-1 bg-brand-50 hover:bg-brand-100 text-brand-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <Play className="w-4 h-4" /> Run
                      </button>
                      <button className="p-2 text-zinc-400 hover:text-zinc-600 border border-zinc-200 rounded-lg hover:bg-surface">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-zinc-400 hover:text-rose-500 border border-zinc-200 rounded-lg hover:bg-rose-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 bg-brand-50 border border-brand-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-zinc-900 text-lg mb-1">Let AI build your pipeline</h3>
              <p className="text-zinc-600">Upgrade to Enterprise to automatically source candidates into a pipeline based on your saved searches.</p>
            </div>
            <Link to="/enterprise" className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap">
              Explore Enterprise
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default SavedSearches;
