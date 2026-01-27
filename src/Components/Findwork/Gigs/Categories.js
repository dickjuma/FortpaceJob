import React, { useState, useMemo } from "react";
import { 
  Star, Heart, Filter, SlidersHorizontal, 
  ShieldCheck, Zap, Search, ChevronRight, 
  CheckCircle2, X, TrendingUp, Clock, 
  Users, Bookmark, Send, Briefcase, 
  Crown, MapPin, Calendar, Bell, 
  ChevronLeft, Plus, RefreshCw, Eye,
  ExternalLink, ArrowUpRight, DollarSign,
  Globe, Tag, SortDesc, Download,
  Flag, Share, MoreVertical, Video,
  FileText, Building, Home, BriefcaseBusiness
} from "lucide-react";

const BUYER_REQUESTS = [
  {
    id: 1,
    buyer: "TechCorp Inc",
    buyerLogo: "TC",
    verified: true,
    rating: 4.9,
    jobsPosted: 12,
    title: "Build a React Dashboard with Real-time Analytics",
    description: "Need a modern dashboard using React, TypeScript, and Chart.js. Must integrate with REST APIs and display real-time data updates.",
    budget: "$800 - $1,200",
    minBudget: 800,
    maxBudget: 1200,
    offers: 8,
    duration: "21 Days",
    postedTime: "3 hours ago",
    tags: ["React", "TypeScript", "Chart.js", "API"],
    urgent: false,
    featured: true,
    category: "Web Development",
    location: "San Francisco, USA",
    paymentVerified: true,
    averageResponseTime: "2 hours"
  },
  {
    id: 2,
    buyer: "StartupHub",
    buyerLogo: "SH",
    verified: true,
    rating: 5.0,
    jobsPosted: 6,
    title: "Full-Stack Developer for MVP Landing Page",
    description: "Create a landing page with email capture, payment integration via Stripe, and admin panel.",
    budget: "$1,500 - $2,000",
    minBudget: 1500,
    maxBudget: 2000,
    offers: 15,
    duration: "30 Days",
    postedTime: "1 day ago",
    tags: ["Full-Stack", "Stripe", "Node.js", "MongoDB"],
    urgent: true,
    featured: false,
    category: "Web Development",
    location: "Remote",
    paymentVerified: true,
    averageResponseTime: "1 hour"
  },
  {
    id: 3,
    buyer: "E-Shop Pro",
    buyerLogo: "ES",
    verified: false,
    rating: "New",
    jobsPosted: 1,
    title: "Shopify Store Customization & Speed Optimization",
    description: "Optimize existing Shopify store for speed, add custom product filters, and improve mobile experience.",
    budget: "$400 - $600",
    minBudget: 400,
    maxBudget: 600,
    offers: 22,
    duration: "10 Days",
    postedTime: "5 hours ago",
    tags: ["Shopify", "Liquid", "Performance", "E-commerce"],
    urgent: false,
    featured: false,
    category: "Web Development",
    location: "New York, USA",
    paymentVerified: true,
    averageResponseTime: "4 hours"
  },
  {
    id: 4,
    buyer: "Brand Studio Co",
    buyerLogo: "BS",
    verified: true,
    rating: 4.8,
    jobsPosted: 18,
    title: "Complete Brand Identity Package for SaaS Startup",
    description: "Looking for a complete brand package: logo, color palette, typography, business cards, and social media templates.",
    budget: "$500 - $800",
    minBudget: 500,
    maxBudget: 800,
    offers: 31,
    duration: "14 Days",
    postedTime: "2 hours ago",
    tags: ["Branding", "Logo Design", "Adobe Suite", "Figma"],
    urgent: false,
    featured: true,
    category: "Design",
    location: "London, UK",
    paymentVerified: true,
    averageResponseTime: "3 hours"
  },
  {
    id: 5,
    buyer: "Modern Designs",
    buyerLogo: "MD",
    verified: true,
    rating: 4.9,
    jobsPosted: 9,
    title: "UI/UX Design for Mobile Banking App",
    description: "Design user-friendly interface for mobile banking app. Need wireframes, mockups, and prototypes in Figma.",
    budget: "$1,000 - $1,500",
    minBudget: 1000,
    maxBudget: 1500,
    offers: 12,
    duration: "20 Days",
    postedTime: "6 hours ago",
    tags: ["UI/UX", "Figma", "Mobile Design", "Prototyping"],
    urgent: true,
    featured: false,
    category: "Design",
    location: "Berlin, Germany",
    paymentVerified: true,
    averageResponseTime: "1.5 hours"
  },
  {
    id: 6,
    buyer: "Content Masters",
    buyerLogo: "CM",
    verified: true,
    rating: 4.7,
    jobsPosted: 24,
    title: "SEO Blog Posts for Tech Blog (10 Articles)",
    description: "Write 10 SEO-optimized blog posts (1500 words each) about AI, machine learning, and software development.",
    budget: "$600 - $800",
    minBudget: 600,
    maxBudget: 800,
    offers: 45,
    duration: "15 Days",
    postedTime: "1 day ago",
    tags: ["SEO", "Tech Writing", "Content Strategy", "AI"],
    urgent: false,
    featured: false,
    category: "Writing",
    location: "Toronto, Canada",
    paymentVerified: true,
    averageResponseTime: "6 hours"
  }
];

const CATEGORIES = [
  { id: "all", name: "All Requests", count: 45, icon: Globe },
  { id: "web-dev", name: "Web Development", count: 18, icon: Briefcase },
  { id: "design", name: "Design", count: 12, icon: FileText },
  { id: "writing", name: "Writing", count: 8, icon: Tag },
  { id: "video", name: "Video", count: 5, icon: Video },
  { id: "marketing", name: "Marketing", count: 2, icon: TrendingUp }
];

const RequestCard = ({ request, viewMode, isSaved, onSave, onApply, onSelect, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all ${
        viewMode === 'list' ? 'flex flex-col' : ''
      } ${isSelected ? 'border-green-500 bg-green-50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        {/* Checkbox for bulk selection */}
        {(isHovered || isSelected) && (
          <div className="absolute top-4 left-4 z-10">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
          </div>
        )}

        {/* Request header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 font-bold">
                {request.buyerLogo}
              </div>
              {request.verified && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={10} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900">{request.buyer}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span>{request.rating}</span>
                  <span>•</span>
                  <span>{request.jobsPosted} jobs</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {request.urgent && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                    Urgent
                  </span>
                )}
                {request.featured && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              className="p-1.5 hover:bg-gray-100 rounded"
            >
              <Heart size={18} className={isSaved ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <MoreVertical size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Request title and description */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-green-600 cursor-pointer">
            {request.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {request.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {request.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {request.tags.length > 3 && (
            <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded">
              +{request.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {request.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} />
              {request.offers} offers
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {request.location}
            </span>
          </div>
          <span>{request.postedTime}</span>
        </div>

        {/* Bottom section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-500">Budget</div>
            <div className="text-lg font-semibold text-gray-900">{request.budget}</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded border border-gray-300">
              View Details
            </button>
            <button
              onClick={onApply}
              className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded font-medium flex items-center gap-2"
            >
              <Send size={14} />
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickApplyModal = ({ request, onClose }) => {
  const [offerAmount, setOfferAmount] = useState(request.minBudget);
  const [deliveryDays, setDeliveryDays] = useState(parseInt(request.duration));
  const [coverLetter, setCoverLetter] = useState("");
  const [step, setStep] = useState(1);

  const handleSubmit = () => {
    alert(`Offer sent for ${request.title}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Send Offer</h3>
              <p className="text-sm text-gray-500">{request.title}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-sm">Details</span>
            </div>
            <div className="h-1 w-8 bg-gray-200"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-sm">Proposal</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg"
                    min={request.minBudget}
                    max={request.maxBudget}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Buyer budget: {request.budget}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time
                </label>
                <input
                  type="number"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full h-40 p-3 border border-gray-300 rounded-lg"
                placeholder="Explain why you're the right fit for this project..."
              />
              <div className="text-xs text-gray-500 mt-1">
                {coverLetter.length}/1000 characters
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                Back
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => step < 2 ? setStep(step + 1) : handleSubmit()}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
              {step < 2 ? 'Continue' : 'Send Offer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CategoryResults() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [savedRequests, setSavedRequests] = useState([1, 4]);
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedForBulk, setSelectedForBulk] = useState([]);
  const [showQuickApply, setShowQuickApply] = useState(null);
  const [filters, setFilters] = useState({
    verifiedOnly: false,
    urgentOnly: false,
    featuredOnly: false,
    paymentVerified: true,
    budgetRange: [100, 5000]
  });

  const filteredRequests = useMemo(() => {
    return BUYER_REQUESTS.filter(request => {
      if (selectedCategory !== "all" && request.category !== selectedCategory) return false;
      if (searchQuery && !request.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filters.verifiedOnly && !request.verified) return false;
      if (filters.urgentOnly && !request.urgent) return false;
      if (filters.featuredOnly && !request.featured) return false;
      if (filters.paymentVerified && !request.paymentVerified) return false;
      if (request.maxBudget < filters.budgetRange[0] || request.minBudget > filters.budgetRange[1]) return false;
      return true;
    }).sort((a, b) => {
      switch(sortBy) {
        case "budget-high": return b.maxBudget - a.maxBudget;
        case "budget-low": return a.minBudget - b.minBudget;
        case "offers-low": return a.offers - b.offers;
        default: return b.id - a.id;
      }
    });
  }, [selectedCategory, searchQuery, filters, sortBy]);

  const stats = {
    totalRequests: filteredRequests.length,
    avgBudget: Math.round(filteredRequests.reduce((sum, r) => sum + r.minBudget, 0) / filteredRequests.length) || 0,
    avgOffers: Math.round(filteredRequests.reduce((sum, r) => sum + r.offers, 0) / filteredRequests.length) || 0
  };

  const toggleSave = (id) => {
    setSavedRequests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleBulkSelect = (id) => {
    setSelectedForBulk(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkApply = () => {
    if (selectedForBulk.length === 0) return;
    alert(`Applying to ${selectedForBulk.length} selected requests`);
    setSelectedForBulk([]);
  };

  const resetFilters = () => {
    setFilters({
      verifiedOnly: false,
      urgentOnly: false,
      featuredOnly: false,
      paymentVerified: true,
      budgetRange: [100, 5000]
    });
    setSearchQuery("");
    setSortBy("recent");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Buyer Requests</h1>
                <p className="text-sm text-gray-500 mt-1">Find projects that match your skills</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell size={20} className="text-gray-600" />
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">
                Post a Project
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-4">
            {/* Categories */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
              <div className="space-y-1">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id === "all" ? "all" : cat.name)}
                      className={`w-full flex items-center justify-between p-2 rounded hover:bg-gray-50 ${
                        selectedCategory === (cat.id === "all" ? "all" : cat.name)
                          ? "bg-green-50 text-green-700"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className="text-gray-400" />
                        <span className="text-sm">{cat.name}</span>
                      </div>
                      <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Market Stats</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Avg. Project Budget</div>
                  <div className="font-semibold text-gray-900">${stats.avgBudget}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Avg. Competition</div>
                  <div className="font-semibold text-gray-900">{stats.avgOffers} bids</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Total Requests</div>
                  <div className="font-semibold text-gray-900">{stats.totalRequests}</div>
                </div>
              </div>
            </div>

            {/* Saved Requests */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bookmark size={16} className="text-gray-600" />
                <h3 className="font-medium text-gray-900">Saved Requests</h3>
              </div>
              <div className="space-y-2">
                {savedRequests.map(id => {
                  const req = BUYER_REQUESTS.find(r => r.id === id);
                  if (!req) return null;
                  return (
                    <div key={id} className="p-2 border border-gray-100 rounded text-sm">
                      <div className="font-medium text-gray-900 truncate">{req.title}</div>
                      <div className="text-xs text-gray-500">{req.budget}</div>
                      <button 
                        onClick={() => setShowQuickApply(req.id)}
                        className="text-xs text-green-600 hover:text-green-700 font-medium mt-1"
                      >
                        Apply
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Search & Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search requests, skills, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-100"}`}
                  >
                    <div className="grid grid-cols-2 gap-1 w-5 h-5">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-600 rounded-sm" />
                      ))}
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-100"}`}
                  >
                    <div className="space-y-1 w-5 h-5">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-1 bg-gray-600 rounded-full" />
                      ))}
                    </div>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilters(f => ({...f, verifiedOnly: !f.verifiedOnly}))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${
                    filters.verifiedOnly 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ShieldCheck size={14} />
                  Verified
                </button>

                <button
                  onClick={() => setFilters(f => ({...f, urgentOnly: !f.urgentOnly}))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${
                    filters.urgentOnly 
                      ? "bg-red-100 text-red-700" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Zap size={14} />
                  Urgent
                </button>

                <button
                  onClick={() => setFilters(f => ({...f, featuredOnly: !f.featuredOnly}))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${
                    filters.featuredOnly 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Crown size={14} />
                  Featured
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1"
                >
                  <Filter size={14} />
                  More Filters
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="budget-high">Budget: High to Low</option>
                  <option value="budget-low">Budget: Low to High</option>
                  <option value="offers-low">Least Competition</option>
                </select>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <input
                            type="number"
                            value={filters.budgetRange[0]}
                            onChange={(e) => setFilters(f => ({
                              ...f,
                              budgetRange: [parseInt(e.target.value), f.budgetRange[1]]
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Min"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            value={filters.budgetRange[1]}
                            onChange={(e) => setFilters(f => ({
                              ...f,
                              budgetRange: [f.budgetRange[0], parseInt(e.target.value)]
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Max"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bulk Actions */}
            {selectedForBulk.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">{selectedForBulk.length} selected</div>
                      <div className="text-sm text-gray-600">Apply to multiple requests</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedForBulk([])}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleBulkApply}
                      className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                    >
                      Apply to Selected
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedCategory === "all" ? "All Requests" : selectedCategory}
                </h2>
                <p className="text-sm text-gray-500">
                  {filteredRequests.length} requests found
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded border border-gray-300">
                  Export
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <RefreshCw size={18} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Results Grid */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  viewMode={viewMode}
                  isSaved={savedRequests.includes(request.id)}
                  onSave={() => toggleSave(request.id)}
                  onApply={() => setShowQuickApply(request.id)}
                  onSelect={() => toggleBulkSelect(request.id)}
                  isSelected={selectedForBulk.includes(request.id)}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredRequests.length === 0 && (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredRequests.length > 0 && (
              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1">
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded text-sm font-medium bg-green-600 text-white">
                    1
                  </button>
                  <button className="w-8 h-8 rounded text-sm font-medium hover:bg-gray-100">
                    2
                  </button>
                  <button className="w-8 h-8 rounded text-sm font-medium hover:bg-gray-100">
                    3
                  </button>
                  <span className="text-gray-400 mx-1">...</span>
                  <button className="w-8 h-8 rounded text-sm font-medium hover:bg-gray-100">
                    10
                  </button>
                </div>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1">
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quick Apply Modal */}
      {showQuickApply && (
        <QuickApplyModal
          request={BUYER_REQUESTS.find(r => r.id === showQuickApply)}
          onClose={() => setShowQuickApply(null)}
        />
      )}
    </div>
  );
}