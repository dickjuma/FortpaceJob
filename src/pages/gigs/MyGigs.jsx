import React, { useState } from 'react';
import { Settings, BarChart2, Edit3, MoreVertical, Plus, Play, Pause, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_GIGS = [
  { id: 1, title: 'I will design a modern minimalist logo', img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=200', status: 'active', impressions: 4500, clicks: 320, orders: 12, rating: 4.9 },
  { id: 2, title: 'I will build a responsive React web app', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200', status: 'active', impressions: 2100, clicks: 150, orders: 5, rating: 5.0 },
  { id: 3, title: 'I will edit your YouTube videos', img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200', status: 'paused', impressions: 890, clicks: 45, orders: 1, rating: 4.5 },
  { id: 4, title: 'I will write SEO articles', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200', status: 'draft', impressions: 0, clicks: 0, orders: 0, rating: 0 },
];

const MyGigs = () => {
  const [activeTab, setActiveTab] = useState('active'); // active, paused, draft

  const displayGigs = MOCK_GIGS.filter(g => g.status === activeTab);

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-zinc-900 mb-1">My Gigs</h1>
              <p className="text-zinc-600 font-medium">Manage your active services, edit drafts, and track performance.</p>
            </div>
            <Link to="/gigs/create" className="px-6 py-3 bg-success hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" /> Create a New Gig
            </Link>
          </div>

          {/* Quick Analytics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="text-sm font-bold text-zinc-500 mb-1">Active Gigs</div>
              <div className="text-3xl font-black text-zinc-900">2</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="text-sm font-bold text-zinc-500 mb-1">Total Impressions</div>
              <div className="text-3xl font-black text-success">6.6k</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="text-sm font-bold text-zinc-500 mb-1">Total Orders</div>
              <div className="text-3xl font-black text-brand-600">17</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="text-sm font-bold text-zinc-500 mb-1">Avg Rating</div>
              <div className="text-3xl font-black text-amber-500">4.9</div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-zinc-200 hide-scrollbar bg-surface/50">
              {['active', 'paused', 'draft'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 font-bold text-sm whitespace-nowrap transition-colors border-b-2 capitalize ${activeTab === tab ? 'border-emerald-600 text-success bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-surface'}`}
                >
                  {tab} ({MOCK_GIGS.filter(g => g.status === tab).length})
                </button>
              ))}
            </div>

            {/* List */}
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface hidden md:table-header-group border-b border-zinc-200">
                  <tr>
                    <th className="p-6 font-bold text-zinc-500 text-sm">Gig Details</th>
                    <th className="p-6 font-bold text-zinc-500 text-sm text-center">Impressions</th>
                    <th className="p-6 font-bold text-zinc-500 text-sm text-center">Clicks</th>
                    <th className="p-6 font-bold text-zinc-500 text-sm text-center">Orders</th>
                    <th className="p-6 font-bold text-zinc-500 text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 block md:table-row-group">
                  {displayGigs.map(gig => (
                    <tr key={gig.id} className="hover:bg-surface transition-colors block md:table-row border-b md:border-b-0 border-zinc-100 last:border-0 p-4 md:p-0">
                      <td className="p-2 md:p-6 block md:table-cell">
                        <div className="flex gap-4 items-center">
                          <img src={gig.img} alt="gig thumb" className="w-20 h-14 rounded-lg object-cover border border-zinc-200 shrink-0" />
                          <Link to={`/gigs/gig/${gig.id}`} className="font-bold text-sm text-zinc-900 hover:text-success transition-colors line-clamp-2">
                            {gig.title}
                          </Link>
                        </div>
                      </td>
                      
                      <td className="p-2 md:p-6 md:text-center block md:table-cell">
                        <div className="md:hidden text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Impressions</div>
                        <span className="font-bold text-zinc-700">{gig.impressions}</span>
                      </td>
                      
                      <td className="p-2 md:p-6 md:text-center block md:table-cell">
                        <div className="md:hidden text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Clicks</div>
                        <span className="font-bold text-zinc-700">{gig.clicks}</span>
                      </td>
                      
                      <td className="p-2 md:p-6 md:text-center block md:table-cell">
                        <div className="md:hidden text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Orders</div>
                        <span className="font-bold text-zinc-700">{gig.orders}</span>
                      </td>
                      
                      <td className="p-2 md:p-6 md:text-right block md:table-cell">
                        <div className="flex items-center md:justify-end gap-2 mt-2 md:mt-0">
                          <Link to={`/gigs/edit/${gig.id}`} className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 rounded-lg transition-colors" title="Edit">
                            <Edit3 className="w-5 h-5" />
                          </Link>
                          {gig.status === 'active' && (
                            <button className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 hover:text-amber-700 rounded-lg transition-colors" title="Pause">
                              <Pause className="w-5 h-5" />
                            </button>
                          )}
                          {gig.status === 'paused' && (
                            <button className="p-2 bg-emerald-50 hover:bg-emerald-100 text-success hover:text-emerald-700 rounded-lg transition-colors" title="Activate">
                              <Play className="w-5 h-5 fill-current" />
                            </button>
                          )}
                          <button className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {displayGigs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-zinc-500 font-medium">
                        <Settings className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        No gigs found in this status.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default MyGigs;
