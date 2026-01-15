import React, { useState } from "react";
import { 
  Star, Heart, Filter, SlidersHorizontal, 
  ShieldCheck, Zap, ArrowUpDown, Search,
  ChevronRight, Info, CheckCircle2, ChevronDown,
  X, TrendingUp, Award, Clock, Users, DollarSign,
  Eye, Send, AlertCircle
} from "lucide-react";

// Buyer requests organized by category
const BUYER_REQUESTS_BY_CATEGORY = {
  "Web Development": [
    {
      id: 1,
      buyer: "TechCorp Inc",
      verified: true,
      rating: 4.9,
      jobsPosted: 12,
      title: "Build a React Dashboard with Real-time Analytics",
      description: "Need a modern dashboard using React, TypeScript, and Chart.js. Must integrate with REST APIs and display real-time data updates. Looking for clean code and responsive design.",
      budget: "$800 - $1,200",
      minBudget: 800,
      maxBudget: 1200,
      offers: 8,
      duration: "21 Days",
      postedTime: "3 hours ago",
      tags: ["React", "TypeScript", "Chart.js"],
      urgent: false
    },
    {
      id: 2,
      buyer: "StartupHub",
      verified: true,
      rating: 5.0,
      jobsPosted: 6,
      title: "Full-Stack Developer for MVP Landing Page",
      description: "Create a landing page with email capture, payment integration via Stripe, and admin panel. Need someone who can handle both frontend and backend efficiently.",
      budget: "$1,500 - $2,000",
      minBudget: 1500,
      maxBudget: 2000,
      offers: 15,
      duration: "30 Days",
      postedTime: "1 day ago",
      tags: ["Full-Stack", "Stripe", "Node.js"],
      urgent: true
    },
    {
      id: 3,
      buyer: "E-Shop Pro",
      verified: false,
      rating: "New",
      jobsPosted: 1,
      title: "Shopify Store Customization & Speed Optimization",
      description: "Optimize existing Shopify store for speed, add custom product filters, and improve mobile experience. Must have proven Shopify experience.",
      budget: "$400 - $600",
      minBudget: 400,
      maxBudget: 600,
      offers: 22,
      duration: "10 Days",
      postedTime: "5 hours ago",
      tags: ["Shopify", "Liquid", "Performance"],
      urgent: false
    }
  ],
  "Design": [
    {
      id: 4,
      buyer: "Brand Studio Co",
      verified: true,
      rating: 4.8,
      jobsPosted: 18,
      title: "Complete Brand Identity Package for SaaS Startup",
      description: "Looking for a complete brand package: logo, color palette, typography, business cards, and social media templates. Must show portfolio of tech/SaaS branding.",
      budget: "$500 - $800",
      minBudget: 500,
      maxBudget: 800,
      offers: 31,
      duration: "14 Days",
      postedTime: "2 hours ago",
      tags: ["Branding", "Logo Design", "Adobe Suite"],
      urgent: false
    },
    {
      id: 5,
      buyer: "Modern Designs",
      verified: true,
      rating: 4.9,
      jobsPosted: 9,
      title: "UI/UX Design for Mobile Banking App",
      description: "Design user-friendly interface for mobile banking app. Need wireframes, high-fidelity mockups, and interactive prototypes in Figma. Focus on security and ease of use.",
      budget: "$1,000 - $1,500",
      minBudget: 1000,
      maxBudget: 1500,
      offers: 12,
      duration: "20 Days",
      postedTime: "6 hours ago",
      tags: ["UI/UX", "Figma", "Mobile Design"],
      urgent: true
    }
  ],
  "Writing": [
    {
      id: 6,
      buyer: "Content Masters",
      verified: true,
      rating: 4.7,
      jobsPosted: 24,
      title: "SEO Blog Posts for Tech Blog (10 Articles)",
      description: "Write 10 SEO-optimized blog posts (1500 words each) about AI, machine learning, and software development. Must include keyword research and meta descriptions.",
      budget: "$600 - $800",
      minBudget: 600,
      maxBudget: 800,
      offers: 45,
      duration: "15 Days",
      postedTime: "1 day ago",
      tags: ["SEO", "Tech Writing", "Content Strategy"],
      urgent: false
    }
  ],
  "Video": [
    {
      id: 7,
      buyer: "Video First",
      verified: true,
      rating: 5.0,
      jobsPosted: 11,
      title: "Product Explainer Video with Motion Graphics",
      description: "Create a 60-second product explainer video with modern motion graphics. Need storyboard, animation, voiceover coordination, and final render in 4K.",
      budget: "$800 - $1,200",
      minBudget: 800,
      maxBudget: 1200,
      offers: 18,
      duration: "12 Days",
      postedTime: "4 hours ago",
      tags: ["Motion Graphics", "After Effects", "Video Production"],
      urgent: true
    }
  ]
};

export default function CategoryResults() {
  const [selectedCategory, setSelectedCategory] = useState("Web Development");
  const [proOnly, setProOnly] = useState(false);
  const [savedRequests, setSavedRequests] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [budgetRange, setBudgetRange] = useState([0, 2500]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [deliveryFilter, setDeliveryFilter] = useState(null);

  const categories = Object.keys(BUYER_REQUESTS_BY_CATEGORY);
  
  const allRequests = categories.flatMap(cat => BUYER_REQUESTS_BY_CATEGORY[cat]);
  
  const filteredRequests = (BUYER_REQUESTS_BY_CATEGORY[selectedCategory] || [])
    .filter(req => !proOnly || req.verified)
    .filter(req => req.minBudget >= budgetRange[0] && req.maxBudget <= budgetRange[1])
    .filter(req => 
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      req.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(req => {
      if (deliveryFilter === "express") return parseInt(req.duration) <= 10;
      if (deliveryFilter === "standard") return parseInt(req.duration) > 10 && parseInt(req.duration) <= 20;
      if (deliveryFilter === "extended") return parseInt(req.duration) > 20;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "budget-high") return b.maxBudget - a.maxBudget;
      if (sortBy === "budget-low") return a.minBudget - b.minBudget;
      if (sortBy === "offers-low") return a.offers - b.offers;
      if (sortBy === "urgent") return (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0);
      return 0;
    });

  const toggleSave = (id) => {
    setSavedRequests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const stats = {
    total: allRequests.length,
    category: filteredRequests.length,
    saved: savedRequests.length,
    avgBudget: Math.round(allRequests.reduce((sum, r) => sum + r.minBudget, 0) / allRequests.length)
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700 px-4 md:px-8 pb-20">
      
      {/* Breadcrumbs & Pro Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
           <span className="hover:text-black cursor-pointer transition-colors">Find Work</span>
           <ChevronRight size={10} />
           <span className="text-black">{selectedCategory}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-gray-600">Verified Buyers Only</span>
          <button 
            onClick={() => setProOnly(!proOnly)}
            className={`w-10 h-5 rounded-full relative transition-colors ${proOnly ? 'bg-black' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${proOnly ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-2xl text-white shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-90">Total Requests</p>
          <p className="text-3xl font-black">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl text-white shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-90">In {selectedCategory}</p>
          <p className="text-3xl font-black">{stats.category}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-5 rounded-2xl text-white shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-90">Saved</p>
          <p className="text-3xl font-black">{stats.saved}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl text-white shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-90">Avg Budget</p>
          <p className="text-3xl font-black">${stats.avgBudget}</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter">{selectedCategory} Requests</h1>
          <p className="text-gray-500 max-w-2xl text-sm font-medium leading-relaxed">
            Browse active buyer requests in {selectedCategory}. Submit custom offers to stand out and win projects.
          </p>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-[#D34079] text-[10px] font-black uppercase tracking-widest hover:underline">
              <Info size={14} /> How to Send Offers
            </button>
            <span className="text-[10px] font-black text-gray-300">•</span>
            <span className="text-[10px] font-bold text-gray-400">{filteredRequests.length} active requests</span>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-black text-white shadow-lg"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
          >
            {cat} ({BUYER_REQUESTS_BY_CATEGORY[cat].length})
          </button>
        ))}
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D34079] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search requests by title or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F9FB] border border-gray-100 rounded-xl pl-12 pr-4 py-3 font-medium text-black outline-none focus:ring-2 focus:ring-[#B7E2BF]/50 transition-all"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-black uppercase tracking-widest transition-colors whitespace-nowrap"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold cursor-pointer outline-none whitespace-nowrap"
            >
              <option value="recent">Most Recent</option>
              <option value="budget-high">Budget: High to Low</option>
              <option value="budget-low">Budget: Low to High</option>
              <option value="offers-low">Least Competitive</option>
              <option value="urgent">Urgent First</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-black text-gray-600 uppercase tracking-widest mb-3 block">
                  Budget Range: ${budgetRange[0]} - ${budgetRange[1]}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="2500"
                    step="50"
                    value={budgetRange[1]}
                    onChange={(e) => setBudgetRange([budgetRange[0], parseInt(e.target.value)])}
                    className="flex-1 accent-black"
                  />
                  <button
                    onClick={() => setBudgetRange([0, 2500])}
                    className="text-xs font-bold text-gray-400 hover:text-black"
                  >
                    Reset
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-black text-gray-600 uppercase tracking-widest mb-3 block">
                  Delivery Time
                </label>
                <div className="flex gap-2">
                  {[
                    { key: null, label: "All" },
                    { key: "express", label: "≤10 days" },
                    { key: "standard", label: "11-20 days" },
                    { key: "extended", label: "20+ days" }
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setDeliveryFilter(opt.key)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        deliveryFilter === opt.key
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 italic">{filteredRequests.length} requests available</span>
        {savedRequests.length > 0 && (
          <button className="text-xs font-black text-[#D34079] hover:underline">
            View Saved ({savedRequests.length})
          </button>
        )}
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="group bg-white border border-gray-100 hover:border-gray-300 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-black text-xl shadow-lg">
                    {req.buyer.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-black uppercase tracking-widest">{req.buyer}</h4>
                      {req.verified && <CheckCircle2 size={12} className="text-blue-500" />}
                      {req.urgent && (
                        <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[9px] font-black">URGENT</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mt-1">
                      <div className="flex items-center gap-1">
                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                        <span>{req.rating}</span>
                      </div>
                      • {req.jobsPosted} jobs
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSave(req.id)}
                  className="text-gray-300 hover:text-[#D34079] transition-colors"
                >
                  <Heart size={20} className={savedRequests.includes(req.id) ? "fill-[#D34079] text-[#D34079]" : ""} />
                </button>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-lg font-black text-black leading-tight group-hover:text-[#D34079] transition-colors mb-2">
                  {req.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                  {req.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {req.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-[#F7F9FB] border border-gray-200 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={12} /> {req.duration}</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {req.offers} bids</span>
                </div>
                <span className="text-[10px] text-gray-400 font-bold">{req.postedTime}</span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget</p>
                  <p className="text-2xl font-black text-black">{req.budget}</p>
                </div>
                <button className="bg-black hover:bg-[#D34079] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all transform active:scale-95 shadow-lg flex items-center gap-2">
                  Send Offer <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <Filter size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 font-bold text-lg">No requests match your filters</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setBudgetRange([0, 2500]);
              setDeliveryFilter(null);
              setProOnly(false);
            }}
            className="mt-6 bg-black text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#D34079] transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-[#4A312F] to-black p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#B7E2BF] mb-2">
            <Award size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pro Tip</span>
          </div>
          <h3 className="text-2xl font-black">Stand Out with Custom Offers</h3>
          <p className="text-sm text-gray-400">Personalized proposals have a 3x higher acceptance rate than generic bids</p>
        </div>
        <button className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#B7E2BF] transition-all whitespace-nowrap shadow-2xl">
          Learn Best Practices
        </button>
      </div>
    </div>
  );
}