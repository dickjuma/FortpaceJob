import React, { useState } from "react";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  MoreVertical, 
  ExternalLink, 
  Filter, 
  DollarSign, 
  Search, 
  Download, 
  Eye, 
  Trash2, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  ChevronDown, 
  X,
  FileText,
  User,
  BarChart,
  Copy,
  RefreshCw,
  Edit,
  Printer,
  Share2,
  Bell,
  Briefcase,
  Layers,
  CheckCircle2
} from "lucide-react";

const ProposalCard = ({ proposal, onView, onActionMenu }) => {
  const StatusIcon = {
    pending: Clock,
    accepted: CheckCircle,
    rejected: XCircle
  }[proposal.status];
  
  const StatusBadge = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200"
  }[proposal.status];

  return (
    <div className="bg-white border border-[#E7E1DE] rounded-lg hover:border-[#E7E1DE] transition-colors">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${StatusBadge}`}>
                <StatusIcon size={12} />
                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </span>
              <span className="text-xs text-[#7A5A4C] font-medium">{proposal.date}</span>
            </div>
            
            <h3 className="font-semibold text-[#2E2322] mb-2">{proposal.title}</h3>
            <p className="text-sm text-[#6B5B50] mb-3 line-clamp-2">{proposal.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-[#7A5A4C]">
              <div className="flex items-center gap-1">
                <User size={14} />
                {proposal.buyer}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {proposal.delivery}
              </div>
              <div className="flex items-center gap-1">
                <Eye size={14} />
                {proposal.views} views
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <div className="text-lg font-semibold text-[#2E2322]">${proposal.amount}</div>
              <div className="text-xs text-[#7A5A4C]">Net: ${proposal.net}</div>
            </div>
            
            <button
              onClick={onView}
              className="px-3 py-1.5 text-sm font-medium text-[#C9452F] hover:text-[#B53A27] hover:bg-[#FDECE7] rounded-lg transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-[#E7E1DE]">
          <div className="text-xs text-[#7A5A4C]">
            ID: {proposal.id} • Response: {proposal.responseTime}
          </div>
          <button
            onClick={() => onActionMenu(proposal.id)}
            className="p-1.5 text-[#A38F85] hover:text-[#6B5B50] hover:bg-[#F3E9E5] rounded-lg"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProposalDetailModal = ({ proposal, onClose, onAction }) => {
  if (!proposal) return null;

  const StatusIcon = {
    pending: Clock,
    accepted: CheckCircle,
    rejected: XCircle
  }[proposal.status];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-[#E7E1DE]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#2E2322]">Proposal Details</h3>
              <p className="text-sm text-[#7A5A4C]">{proposal.buyer}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F3E9E5] rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-[#7A5A4C]">Proposal ID</div>
              <div className="font-medium text-[#2E2322]">{proposal.id}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-[#7A5A4C]">Submitted Date</div>
              <div className="font-medium text-[#2E2322]">{proposal.date}</div>
            </div>
          </div>

          {/* Status & Amount */}
          <div className="bg-[#F8F4F1] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  proposal.status === 'accepted' ? 'bg-green-100 text-green-600' :
                  proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  <StatusIcon size={20} />
                </div>
                <div>
                  <div className="font-medium text-[#2E2322]">
                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                  </div>
                  <div className="text-sm text-[#7A5A4C]">
                    {proposal.status === 'pending' ? 'Awaiting response' : 
                     proposal.status === 'accepted' ? 'Project ready to start' : 'Not selected'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-[#2E2322]">${proposal.amount}</div>
                <div className="text-sm text-[#7A5A4C]">You earn: ${proposal.net}</div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="font-medium text-[#2E2322] mb-3">Project Overview</h4>
            <div className="bg-[#F8F4F1] rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-[#7A5A4C] mb-1">Project Title</div>
                  <div className="font-medium text-[#2E2322]">{proposal.title}</div>
                </div>
                <div>
                  <div className="text-sm text-[#7A5A4C] mb-1">Description</div>
                  <div className="text-[#4A312F]">{proposal.description}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-[#7A5A4C]">Delivery Time</div>
              <div className="font-medium text-[#2E2322] flex items-center gap-2">
                <Clock size={16} className="text-[#A38F85]" />
                {proposal.delivery}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-[#7A5A4C]">Views</div>
              <div className="font-medium text-[#2E2322] flex items-center gap-2">
                <Eye size={16} className="text-[#A38F85]" />
                {proposal.views} views
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-[#E7E1DE] pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {proposal.status === 'accepted' ? (
                <>
                  <button className="flex-1 px-4 py-2.5 bg-[#C9452F] text-white rounded-lg font-medium hover:bg-[#B53A27] flex items-center justify-center gap-2">
                    <ExternalLink size={16} />
                    Start Project
                  </button>
                  <button className="flex-1 px-4 py-2.5 border border-[#E7E1DE] text-[#4A312F] rounded-lg font-medium hover:bg-[#F8F4F1] flex items-center justify-center gap-2">
                    <MessageSquare size={16} />
                    Message Client
                  </button>
                </>
              ) : proposal.status === 'pending' ? (
                <>
                  <button className="flex-1 px-4 py-2.5 bg-[#C9452F] text-white rounded-lg font-medium hover:bg-[#B53A27] flex items-center justify-center gap-2">
                    <Edit size={16} />
                    Edit Proposal
                  </button>
                  <button className="flex-1 px-4 py-2.5 border border-[#E7E1DE] text-[#4A312F] rounded-lg font-medium hover:bg-[#F8F4F1] flex items-center justify-center gap-2">
                    <Copy size={16} />
                    Duplicate
                  </button>
                </>
              ) : (
                <button className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2">
                  <Trash2 size={16} />
                  Delete Proposal
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProposalManager() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const proposals = [
    {
      id: "PROP-9921",
      buyer: "TechFlow Solutions",
      title: "Full-stack React & Node.js Developer for SaaS Dashboard",
      amount: 1200,
      net: 960,
      status: "pending",
      date: "Jan 12, 2024",
      delivery: "30 Days",
      description: "Complete SaaS dashboard with Stripe integration, PostgreSQL database, and admin panel. Requires experience with modern React patterns.",
      responseTime: "2 days remaining",
      views: 8,
      category: "Web Development"
    },
    {
      id: "PROP-8842",
      buyer: "Studio Orbit",
      title: "Logo & Brand Identity Package",
      amount: 250,
      net: 200,
      status: "accepted",
      date: "Jan 10, 2024",
      delivery: "7 Days",
      description: "Minimalist design for organic coffee brand including logo, color palette, and social media templates.",
      responseTime: "Accepted on Jan 11",
      views: 15,
      category: "Design"
    },
    {
      id: "PROP-7712",
      buyer: "Digital Growth Lab",
      title: "Technical Content Writer for AI/ML Blog",
      amount: 400,
      net: 320,
      status: "rejected",
      date: "Jan 05, 2024",
      delivery: "14 Days",
      description: "Write 10 SEO-optimized articles on artificial intelligence and machine learning topics. Must have technical background.",
      responseTime: "Declined on Jan 08",
      views: 12,
      category: "Writing"
    },
    {
      id: "PROP-6543",
      buyer: "FitLife Pro",
      title: "Social Media Video Production",
      amount: 800,
      net: 640,
      status: "pending",
      date: "Jan 08, 2024",
      delivery: "21 Days",
      description: "Create 20 short-form fitness videos for Instagram Reels and TikTok. Need dynamic editing and trending audio.",
      responseTime: "5 days remaining",
      views: 5,
      category: "Video"
    },
    {
      id: "PROP-5421",
      buyer: "CloudSync Inc",
      title: "Backend API Development with Node.js",
      amount: 1500,
      net: 1200,
      status: "accepted",
      date: "Jan 03, 2024",
      delivery: "45 Days",
      description: "Build RESTful API with JWT authentication, PostgreSQL database, and integration with third-party services.",
      responseTime: "Accepted on Jan 04",
      views: 22,
      category: "Web Development"
    }
  ];

  const stats = {
    total: proposals.length,
    pending: proposals.filter(p => p.status === "pending").length,
    accepted: proposals.filter(p => p.status === "accepted").length,
    rejected: proposals.filter(p => p.status === "rejected").length,
    totalValue: proposals.reduce((sum, p) => sum + p.amount, 0),
    activeValue: proposals.filter(p => p.status === "accepted").reduce((sum, p) => sum + p.amount, 0),
    acceptanceRate: Math.round((proposals.filter(p => p.status === "accepted").length / proposals.length) * 100)
  };

  const filteredProposals = proposals
    .filter(p => filter === "all" || p.status === filter)
    .filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "amount-high") return b.amount - a.amount;
      if (sortBy === "amount-low") return a.amount - b.amount;
      if (sortBy === "views") return b.views - a.views;
      // Default sort by date (newest first)
      return new Date(b.date) - new Date(a.date);
    });

  const handleExport = () => {
    alert("Exporting proposals to CSV...");
  };

  const handleBulkAction = (action) => {
    alert(`Performing ${action} on selected proposals...`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#2E2322]">Proposal Manager</h1>
        <p className="text-[#6B5B50] mt-1">Track and manage your sent proposals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[#E7E1DE] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-[#FDECE7] rounded-lg">
              <FileText size={18} className="text-[#C9452F]" />
            </div>
            <div className="text-sm font-medium text-green-600">+12%</div>
          </div>
          <div className="text-2xl font-semibold text-[#2E2322]">{stats.total}</div>
          <div className="text-sm text-[#7A5A4C]">Total Proposals</div>
        </div>

        <div className="bg-white border border-[#E7E1DE] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock size={18} className="text-yellow-600" />
            </div>
            <div className="text-sm font-medium text-[#7A5A4C]">{stats.pending}</div>
          </div>
          <div className="text-2xl font-semibold text-[#2E2322]">{stats.pending}</div>
          <div className="text-sm text-[#7A5A4C]">Pending</div>
        </div>

        <div className="bg-white border border-[#E7E1DE] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle size={18} className="text-green-600" />
            </div>
            <div className="text-sm font-medium text-green-600">{stats.acceptanceRate}%</div>
          </div>
          <div className="text-2xl font-semibold text-[#2E2322]">{stats.accepted}</div>
          <div className="text-sm text-[#7A5A4C]">Accepted</div>
        </div>

        <div className="bg-white border border-[#E7E1DE] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-[#F3E9E5] rounded-lg">
              <DollarSign size={18} className="text-[#6B5B50]" />
            </div>
            <div className="text-sm font-medium text-green-600">+${stats.activeValue}</div>
          </div>
          <div className="text-2xl font-semibold text-[#2E2322]">${stats.totalValue}</div>
          <div className="text-sm text-[#7A5A4C]">Total Value</div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-[#E7E1DE] rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-[#E7E1DE]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A38F85]" size={18} />
                <input
                  type="text"
                  placeholder="Search proposals by title, client, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#E7E1DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9452F] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                className="px-4 py-2.5 border border-[#E7E1DE] rounded-lg text-sm font-medium hover:bg-[#F8F4F1] flex items-center gap-2"
              >
                <Filter size={16} />
                Filter
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-[#E7E1DE] rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9452F] focus:border-transparent"
              >
                <option value="date">Sort by: Most Recent</option>
                <option value="amount-high">Budget: High to Low</option>
                <option value="amount-low">Budget: Low to High</option>
                <option value="views">Most Viewed</option>
              </select>

              <button
                onClick={handleExport}
                className="px-4 py-2.5 bg-[#F3E9E5] text-[#4A312F] rounded-lg text-sm font-medium hover:bg-[#EFE7E2] flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === "all" 
                  ? "bg-[#C9452F] text-white" 
                  : "bg-[#F3E9E5] text-[#4A312F] hover:bg-[#EFE7E2]"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === "pending" 
                  ? "bg-yellow-600 text-white" 
                  : "bg-[#F3E9E5] text-[#4A312F] hover:bg-[#EFE7E2]"
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("accepted")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === "accepted" 
                  ? "bg-green-600 text-white" 
                  : "bg-[#F3E9E5] text-[#4A312F] hover:bg-[#EFE7E2]"
              }`}
            >
              Accepted ({stats.accepted})
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === "rejected" 
                  ? "bg-red-600 text-white" 
                  : "bg-[#F3E9E5] text-[#4A312F] hover:bg-[#EFE7E2]"
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilter && (
            <div className="mt-4 pt-4 border-t border-[#E7E1DE]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4A312F] mb-2">Budget Range</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      className="w-full border border-[#E7E1DE] rounded-lg p-2 text-sm"
                    />
                    <input 
                      type="number" 
                      placeholder="Max" 
                      className="w-full border border-[#E7E1DE] rounded-lg p-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A312F] mb-2">Date Range</label>
                  <div className="flex gap-2">
                    <input 
                      type="date" 
                      className="w-full border border-[#E7E1DE] rounded-lg p-2 text-sm"
                    />
                    <input 
                      type="date" 
                      className="w-full border border-[#E7E1DE] rounded-lg p-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A312F] mb-2">Category</label>
                  <select className="w-full border border-[#E7E1DE] rounded-lg p-2 text-sm">
                    <option>All Categories</option>
                    <option>Web Development</option>
                    <option>Design</option>
                    <option>Writing</option>
                    <option>Video</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button className="px-4 py-2 text-sm text-[#6B5B50] hover:text-[#2E2322]">
                  Reset
                </button>
                <button className="px-4 py-2 bg-[#C9452F] text-white rounded-lg text-sm font-medium">
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Proposals List */}
        <div className="p-6">
          {filteredProposals.length > 0 ? (
            <div className="space-y-4">
              {filteredProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onView={() => setSelectedProposal(proposal)}
                  onActionMenu={(id) => setShowActionMenu(id === showActionMenu ? null : id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#F3E9E5] rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-[#A38F85]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2E2322] mb-2">No proposals found</h3>
              <p className="text-[#6B5B50] mb-4">Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setFilter("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-[#F3E9E5] text-[#4A312F] rounded-lg font-medium hover:bg-[#EFE7E2]"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProposals.length > 0 && (
          <div className="px-6 py-4 border-t border-[#E7E1DE] flex items-center justify-between">
            <div className="text-sm text-[#6B5B50]">
              Showing {filteredProposals.length} of {proposals.length} proposals
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-[#E7E1DE] rounded-lg hover:bg-[#F8F4F1]">
                Previous
              </button>
              <button className="px-3 py-2 bg-[#C9452F] text-white rounded-lg">1</button>
              <button className="px-3 py-2 border border-[#E7E1DE] rounded-lg hover:bg-[#F8F4F1]">2</button>
              <button className="px-3 py-2 border border-[#E7E1DE] rounded-lg hover:bg-[#F8F4F1]">3</button>
              <button className="px-3 py-2 border border-[#E7E1DE] rounded-lg hover:bg-[#F8F4F1]">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tips Card */}
      <div className="mt-8 bg-[#FDECE7] border border-[#F4C7A1] rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-[#FDECE7] rounded-lg">
            <CheckCircle2 size={20} className="text-[#C9452F]" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-[#2E2322] mb-2">Tips for Higher Acceptance Rates</h4>
            <ul className="text-sm text-[#6B5B50] space-y-1">
              <li>• Respond to requests within 24 hours for better visibility</li>
              <li>• Include relevant portfolio samples in your proposals</li>
              <li>• Be specific about deliverables and timelines</li>
              <li>• Follow up on pending proposals after 3-4 days</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Menu */}
      {showActionMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowActionMenu(null)}>
          <div className="absolute right-4 top-20 bg-white border border-[#E7E1DE] rounded-lg shadow-lg w-48 py-2">
            <button className="w-full px-4 py-2 text-left text-sm text-[#4A312F] hover:bg-[#F8F4F1] flex items-center gap-2">
              <Edit size={14} />
              Edit Proposal
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-[#4A312F] hover:bg-[#F8F4F1] flex items-center gap-2">
              <Copy size={14} />
              Duplicate
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-[#4A312F] hover:bg-[#F8F4F1] flex items-center gap-2">
              <Download size={14} />
              Download PDF
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <ProposalDetailModal
          proposal={selectedProposal}
          onClose={() => setSelectedProposal(null)}
          onAction={(action) => {
            alert(`Action: ${action} on ${selectedProposal.id}`);
            setSelectedProposal(null);
          }}
        />
      )}
    </div>
  );
}