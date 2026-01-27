import React, { useState } from "react";
import { 
  Clock, 
  Tag, 
  Users, 
  ChevronRight, 
  Zap, 
  Filter, 
  Search, 
  Send, 
  FileText, 
  ShieldCheck, 
  DollarSign, 
  Paperclip, 
  AlertCircle, 
  Star, 
  Heart, 
  ChevronDown, 
  X, 
  Upload, 
  CheckCircle,
  Calendar,
  MapPin,
  Briefcase,
  Eye,
  TrendingUp,
  CheckSquare
} from "lucide-react";

const SendProposalForm = ({ request, onBack }) => {
  const [formData, setFormData] = useState({
    description: "",
    price: "",
    deliveryTime: "3",
    revisions: "1",
    attachments: []
  });
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState(1);

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
    <div className="max-w-6xl mx-auto">
      <button 
        onClick={onBack} 
        className="mb-6 text-sm font-medium text-gray-500 hover:text-gray-800 flex items-center gap-2 transition-colors"
      >
        <ChevronDown className="rotate-90" size={16} />
        Back to requests
      </button>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Header Summary */}
        <div className="bg-gray-50 p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={14} className="text-blue-600" />
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Custom Offer</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{request.title}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-gray-600">Client: {request.buyer}</span>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium">{request.rating || "New"}</span>
                </div>
                <span className="text-xs text-gray-500">{request.jobsPosted || 3} jobs posted</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
              <p className="text-xs font-medium text-gray-500 mb-1">Buyer Budget</p>
              <p className="text-lg font-semibold text-gray-900">{request.budget}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Request Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Request Details</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{request.description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {request.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
              }`}>
                1
              </div>
              <span className={`text-sm ${step >= 1 ? "font-medium text-gray-900" : "text-gray-500"}`}>
                Proposal
              </span>
            </div>
            <div className="h-1 w-8 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
              }`}>
                2
              </div>
              <span className={`text-sm ${step >= 2 ? "font-medium text-gray-900" : "text-gray-500"}`}>
                Details
              </span>
            </div>
            <div className="h-1 w-8 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
              }`}>
                3
              </div>
              <span className={`text-sm ${step >= 3 ? "font-medium text-gray-900" : "text-gray-500"}`}>
                Review
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-base font-medium text-gray-900 block">Your Proposal</label>
            <textarea 
              className="w-full border border-gray-300 rounded-lg p-4 min-h-[180px] focus:border-blue-500 focus:outline-none text-gray-700 text-sm leading-relaxed"
              placeholder="Describe your approach, relevant experience, and why you're the best fit for this project..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
            <div className="flex justify-between">
              <p className="text-xs text-gray-500">{formData.description.length} / 1000 characters</p>
              <p className="text-xs text-gray-500">Required</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Offer Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded-lg py-2.5 pl-9 pr-3 font-medium text-gray-900 outline-none focus:border-blue-500" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Delivery (Days)</label>
                  <input 
                    type="number" 
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3 font-medium text-gray-900 outline-none focus:border-blue-500" 
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Attachments (Optional)</label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto mb-3 text-gray-400" size={24} />
                  <p className="text-sm text-gray-600 mb-1">
                    Drag & drop files or <label className="text-blue-600 cursor-pointer font-medium">browse</label>
                    <input type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                  </p>
                  <p className="text-xs text-gray-500">Max 3 files, 10MB each</p>
                </div>
                {formData.attachments.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {formData.attachments.map((file, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">{file.name}</span>
                        </div>
                        <button 
                          onClick={() => setFormData({...formData, attachments: formData.attachments.filter((_, idx) => idx !== i)})} 
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start gap-3 text-yellow-800">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <p className="text-sm">Ensure your price includes all labor and material costs.</p>
              </div>
            </div>

            {/* Fee Breakdown Card */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-4">Earnings Summary</p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Offer Total</span>
                  <span className="font-semibold text-gray-900">${formData.price || "0.00"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Fee (20%)</span>
                  <span className="font-semibold text-red-600">-${serviceFee}</span>
                </div>
                <div className="border-t border-gray-200 my-3"></div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">You'll Earn</span>
                  <span className="text-2xl font-bold text-gray-900">${netIncome}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Benefits of custom offers:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckSquare size={14} className="text-green-500" />
                    Stand out from competitors
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare size={14} className="text-green-500" />
                    Flexible pricing & timeline
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare size={14} className="text-green-500" />
                    Direct client communication
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm">
              Save as Draft
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => step > 1 && setStep(step - 1)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Back
              </button>
              <button 
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm flex items-center gap-2"
              >
                Submit Offer
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ViewRequests() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedRequests, setSavedRequests] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "Web Dev", name: "Web Development" },
    { id: "Design", name: "Design" },
    { id: "Marketing", name: "Marketing" },
    { id: "Writing", name: "Writing" },
    { id: "Video", name: "Video Production" }
  ];

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
      jobsPosted: 8,
      location: "Remote",
      verified: true,
      urgent: false
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
      jobsPosted: 15,
      location: "New York, USA",
      verified: true,
      urgent: true
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
      jobsPosted: 5,
      location: "Remote",
      verified: true,
      urgent: false
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
      jobsPosted: 1,
      location: "Los Angeles, USA",
      verified: false,
      urgent: true
    }
  ];

  const filteredRequests = requests
    .filter(req => activeFilter === "all" || req.category === activeFilter)
    .filter(req => 
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "budget-high") return parseFloat(b.budget.replace(/[$,]/g, "")) - parseFloat(a.budget.replace(/[$,]/g, ""));
      if (sortBy === "budget-low") return parseFloat(a.budget.replace(/[$,]/g, "")) - parseFloat(b.budget.replace(/[$,]/g, ""));
      if (sortBy === "offers-low") return a.offers - b.offers;
      return 0;
    });

  const toggleSave = (id) => {
    setSavedRequests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setActiveFilter("all");
    setSearchQuery("");
    setSortBy("recent");
  };

  if (selectedRequest) {
    return <SendProposalForm request={selectedRequest} onBack={() => setSelectedRequest(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Buyer Requests</h1>
            <p className="text-gray-600 mt-1">Find and apply to relevant projects</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">8 offers left today</div>
              <div className="text-xs text-gray-500">Reset in 4 hours</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Zap size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search requests, skills, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter size={16} />
                Filter
              </button>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="budget-high">Budget: High to Low</option>
                <option value="budget-low">Budget: Low to High</option>
                <option value="offers-low">Least Competition</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === cat.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    />
                    <input 
                      type="number" 
                      placeholder="Max" 
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2 text-sm">
                    <option>Anywhere</option>
                    <option>North America</option>
                    <option>Europe</option>
                    <option>Asia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Other Filters</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      Verified Buyers Only
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      Urgent Projects
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Requests</div>
          <div className="text-xl font-semibold text-gray-900">{filteredRequests.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Avg. Budget</div>
          <div className="text-xl font-semibold text-gray-900">$688</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Avg. Competition</div>
          <div className="text-xl font-semibold text-gray-900">28 bids</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Response Rate</div>
          <div className="text-xl font-semibold text-gray-900">85%</div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {req.verified && (
                          <ShieldCheck size={14} className="text-blue-600" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">{req.buyer}</h3>
                        {req.urgent && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                            Urgent
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{req.title}</h4>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{req.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {req.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => toggleSave(req.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart 
                        size={20} 
                        className={savedRequests.includes(req.id) ? "fill-red-500 text-red-500" : ""}
                      />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {req.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      {req.offers} offers
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {req.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {req.location}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:w-48 space-y-4">
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-gray-900">{req.budget}</div>
                    <div className="text-sm text-gray-500">Fixed price</div>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{req.rating}</span>
                    <span className="text-sm text-gray-500">({req.jobsPosted} jobs)</span>
                  </div>

                  <button 
                    onClick={() => setSelectedRequest(req)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    Send Offer
                  </button>
                  
                  <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
          <button 
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredRequests.length > 0 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-600">
            Showing {filteredRequests.length} of {requests.length} requests
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}