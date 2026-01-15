import React, { useState } from "react";
import { 
  MoreVertical, Edit3, Eye, Trash2, 
  ChevronDown, ArrowUpRight, BarChart2, 
  Pause, Play, Copy, ExternalLink,
  CheckSquare, Square, Download, Share2, TrendingUp,
  Search, Filter, Grid, List
} from "lucide-react";

export default function ManageGigs() {
  const [activeTab, setActiveTab] = useState("Active");
  const [selectedGigs, setSelectedGigs] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // list or grid

  const gigs = [
    { 
      id: "GIG-8821", 
      title: "Enterprise React SaaS Architecture & Scalable Systems", 
      status: "Active", 
      price: 1250,
      stats: { impressions: "12.4k", clicks: 420, ctr: "8.2%", orders: 14, revenue: "$17,500" },
      trend: "+14.2%",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=150&q=80" 
    },
    { 
      id: "GIG-4402", 
      title: "UI/UX Audit & Conversion Rate Optimization", 
      status: "Paused", 
      price: 350,
      stats: { impressions: "2.1k", clicks: 45, ctr: "1.8%", orders: 2, revenue: "$700" },
      trend: "-2.1%",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=150&q=80" 
    },
    { 
      id: "GIG-7723", 
      title: "Custom WordPress Theme Development", 
      status: "Active", 
      price: 850,
      stats: { impressions: "8.9k", clicks: 312, ctr: "3.5%", orders: 9, revenue: "$7,650" },
      trend: "+8.4%",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=150&q=80" 
    },
  ];

  const toggleSelect = (id) => {
    setSelectedGigs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedGigs(prev => prev.length === gigs.length ? [] : gigs.map(g => g.id));
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F7F7] text-gray-900 font-sans">
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gigs</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and track your service offerings</p>
            </div>
            <button className="bg-[#1DBF73] hover:bg-[#19A463] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow-md w-full sm:w-auto">
              Create a New Gig
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatCard 
            label="Earnings (30d)" 
            value="$25.9K" 
            icon={<TrendingUp size={18}/>} 
            trend="+18.2%" 
            trendUp={true}
          />
          <StatCard 
            label="Impressions" 
            value="23.4K" 
            icon={<Eye size={18}/>} 
            trend="+5.4%" 
            trendUp={true}
          />
          <StatCard 
            label="Clicks" 
            value="777" 
            icon={<BarChart2 size={18}/>} 
            trend="+2.1%" 
            trendUp={true}
          />
          <StatCard 
            label="Active Orders" 
            value="23" 
            icon={<Play size={18}/>} 
            trend="Ongoing" 
            trendUp={null}
          />
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Toolbar */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              
              {/* Tabs */}
              <div className="flex overflow-x-auto no-scrollbar">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  {["Active", "Pending", "Paused", "Draft"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                        activeTab === tab 
                          ? "bg-white text-gray-900 shadow-sm" 
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Search */}
                <div className="flex-1 lg:flex-initial">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search gigs..." 
                      className="w-full lg:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1DBF73] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* View Toggle */}
                <div className="hidden sm:flex bg-gray-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <List size={16} className="text-gray-600" />
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Grid size={16} className="text-gray-600" />
                  </button>
                </div>

                {/* Filter */}
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Filter size={16} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedGigs.length > 0 && (
              <div className="mt-4 flex items-center justify-between p-3 bg-[#1DBF73]/10 border border-[#1DBF73]/20 rounded-lg">
                <span className="text-sm font-semibold text-gray-900">
                  {selectedGigs.length} gig{selectedGigs.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-white rounded transition-colors">
                    Edit
                  </button>
                  <button className="px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-white rounded transition-colors">
                    Pause
                  </button>
                  <button className="px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-white rounded transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table/Grid Content */}
          {viewMode === 'list' ? (
            <>
              {/* Desktop Table Header */}
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="col-span-1 flex items-center">
                  <button onClick={toggleSelectAll}>
                    {selectedGigs.length === gigs.length 
                      ? <CheckSquare size={18} className="text-[#1DBF73]" /> 
                      : <Square size={18} className="text-gray-400" />
                    }
                  </button>
                </div>
                <div className="col-span-4">Gig</div>
                <div className="col-span-1 text-center">Impressions</div>
                <div className="col-span-1 text-center">Clicks</div>
                <div className="col-span-1 text-center">Orders</div>
                <div className="col-span-2 text-center">Revenue</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* Gig Rows */}
              <div className="divide-y divide-gray-100">
                {gigs.map((gig) => (
                  <GigRow 
                    key={gig.id} 
                    gig={gig} 
                    selected={selectedGigs.includes(gig.id)}
                    onToggle={() => toggleSelect(gig.id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
              {gigs.map((gig) => (
                <GigCard 
                  key={gig.id} 
                  gig={gig}
                  selected={selectedGigs.includes(gig.id)}
                  onToggle={() => toggleSelect(gig.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// List View Row Component
function GigRow({ gig, selected, onToggle }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Mobile Layout */}
      <div className="lg:hidden space-y-4">
        <div className="flex items-start gap-4">
          <button onClick={onToggle} className="mt-1">
            {selected 
              ? <CheckSquare size={20} className="text-[#1DBF73]" /> 
              : <Square size={20} className="text-gray-300" />
            }
          </button>
          
          <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img src={gig.image} alt={gig.title} className="w-full h-full object-cover" />
            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
              gig.status === 'Active' ? 'bg-[#1DBF73]' : 'bg-gray-400'
            }`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
              {gig.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{gig.id}</span>
              <span>•</span>
              <span className="font-semibold text-gray-900">From ${gig.price}</span>
            </div>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="grid grid-cols-3 gap-2 text-center bg-gray-50 rounded-lg p-3 ml-9">
          <div>
            <div className="text-xs font-semibold text-gray-900">{gig.stats.impressions}</div>
            <div className="text-xs text-gray-500">Views</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-900">{gig.stats.clicks}</div>
            <div className="text-xs text-gray-500">Clicks</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-900">{gig.stats.revenue}</div>
            <div className="text-xs text-gray-500">Revenue</div>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 ml-9">
          <button className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 flex items-center justify-center gap-1">
            <Edit3 size={14} /> Edit
          </button>
          <button className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 flex items-center justify-center gap-1">
            {gig.status === 'Active' ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Activate</>}
          </button>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <MoreVertical size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:contents">
        <div className="col-span-1 flex items-center">
          <button onClick={onToggle}>
            {selected 
              ? <CheckSquare size={20} className="text-[#1DBF73]" /> 
              : <Square size={20} className="text-gray-300" />
            }
          </button>
        </div>

        <div className="col-span-4 flex items-center gap-4">
          <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
            <img src={gig.image} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
              gig.status === 'Active' ? 'bg-[#1DBF73] shadow-[0_0_6px_#1DBF73]' : 'bg-gray-400'
            }`} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 group-hover:text-[#1DBF73] transition-colors">
              {gig.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">{gig.id}</span>
              <span className="text-xs font-semibold text-gray-900">From ${gig.price}</span>
            </div>
          </div>
        </div>

        <div className="col-span-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900">{gig.stats.impressions}</div>
          </div>
        </div>

        <div className="col-span-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900">{gig.stats.clicks}</div>
            <div className="text-xs text-gray-500">{gig.stats.ctr} CTR</div>
          </div>
        </div>

        <div className="col-span-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900">{gig.stats.orders}</div>
          </div>
        </div>

        <div className="col-span-2 flex items-center justify-center">
          <div className="text-center">
            <div className="text-base font-bold text-gray-900">{gig.stats.revenue}</div>
            <div className={`text-xs font-semibold ${gig.trend.includes('+') ? 'text-[#1DBF73]' : 'text-gray-400'}`}>
              {gig.trend}
            </div>
          </div>
        </div>

        <div className={`col-span-2 flex items-center justify-end gap-2 transition-all ${
          showActions ? 'opacity-100' : 'opacity-0'
        }`}>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
            <Edit3 size={16} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title={gig.status === 'Active' ? 'Pause' : 'Activate'}>
            {gig.status === 'Active' ? <Pause size={16} className="text-gray-600" /> : <Play size={16} className="text-gray-600" />}
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Share">
            <Share2 size={16} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Grid View Card Component
function GigCard({ gig, selected, onToggle }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <img src={gig.image} alt={gig.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
        <button 
          onClick={onToggle}
          className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-md"
        >
          {selected 
            ? <CheckSquare size={18} className="text-[#1DBF73]" /> 
            : <Square size={18} className="text-gray-400" />
          }
        </button>
        <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${
          gig.status === 'Active' ? 'bg-[#1DBF73] shadow-[0_0_8px_#1DBF73]' : 'bg-gray-400'
        }`} />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2 group-hover:text-[#1DBF73] transition-colors">
          {gig.title}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{gig.id}</span>
          <span className="font-semibold text-gray-900">From ${gig.price}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-900">{gig.stats.impressions}</div>
            <div className="text-xs text-gray-500">Views</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-900">{gig.stats.clicks}</div>
            <div className="text-xs text-gray-500">Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-900">{gig.stats.revenue}</div>
            <div className="text-xs text-gray-500">Revenue</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors">
            Edit
          </button>
          <button className="flex-1 px-3 py-2 bg-[#1DBF73] text-white rounded-lg text-xs font-semibold hover:bg-[#19A463] transition-colors">
            View
          </button>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, icon, trend, trendUp }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded ${
            trendUp === true ? 'bg-green-50 text-green-700' : 
            trendUp === false ? 'bg-red-50 text-red-700' : 
            'bg-gray-50 text-gray-600'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs sm:text-sm text-gray-500 font-medium">{label}</div>
    </div>
  );
}