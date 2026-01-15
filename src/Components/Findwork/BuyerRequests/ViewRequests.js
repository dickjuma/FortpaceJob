import React, { useState } from "react";
import { Clock, Tag, Users, ChevronRight, Zap, Filter, Search, Send, FileText, ShieldCheck, DollarSign, Paperclip, AlertCircle, Star, Heart, ChevronDown, X, Upload, CheckCircle } from "lucide-react";

const SendProposalForm = ({ request, onBack }) => {
  const [formData, setFormData] = useState({
    description: "",
    price: "",
    deliveryTime: "3",
    revisions: "1",
    attachments: []
  });
  const [dragActive, setDragActive] = useState(false);

  const serviceFee = formData.price ? (parseFloat(formData.price) * 0.20).toFixed(2) : "0.00";
  const netIncome = formData.price ? (parseFloat(formData.price) - serviceFee).toFixed(2) : "0.00";

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files).slice(0, 3);
    setFormData({...formData, attachments: [...formData.attachments, ...fileArray].slice(0, 3)});
  };

  const handleSubmit = () => {
    if (!formData.description || !formData.price) {
      alert("Please fill in all required fields");
      return;
    }
    alert("Proposal Sent!");
    onBack();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
      <button onClick={onBack} className="mb-6 text-sm font-black text-gray-400 hover:text-black flex items-center gap-2 transition-colors">
        ← BACK TO ACTIVE REQUESTS
      </button>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl overflow-hidden">
        {/* Header Summary */}
        <div className="bg-[#4A312F] p-8 md:p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-[#B7E2BF] mb-2">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Custom Offer</span>
            </div>
            <h2 className="text-2xl font-black">{request.title}</h2>
            <p className="text-sm text-gray-400 mt-1">Client: <span className="text-white">{request.buyer}</span></p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold">{request.rating || "New"}</span>
              </div>
              <span className="text-xs text-gray-400">{request.jobsPosted || 3} jobs posted</span>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Buyer Budget</p>
            <p className="text-xl font-black text-[#B7E2BF]">{request.budget}</p>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          {/* Request Details */}
          <div className="bg-gray-50 rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-black text-black uppercase">Request Details</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{request.description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {request.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-lg font-black text-black block">Your Proposal</label>
            <textarea 
              className="w-full border-2 border-gray-50 rounded-3xl p-6 min-h-[200px] focus:border-[#B7E2BF] focus:outline-none text-black font-medium text-sm leading-relaxed"
              placeholder="Describe your approach, relevant experience, and why you're the best fit for this project..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
            <p className="text-xs text-gray-400 font-medium">{formData.description.length} / 1000 characters</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Offer Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={16} />
                    <input 
                      type="number" 
                      className="w-full bg-[#F7F9FB] border border-gray-100 rounded-xl py-3.5 pl-10 pr-4 font-black text-black outline-none focus:ring-2 focus:ring-[#B7E2BF]" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Delivery (Days)</label>
                  <input 
                    type="number" 
                    className="w-full bg-[#F7F9FB] border border-gray-100 rounded-xl py-3.5 px-4 font-black text-black outline-none focus:ring-2 focus:ring-[#B7E2BF]" 
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase">Attachments (Portfolio, Resume)</label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${dragActive ? 'border-[#B7E2BF] bg-[#B7E2BF]/5' : 'border-gray-200'}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto mb-3 text-gray-300" size={32} />
                  <p className="text-sm font-bold text-gray-400 mb-2">Drag & drop files or <label className="text-[#D34079] cursor-pointer underline">browse<input type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} /></label></p>
                  <p className="text-xs text-gray-400">Max 3 files, 10MB each</p>
                </div>
                {formData.attachments.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {formData.attachments.map((file, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-gray-400" />
                          <span className="text-xs font-bold text-black">{file.name}</span>
                        </div>
                        <button onClick={() => setFormData({...formData, attachments: formData.attachments.filter((_, idx) => idx !== i)})} className="text-gray-400 hover:text-red-500">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3 text-gray-500">
                <AlertCircle size={18} />
                <p className="text-[11px] font-bold leading-tight uppercase">Ensure your price includes all labor and material costs.</p>
              </div>
            </div>

            {/* Fee Breakdown Card */}
            <div className="bg-[#B7E2BF]/10 rounded-[2rem] p-8 border border-[#B7E2BF]/20">
              <p className="text-[10px] font-black text-[#4A312F] uppercase tracking-[0.2em] mb-4">Earnings Summary</p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-bold">Offer Total</span>
                  <span className="text-black font-black">${formData.price || "0.00"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-bold">Platform Fee (20%)</span>
                  <span className="text-red-500 font-bold">-${serviceFee}</span>
                </div>
                <div className="h-px bg-white my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-black uppercase tracking-widest">You'll Earn</span>
                  <span className="text-3xl font-black text-[#4A312F] tracking-tighter">${netIncome}</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white/50 rounded-xl">
                <p className="text-xs font-bold text-gray-600 mb-2">Why send a custom offer?</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Stand out from competitors</li>
                  <li>• Flexible pricing & timeline</li>
                  <li>• Direct client communication</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <button className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors">
              Save as Draft
            </button>
            <button onClick={handleSubmit} className="w-full md:w-auto bg-black hover:bg-[#D34079] text-white px-12 py-5 rounded-2xl font-black shadow-2xl transition-all transform active:scale-95 flex items-center gap-3">
              Submit Offer <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function ViewRequests() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedRequests, setSavedRequests] = useState([]);

  const categories = ["All", "Web Dev", "Design", "Marketing", "Writing", "Video"];

  const requests = [
    { 
      id: 1, 
      buyer: "TechFlow Solutions",
      title: "Full-stack React & Node.js Developer for SaaS Dashboard", 
      description: "We need a clean, responsive dashboard integrated with Stripe and a PostgreSQL database. Must have experience with Tailwind CSS and Framer Motion for animations. Budget is fixed but open to discussion for top-tier talent.",
      budget: "$1,200",
      offers: 12,
      duration: "30 Days",
      date: "2 hours ago",
      tags: ["React", "Node.js", "Stripe"],
      category: "Web Dev",
      rating: "4.9",
      jobsPosted: 8
    },
    { 
      id: 2, 
      buyer: "Studio Orbit",
      title: "Logo & Brand Identity for Organic Coffee Brand", 
      description: "Looking for a minimalist, earthy aesthetic for a new coffee roastery. Need logo, color palette, and social media templates. Please provide a portfolio link to similar organic or boutique brand work.",
      budget: "$250",
      offers: 45,
      duration: "7 Days",
      date: "5 hours ago",
      tags: ["Branding", "Logo Design"],
      category: "Design",
      rating: "5.0",
      jobsPosted: 15
    },
    { 
      id: 3, 
      buyer: "GrowthHive",
      title: "SEO-Optimized Blog Content for Tech Startup", 
      description: "Need 10 articles (1500 words each) covering AI, SaaS, and productivity tools. Must have SEO expertise and ability to write engaging, authoritative content. Long-term collaboration possible.",
      budget: "$500",
      offers: 23,
      duration: "14 Days",
      date: "1 day ago",
      tags: ["SEO", "Content Writing", "Tech"],
      category: "Writing",
      rating: "4.7",
      jobsPosted: 5
    },
    { 
      id: 4, 
      buyer: "FitLife Pro",
      title: "Instagram Reels & TikTok Videos for Fitness Brand", 
      description: "Create 20 short-form videos showcasing workout routines and nutrition tips. Need dynamic editing, trending audio, and engaging hooks. Experience with fitness content preferred.",
      budget: "$800",
      offers: 34,
      duration: "21 Days",
      date: "3 hours ago",
      tags: ["Video Editing", "Social Media", "Fitness"],
      category: "Video",
      rating: "New",
      jobsPosted: 1
    }
  ];

  const filteredRequests = requests
    .filter(req => activeFilter === "all" || req.category === activeFilter)
    .filter(req => req.title.toLowerCase().includes(searchQuery.toLowerCase()) || req.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "budget-high") return parseFloat(b.budget.replace(/[$,]/g, "")) - parseFloat(a.budget.replace(/[$,]/g, ""));
      if (sortBy === "budget-low") return parseFloat(a.budget.replace(/[$,]/g, "")) - parseFloat(b.budget.replace(/[$,]/g, ""));
      return 0; // default "recent"
    });

  const toggleSave = (id) => {
    setSavedRequests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (selectedRequest) {
    return <SendProposalForm request={selectedRequest} onBack={() => setSelectedRequest(null)} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 px-4">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#4A312F] p-5 rounded-2xl text-white flex justify-between items-center shadow-xl shadow-[#4A312F]/10">
          <div>
            <p className="text-[10px] font-bold text-[#B7E2BF] uppercase tracking-widest">Offers Left Today</p>
            <p className="text-2xl font-black">8 / 10</p>
          </div>
          <Zap size={24} className="text-[#B7E2BF] fill-[#B7E2BF]/20" />
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Briefs</p>
            <p className="text-2xl font-black text-black">{filteredRequests.length}</p>
          </div>
          <Filter size={20} className="text-gray-300" />
        </div>
        <div className="relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D34079] transition-colors" size={18} />
           <input 
            type="text" 
            placeholder="Search requests..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 font-medium text-black outline-none focus:ring-2 focus:ring-[#B7E2BF]/50 transition-all"
           />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat === "All" ? "all" : cat)}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
              (cat === "All" && activeFilter === "all") || activeFilter === cat
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-100 pb-4 gap-4">
        <h2 className="text-xl font-black text-black tracking-tight uppercase">Marketplace Briefs</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-black text-gray-600 bg-transparent border-none outline-none cursor-pointer uppercase tracking-widest"
          >
            <option value="recent">Most Recent</option>
            <option value="budget-high">Budget: High to Low</option>
            <option value="budget-low">Budget: Low to High</option>
          </select>
          <button className="text-xs font-black text-[#D34079] underline underline-offset-8">Sent Offers</button>
          <button className="text-xs font-black text-gray-400 hover:text-black transition-colors uppercase tracking-widest">Saved ({savedRequests.length})</button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="group bg-white border border-gray-100 hover:border-gray-300 p-0 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 p-6 lg:p-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#4A312F] text-[#B7E2BF] flex items-center justify-center font-black italic shadow-lg">
                      {req.buyer.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-black uppercase tracking-widest">{req.buyer}</h4>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                        <Clock size={10} /> {req.date} • <Users size={10} /> {req.offers} BIDS
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

                <div className="space-y-3">
                    <h3 className="text-xl font-black text-black leading-tight group-hover:text-[#D34079] transition-colors">
                      {req.title}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed max-w-3xl line-clamp-3">
                      {req.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                    {req.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-[#F7F9FB] border border-gray-200 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {tag}
                        </span>
                    ))}
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="bg-[#F7F9FB] lg:w-72 p-8 flex flex-row lg:flex-col justify-between items-center lg:justify-center border-t lg:border-t-0 lg:border-l border-gray-100 gap-6">
                <div className="text-left lg:text-center">
                  <p className="text-4xl font-black text-black tracking-tighter">{req.budget}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Fixed Budget</p>
                  <div className="flex items-center gap-1 justify-start lg:justify-center mt-3">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-black">{req.rating}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedRequest(req)}
                  className="bg-black hover:bg-[#D34079] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all transform active:scale-95 shadow-xl flex items-center gap-2"
                >
                  Send Offer <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 font-bold text-lg">No requests found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}