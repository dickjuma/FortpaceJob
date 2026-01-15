import React, { useState } from "react";
import { Clock, CheckCircle2, XCircle, MoreVertical, ExternalLink, Filter, DollarSign, Search, Download, Eye, Trash2, MessageSquare, Calendar, TrendingUp, AlertCircle, ChevronDown, X } from "lucide-react";

export default function ProposalManager() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showActions, setShowActions] = useState(null);

  const proposals = [
    {
      id: "PROP-9921",
      buyer: "TechFlow Solutions",
      title: "Full-stack React & Node.js Developer",
      amount: 1200,
      net: 960,
      status: "pending",
      date: "Jan 12, 2026",
      delivery: "30 Days",
      description: "Complete SaaS dashboard with Stripe integration",
      responseTime: "2 days",
      views: 8
    },
    {
      id: "PROP-8842",
      buyer: "Studio Orbit",
      title: "Logo & Brand Identity",
      amount: 250,
      net: 200,
      status: "accepted",
      date: "Jan 10, 2026",
      delivery: "7 Days",
      description: "Minimalist design for organic coffee brand",
      responseTime: "1 day",
      views: 15
    },
    {
      id: "PROP-7712",
      buyer: "Digital Growth Lab",
      title: "Technical Content Writer",
      amount: 400,
      net: 320,
      status: "rejected",
      date: "Jan 05, 2026",
      delivery: "14 Days",
      description: "10 SEO-optimized articles on AI and SaaS",
      responseTime: "5 days",
      views: 12
    },
    {
      id: "PROP-6543",
      buyer: "FitLife Pro",
      title: "Instagram Reels & TikTok Videos",
      amount: 800,
      net: 640,
      status: "pending",
      date: "Jan 08, 2026",
      delivery: "21 Days",
      description: "20 short-form fitness videos with editing",
      responseTime: "3 days",
      views: 5
    },
    {
      id: "PROP-5421",
      buyer: "CloudSync Inc",
      title: "Backend API Development",
      amount: 1500,
      net: 1200,
      status: "accepted",
      date: "Jan 03, 2026",
      delivery: "45 Days",
      description: "RESTful API with authentication and database",
      responseTime: "4 hours",
      views: 22
    }
  ];

  const statusStyles = {
    pending: "bg-amber-50 text-amber-600 border-amber-200",
    accepted: "bg-green-50 text-green-600 border-green-200",
    rejected: "bg-red-50 text-red-600 border-red-200"
  };

  const statusIcons = {
    pending: Clock,
    accepted: CheckCircle2,
    rejected: XCircle
  };

  const stats = {
    total: proposals.length,
    pending: proposals.filter(p => p.status === "pending").length,
    accepted: proposals.filter(p => p.status === "accepted").length,
    rejected: proposals.filter(p => p.status === "rejected").length,
    totalValue: proposals.reduce((sum, p) => sum + p.amount, 0),
    avgResponseTime: "2.4 days"
  };

  const filteredProposals = proposals
    .filter(p => filter === "all" || p.status === filter)
    .filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.buyer.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "amount-high") return b.amount - a.amount;
      if (sortBy === "amount-low") return a.amount - b.amount;
      if (sortBy === "views") return b.views - a.views;
      return 0; // default date
    });

  const ProposalDetailModal = ({ proposal, onClose }) => {
    if (!proposal) return null;
    
    const StatusIcon = statusIcons[proposal.status];
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="bg-[#4A312F] p-8 text-white flex justify-between items-start sticky top-0 rounded-t-[2.5rem]">
            <div>
              <div className="flex items-center gap-2 text-[#B7E2BF] mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Proposal Details</span>
              </div>
              <h3 className="text-2xl font-black">{proposal.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{proposal.buyer}</p>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Status & Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</p>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles[proposal.status]}`}>
                  <StatusIcon size={12} />
                  {proposal.status}
                </span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Offer</p>
                <p className="text-xl font-black text-black">${proposal.amount}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">You Earn</p>
                <p className="text-xl font-black text-[#B7E2BF]">${proposal.net}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Views</p>
                <p className="text-xl font-black text-black">{proposal.views}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-black text-black uppercase mb-3">Your Proposal</h4>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl">
                {proposal.description}
              </p>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Submitted</p>
                <p className="text-sm font-bold text-black">{proposal.date}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Delivery Time</p>
                <p className="text-sm font-bold text-black">{proposal.delivery}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row gap-3">
              {proposal.status === "accepted" ? (
                <>
                  <button className="flex-1 bg-black hover:bg-[#D34079] text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <ExternalLink size={16} /> Create Invoice
                  </button>
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-black px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <MessageSquare size={16} /> Message Client
                  </button>
                </>
              ) : proposal.status === "pending" ? (
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-black px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Download size={16} /> Download PDF
                </button>
              ) : (
                <button className="flex-1 bg-gray-100 hover:bg-red-100 text-red-600 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Trash2 size={16} /> Delete Proposal
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 pb-20">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Sent</p>
            <TrendingUp size={16} className="text-gray-300" />
          </div>
          <p className="text-3xl font-black text-black">{stats.total}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pending</p>
            <Clock size={16} className="text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Accepted</p>
            <CheckCircle2 size={16} className="text-green-400" />
          </div>
          <p className="text-3xl font-black text-green-600">{stats.accepted}</p>
        </div>
        <div className="bg-[#4A312F] rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black text-[#B7E2BF] uppercase tracking-widest">Total Value</p>
            <DollarSign size={16} className="text-[#B7E2BF]" />
          </div>
          <p className="text-3xl font-black">${stats.totalValue}</p>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-black tracking-tight">Sent Proposals</h2>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Track all your active bids</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-black hover:bg-[#D34079] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2">
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D34079] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by title or buyer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F9FB] border border-gray-100 rounded-xl pl-12 pr-4 py-3 font-medium text-black outline-none focus:ring-2 focus:ring-[#B7E2BF]/50 transition-all"
            />
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#F7F9FB] border border-gray-100 rounded-xl px-4 py-3 font-black text-xs text-gray-600 uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#B7E2BF]/50 cursor-pointer"
          >
            <option value="date">Sort: Most Recent</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex bg-[#F7F9FB] p-1 rounded-xl border border-gray-100 overflow-x-auto">
          {[
            { key: "all", label: "All Proposals" },
            { key: "pending", label: "Pending" },
            { key: "accepted", label: "Accepted" },
            { key: "rejected", label: "Rejected" }
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === s.key ? "bg-black text-white shadow-lg" : "text-gray-400 hover:text-black"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Proposal Cards (Mobile-friendly) */}
      <div className="md:hidden space-y-3">
        {filteredProposals.map((prop) => {
          const StatusIcon = statusIcons[prop.status];
          return (
            <div key={prop.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm font-black text-black">{prop.title}</p>
                  <p className="text-xs font-bold text-gray-400 mt-1">{prop.buyer}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusStyles[prop.status]}`}>
                  <StatusIcon size={10} />
                  {prop.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Clock size={12} /> {prop.delivery}</span>
                <span className="flex items-center gap-1"><Eye size={12} /> {prop.views} views</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Offer</p>
                  <p className="text-lg font-black text-black">${prop.amount}</p>
                </div>
                <button 
                  onClick={() => setSelectedProposal(prop)}
                  className="bg-black text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D34079] transition-all"
                >
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Proposal Table (Desktop) */}
      <div className="hidden md:block bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-[#F7F9FB]">
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Brief / Buyer</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Offer / Net</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Duration</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Activity</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProposals.map((prop) => {
                const StatusIcon = statusIcons[prop.status];
                return (
                  <tr key={prop.id} className="hover:bg-[#F7F9FB]/50 transition-colors group">
                    <td className="p-6">
                      <p className="text-sm font-black text-black group-hover:text-[#D34079] transition-colors cursor-pointer" onClick={() => setSelectedProposal(prop)}>{prop.title}</p>
                      <p className="text-xs font-bold text-gray-400 mt-1">{prop.buyer} • {prop.date}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-black">${prop.amount}</span>
                        <span className="text-[10px] font-bold text-[#B7E2BF] uppercase tracking-tighter">Net: ${prop.net}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                        <Clock size={14} className="text-gray-300" /> {prop.delivery}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                          <Eye size={12} className="text-gray-300" /> {prop.views} views
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold">Response: {prop.responseTime}</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles[prop.status]}`}>
                        <StatusIcon size={12} />
                        {prop.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        {prop.status === "accepted" ? (
                          <button className="bg-black text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#D34079] transition-all flex items-center gap-2">
                            <ExternalLink size={12} /> Invoice
                          </button>
                        ) : (
                          <div className="relative">
                            <button 
                              onClick={() => setShowActions(showActions === prop.id ? null : prop.id)}
                              className="p-2 text-gray-300 hover:text-black transition-colors"
                            >
                              <MoreVertical size={18} />
                            </button>
                            {showActions === prop.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-2xl z-10 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button 
                                  onClick={() => setSelectedProposal(prop)}
                                  className="w-full px-4 py-2 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Eye size={14} /> View Details
                                </button>
                                <button className="w-full px-4 py-2 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                                  <Download size={14} /> Download PDF
                                </button>
                                {prop.status === "rejected" && (
                                  <button className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                                    <Trash2 size={14} /> Delete
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProposals.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
          <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 font-bold text-lg">No proposals found</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search query</p>
        </div>
      )}

      {/* Tip Card */}
      <div className="bg-[#4A312F] p-8 rounded-[2rem] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h4 className="text-lg font-bold flex items-center gap-2 text-[#B7E2BF]">
            <DollarSign size={20} /> Boost Your Acceptance Rate
          </h4>
          <p className="text-sm text-gray-400">Accepted proposals are automatically converted into Clients and active Invoices.</p>
          <p className="text-xs text-gray-500">Average response time: {stats.avgResponseTime}</p>
        </div>
        <button className="bg-white text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#B7E2BF] transition-all whitespace-nowrap">
          View Marketplace
        </button>
      </div>

      {/* Detail Modal */}
      {selectedProposal && (
        <ProposalDetailModal 
          proposal={selectedProposal} 
          onClose={() => setSelectedProposal(null)} 
        />
      )}
    </div>
  );
}