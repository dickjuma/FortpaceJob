import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Filter, Search, MoreVertical, Star, Edit, PauseCircle, PlayCircle, Trash2, Eye } from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useConfirm } from '../../common/context/ConfirmContext';
import { useFreelancerGigs, usePauseGig, useActivateGig, useDeleteGig } from '../services/freelancerHooks';

// --- Skeleton Loader ---
const GigsSkeleton = () => (
  <div className="space-y-8 animate-pulse pb-12">
    <div className="flex justify-between items-end">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-light-gray rounded-md"></div>
        <div className="h-4 w-48 bg-light-gray rounded-md"></div>
      </div>
      <div className="h-10 w-32 bg-light-gray rounded-md"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-80 bg-light-gray rounded-2xl"></div>
      ))}
    </div>
  </div>
);

export default function MyGigsDashboardPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const { data, isLoading: loading, refetch } = useFreelancerGigs();
  const [activeMenu, setActiveMenu] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [localGigs, setGigs] = useState([]);

  const pauseMutation = usePauseGig();
  const activateMutation = useActivateGig();
  const deleteMutation = useDeleteGig();

  useEffect(() => {
    if (Array.isArray(data)) {
      setGigs(data);
    } else if (Array.isArray(data?.data)) {
      setGigs(data.data);
    } else if (Array.isArray(data?.data?.gigs)) {
      setGigs(data.data.gigs);
    } else if (Array.isArray(data?.gigs)) {
      setGigs(data.gigs);
    }
  }, [data]);
  
  const gigs = localGigs;

  const handleAction = async (id, action) => {
    setActiveMenu(null);
    if (action === 'pause') {
      pauseMutation.mutate(id, {
        onSuccess: () => {
          toast.success('Gig paused. It will not appear in search results.');
          setGigs(prev => prev.map(g => g.id === id ? { ...g, status: 'PAUSED' } : g));
        },
        onError: (err) => toast.error(err.message || 'Failed to pause gig')
      });
    } else if (action === 'activate') {
      activateMutation.mutate(id, {
        onSuccess: () => {
          toast.success('Gig is now active and visible to clients.');
          setGigs(prev => prev.map(g => g.id === id ? { ...g, status: 'ACTIVE' } : g));
        },
        onError: (err) => toast.error(err.message || 'Failed to activate gig')
      });
    } else if (action === 'delete') {
      const ok = await confirm({
        title: 'Delete gig',
        message: 'Permanently delete this gig? Active orders may be affected.',
        confirmLabel: 'Delete gig',
        critical: true,
      });
      if (!ok) return;
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success('Gig deleted permanently.');
          setGigs(prev => prev.filter(g => g.id !== id));
        },
        onError: (err) => toast.error(err.message || 'Failed to delete gig')
      });
    } else if (action === 'edit') {
      navigate(`/freelancer/gigs/${id}/edit`);
    } else if (action === 'view') {
      navigate(`/freelancer/gigs/${id}`);
    }
  };

  const filteredGigs = gigs.filter(g => {
    if (filter !== 'All') {
      const gStatus = g.status?.toUpperCase() || '';
      const filterVal = filter === 'Drafts' ? 'DRAFT' : filter.toUpperCase();
      if (gStatus !== filterVal) return false;
    }
    if (searchTerm && !g.title?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (loading) return <GigsSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-success/10 text-success rounded-xl shadow-sm border border-success/20">
              <Briefcase size={24} />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">My Services</h1>
          </div>
          <p className="text-sm text-text-secondary font-medium">
            Manage your service listings, track performance, and create new offerings.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/freelancer/create-gig')} variant="primary" className="shadow-lg" icon={<Plus size={16} />}>
            Create New Service
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-border">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto custom-scrollbar">
          {['All', 'Active', 'Paused', 'Drafts'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all whitespace-nowrap",
                filter === f 
                  ? "bg-[#222222] text-white shadow-sm" 
                  : "text-text-secondary hover:text-[#222222] hover:bg-light-gray"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64 group/search">
          <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-text-secondary group-focus-within/search:text-[#222222] transition-colors" />
          <input 
            type="text" 
            placeholder="Search services..." 
            className="w-full pl-9 pr-4 py-2 bg-light-gray/50 border border-border rounded-lg text-sm font-medium focus:outline-none focus:border-[#222222] focus:ring-1 focus:ring-navy transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Gigs Grid */}
      {filteredGigs.length === 0 ? (
        <Card className="text-center py-20 bg-white/50 backdrop-blur-md border-border shadow-sm">
          <Briefcase className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-text-primary">No services found</h3>
          <p className="text-sm text-text-secondary mt-1 mb-6">You haven't created any services matching this filter.</p>
          <Button variant="primary" onClick={() => navigate('/freelancer/create-gig')}>Create Service</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map(gig => (
            <Card key={gig.id} className="p-0 overflow-visible bg-white border-border shadow-sm hover:-tranzinc-y-1 hover:shadow-lg transition-all group">
              <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                <img src={gig.image} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-md",
                    gig.status === 'ACTIVE' ? 'bg-success/90 text-white' : 'bg-warning/90 text-white'
                  )}>
                    {gig.status}
                  </span>
                </div>
                
                {/* Actions Menu */}
                <div className="absolute top-3 right-3">
                  <button 
                    className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-lg backdrop-blur-md transition-colors"
                    onClick={() => setActiveMenu(activeMenu === gig.id ? null : gig.id)}
                  >
                    <MoreVertical size={16} />
                  </button>
                  {activeMenu === gig.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-border overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                      <button onClick={() => handleAction(gig.id, 'view')} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-light-gray flex items-center gap-2">
                        <Eye size={14} /> View Service
                      </button>
                      <button onClick={() => handleAction(gig.id, 'edit')} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-light-gray flex items-center gap-2">
                        <Edit size={14} /> Edit Service
                      </button>
                      {gig.status === 'ACTIVE' ? (
                        <button onClick={() => handleAction(gig.id, 'pause')} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-warning hover:bg-light-gray flex items-center gap-2">
                          <PauseCircle size={14} /> Pause Service
                        </button>
                      ) : (
                        <button onClick={() => handleAction(gig.id, 'activate')} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-success hover:bg-light-gray flex items-center gap-2">
                          <PlayCircle size={14} /> Activate Service
                        </button>
                      )}
                      <div className="h-px bg-border my-1"></div>
                      <button onClick={() => handleAction(gig.id, 'delete')} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-[#e63946] hover:bg-[#e63946]/10 flex items-center gap-2">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-success uppercase tracking-widest">{gig.category}</span>
                </div>
                <h3 className="text-base font-bold text-text-primary leading-tight mb-4 group-hover:text-[#222222] transition-colors line-clamp-2">
                  {gig.title}
                </h3>

                <div className="flex items-center justify-between py-4 border-t border-b border-border mb-4">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Imp.</p>
                    <p className="text-sm font-black text-text-primary">{gig.views || 0}</p>
                  </div>
                  <div className="text-center border-l border-r border-border px-4">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Clicks</p>
                    <p className="text-sm font-black text-text-primary">{gig.clicks || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Orders</p>
                    <p className="text-sm font-black text-text-primary">{gig.orders?.length || 0}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-warning text-warning" />
                    <span className="text-sm font-black text-text-primary">{gig.averageRating || 5.0}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Starting at</p>
                    <p className="text-lg font-black text-success">KES {gig.price || gig.startingPrice}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
