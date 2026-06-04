import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Users, Star, Search, Filter, MessageSquare, Briefcase, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { extractList, loadFreelancerProfile, workAPI } from './findWorkWorkflow';

const ProviderManagement = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await workAPI.getProviders();
      const list = extractList(response);

      const enriched = await Promise.all(
        list.map(async (entry) => {
          const freelancerId = entry.freelancerId || entry.id;
          const profile = freelancerId ? await loadFreelancerProfile(freelancerId) : null;
          const profileData = profile?.profile || profile || {};
          return {
            id: freelancerId,
            name: profileData.displayName || profileData.name || entry.name || 'Professional',
            avatar: profileData.avatar || profileData.avatarUrl || '',
            title: profileData.title || profileData.headline || 'Freelancer',
            rating: Number(profileData.rating || 0),
            completed: Number(entry.completedContracts ?? profileData.completedJobs ?? 0),
            location: profileData.location || profileData.country || 'Kenya',
            status: Number(entry.activeContracts) > 0 ? 'busy' : 'available',
            totalSpend: Number(entry.totalSpend || 0),
          };
        })
      );

      setProviders(enriched);
    } catch (err) {
      toast.error(err.message || 'Could not load providers.');
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return providers;
    return providers.filter(
      (provider) =>
        provider.name.toLowerCase().includes(query) ||
        provider.title.toLowerCase().includes(query) ||
        provider.location.toLowerCase().includes(query)
    );
  }, [providers, search]);

  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2bb75c]/10 text-[#2bb75c] rounded-xl flex items-center justify-center shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-zinc-900">My Providers</h1>
                <p className="text-zinc-600 font-medium">Manage your network of trusted freelancers.</p>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"><Search className="w-4 h-4" /></span>
                <input
                  type="text"
                  placeholder="Search providers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:border-[#2bb75c]/20 focus:outline-none font-medium text-sm text-zinc-900"
                />
              </div>
              <button type="button" className="p-2.5 bg-white border border-zinc-200 text-zinc-600 rounded-xl hover:bg-surface transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <Loader2 className="w-10 h-10 animate-spin text-[#2bb75c] mb-4" />
              <p className="font-medium">Loading providers…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center shadow-sm">
              <p className="text-zinc-600 font-medium">No providers found yet. Hire freelancers to build your network.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((provider) => (
                <div key={provider.id} className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-md transition-shadow relative">
                  <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${provider.status === 'available' ? 'bg-success' : 'bg-amber-500'}`} title={provider.status} />

                  <div className="flex flex-col items-center text-center mb-6">
                    <img
                      src={provider.avatar || `https://i.pravatar.cc/150?u=${provider.id}`}
                      alt={provider.name}
                      className="w-20 h-20 rounded-full border border-zinc-200 mb-3 object-cover"
                    />
                    <Link to={`/seller/${provider.id}`} className="font-bold text-zinc-900 text-lg hover:text-[#2bb75c] transition-colors">{provider.name}</Link>
                    <div className="text-sm font-medium text-zinc-500 mb-2">{provider.title}</div>
                    <div className="flex items-center gap-1 font-bold text-zinc-700 text-sm">
                      <Star className="w-4 h-4 text-amber-500 fill-current" /> {provider.rating.toFixed(1)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-surface border border-zinc-100 rounded-xl p-4 mb-6">
                    <div className="text-center">
                      <div className="font-black text-zinc-900 text-lg">{provider.completed}</div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Jobs Done</div>
                    </div>
                    <div className="text-center border-l border-zinc-200">
                      <div className="font-black text-zinc-900 text-lg truncate">{provider.location}</div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Location</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to="/messages" className="flex-1 py-2.5 bg-white border border-zinc-200 hover:bg-surface text-zinc-700 font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Message
                    </Link>
                    <Link to="/post-job" className="flex-1 py-2.5 bg-[#2bb75c] hover:bg-[#1d8d38] text-white font-bold rounded-xl shadow-sm transition-colors text-sm flex items-center justify-center gap-2">
                      <Briefcase className="w-4 h-4" /> Hire Again
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProviderManagement;

