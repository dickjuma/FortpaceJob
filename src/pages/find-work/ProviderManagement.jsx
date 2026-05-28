import React, { useState } from 'react';
import { Users, Star, Search, Filter, MessageSquare, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_PROVIDERS = [
  { id: 'PROV-1', name: 'DevMasterPro', avatar: 'https://i.pravatar.cc/150?img=11', title: 'Senior React Developer', rating: 4.9, completed: 15, location: 'United States', status: 'available' },
  { id: 'PROV-2', name: 'Sarah_Codes', avatar: 'https://i.pravatar.cc/150?img=9', title: 'Full Stack Engineer', rating: 5.0, completed: 8, location: 'Canada', status: 'busy' },
  { id: 'PROV-3', name: 'DesignPro_Studio', avatar: 'https://i.pravatar.cc/150?img=33', title: 'UI/UX Designer', rating: 4.8, completed: 32, location: 'United Kingdom', status: 'available' },
];

const ProviderManagement = () => {
  const [search, setSearch] = useState('');

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-zinc-900">My Providers</h1>
                <p className="text-zinc-600 font-medium">Manage your network of trusted freelancers.</p>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <span className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400"><Search className="w-4 h-4" /></span>
                <input 
                  type="text" 
                  placeholder="Search providers..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:border-brand-500 focus:outline-none font-medium text-sm text-zinc-900"
                />
              </div>
              <button className="p-2.5 bg-white border border-zinc-200 text-zinc-600 rounded-xl hover:bg-surface transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_PROVIDERS.map(provider => (
              <div key={provider.id} className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-md transition-shadow relative">
                
                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${provider.status === 'available' ? 'bg-success' : 'bg-amber-500'}`} title={provider.status}></div>

                <div className="flex flex-col items-center text-center mb-6">
                  <img src={provider.avatar} alt={provider.name} className="w-20 h-20 rounded-full border border-zinc-200 mb-3" />
                  <Link to={`/seller/${provider.id}`} className="font-bold text-zinc-900 text-lg hover:text-brand-600 transition-colors">{provider.name}</Link>
                  <div className="text-sm font-medium text-zinc-500 mb-2">{provider.title}</div>
                  <div className="flex items-center gap-1 font-bold text-zinc-700 text-sm">
                    <Star className="w-4 h-4 text-amber-500 fill-current" /> {provider.rating}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-surface border border-zinc-100 rounded-xl p-4 mb-6">
                  <div className="text-center">
                    <div className="font-black text-zinc-900 text-lg">{provider.completed}</div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Jobs Done</div>
                  </div>
                  <div className="text-center border-l border-zinc-200">
                    <div className="font-black text-zinc-900 text-lg">{provider.location === 'United States' ? 'US' : provider.location === 'United Kingdom' ? 'UK' : 'CA'}</div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Location</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Message
                  </button>
                  <button className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-colors text-sm flex items-center justify-center gap-2">
                    <Briefcase className="w-4 h-4" /> Hire Again
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default ProviderManagement;
