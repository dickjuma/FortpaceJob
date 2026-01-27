import React, { useState } from "react";
import { 
  MoreVertical, Briefcase, ChevronLeft, ChevronRight, Edit3, Eye, Trash2, 
  ChevronDown, ArrowUpRight, BarChart2, 
  Pause, Play, Copy, ExternalLink,
  CheckSquare, Square, Download, Share2, TrendingUp,
  Search, Filter, Grid, List, Plus, Sparkles,
  Zap, Clock, DollarSign, Users, Target,
  Calendar, Tag, Star, Globe, MessageSquare,
  AlertCircle, CheckCircle, X, RefreshCw,
  ArrowRight, TrendingDown, Shield, Award,
  Package, Layers, FileText, Settings
} from "lucide-react";

// Custom Components
const Badge = ({ children, variant = "default", size = "sm", className = "" }) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  const variantClasses = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    primary: "bg-blue-50 text-blue-700 border border-blue-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
    gray: "bg-gray-50 text-gray-600 border border-gray-200"
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, trendUp, loading }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
          <Icon className="text-gray-600" size={20} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trendUp === true ? 'text-green-600 bg-green-50 px-2 py-1 rounded-lg' : 
            trendUp === false ? 'text-red-600 bg-red-50 px-2 py-1 rounded-lg' : 
            'text-gray-500 bg-gray-50 px-2 py-1 rounded-lg'
          }`}>
            {trendUp === true ? <TrendingUp size={14} /> : 
             trendUp === false ? <TrendingDown size={14} /> : null}
            {trend}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
};

const ProgressBar = ({ value, max = 100, color = "blue", showLabel = true }) => {
  const percentage = (value / max) * 100;
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    gray: "bg-gray-500"
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Progress</span>
          <span className="font-semibold text-gray-900">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const ActionButton = ({ icon: Icon, label, variant = "default", onClick, disabled = false }) => {
  const baseClasses = "flex items-center justify-center gap-2 font-medium transition-all rounded-lg";
  const variantClasses = {
    default: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 ${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {Icon && <Icon size={16} />}
      {label}
    </button>
  );
};

const StatusIndicator = ({ status, size = "sm" }) => {
  const config = {
    active: { color: "bg-green-500", label: "Active", icon: Play },
    paused: { color: "bg-yellow-500", label: "Paused", icon: Pause },
    draft: { color: "bg-gray-500", label: "Draft", icon: FileText },
    pending: { color: "bg-blue-500", label: "Pending", icon: Clock },
    featured: { color: "bg-purple-500", label: "Featured", icon: Star }
  };

  const { color, label, icon: Icon } = config[status.toLowerCase()] || config.active;

  return (
    <div className="flex items-center gap-2">
      <div className={`${color} w-2 h-2 rounded-full`} />
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <Icon size={12} className="text-gray-400" />
    </div>
  );
};

// Sample Data
const GIGS = [
  { 
    id: "GIG-8821", 
    title: "Enterprise React SaaS Architecture & Scalable Systems", 
    status: "active", 
    price: 1250,
    category: "Web Development",
    rating: 4.9,
    orders: 47,
    stats: { 
      impressions: "12.4k", 
      clicks: 420, 
      ctr: "8.2%", 
      orders: 14, 
      revenue: "$17,500",
      conversion: "3.3%",
      rating: 4.9
    },
    trend: "+14.2%",
    trendUp: true,
    progress: 85,
    tags: ["React", "TypeScript", "AWS", "Scalability"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: "GIG-4402", 
    title: "UI/UX Audit & Conversion Rate Optimization", 
    status: "paused", 
    price: 350,
    category: "Design",
    rating: 4.7,
    orders: 23,
    stats: { 
      impressions: "2.1k", 
      clicks: 45, 
      ctr: "1.8%", 
      orders: 2, 
      revenue: "$700",
      conversion: "4.4%",
      rating: 4.7
    },
    trend: "-2.1%",
    trendUp: false,
    progress: 45,
    tags: ["UI/UX", "Figma", "Analytics"],
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: "GIG-7723", 
    title: "Custom WordPress Theme Development", 
    status: "active", 
    price: 850,
    category: "Web Development",
    rating: 5.0,
    orders: 89,
    stats: { 
      impressions: "8.9k", 
      clicks: 312, 
      ctr: "3.5%", 
      orders: 9, 
      revenue: "$7,650",
      conversion: "2.9%",
      rating: 5.0
    },
    trend: "+8.4%",
    trendUp: true,
    progress: 92,
    tags: ["WordPress", "PHP", "Custom Themes"],
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: "GIG-5567", 
    title: "Complete Mobile App Development with React Native", 
    status: "featured", 
    price: 2000,
    category: "Mobile Development",
    rating: 4.8,
    orders: 34,
    stats: { 
      impressions: "5.2k", 
      clicks: 189, 
      ctr: "3.6%", 
      orders: 5, 
      revenue: "$10,000",
      conversion: "2.6%",
      rating: 4.8
    },
    trend: "+22.7%",
    trendUp: true,
    progress: 78,
    tags: ["React Native", "iOS", "Android", "Firebase"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: "GIG-2234", 
    title: "Content Strategy & SEO Optimization Package", 
    status: "draft", 
    price: 500,
    category: "Marketing",
    rating: 4.6,
    orders: 0,
    stats: { 
      impressions: "0", 
      clicks: 0, 
      ctr: "0%", 
      orders: 0, 
      revenue: "$0",
      conversion: "0%",
      rating: 0
    },
    trend: "0%",
    trendUp: null,
    progress: 30,
    tags: ["SEO", "Content", "Strategy"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: "GIG-9987", 
    title: "Video Editing & Motion Graphics for Social Media", 
    status: "active", 
    price: 600,
    category: "Video Production",
    rating: 4.9,
    orders: 56,
    stats: { 
      impressions: "15.8k", 
      clicks: 890, 
      ctr: "5.6%", 
      orders: 22, 
      revenue: "$13,200",
      conversion: "2.5%",
      rating: 4.9
    },
    trend: "+31.2%",
    trendUp: true,
    progress: 95,
    tags: ["Video Editing", "Motion Graphics", "Social Media"],
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=400&q=80" 
  },
];

const CATEGORIES = [
  { id: "all", name: "All Gigs", count: 145, icon: Layers },
  { id: "active", name: "Active", count: 89, icon: Play },
  { id: "paused", name: "Paused", count: 12, icon: Pause },
  { id: "draft", name: "Drafts", count: 23, icon: FileText },
  { id: "featured", name: "Featured", count: 8, icon: Star }
];

const QuickActionModal = ({ isOpen, onClose, gigId }) => {
  const [action, setAction] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl border border-gray-200 max-w-md w-full shadow-xl">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Perform bulk actions on selected gigs</p>
        </div>
        
        <div className="p-5 space-y-3">
          <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-medium text-gray-900">Pause Selected</div>
            <div className="text-sm text-gray-500">Temporarily hide from marketplace</div>
          </button>
          <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-medium text-gray-900">Duplicate Selected</div>
            <div className="text-sm text-gray-500">Create copies with new IDs</div>
          </button>
          <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-medium text-gray-900">Export Performance Data</div>
            <div className="text-sm text-gray-500">Download CSV with analytics</div>
          </button>
          <button className="w-full p-4 text-left border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <div className="font-medium text-red-900">Delete Selected</div>
            <div className="text-sm text-red-600">This action cannot be undone</div>
          </button>
        </div>

        <div className="p-5 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            Cancel
          </button>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            Apply Actions
          </button>
        </div>
      </div>
    </div>
  );
};

const GigRow = ({ gig, isSelected, onSelect, viewMode = "list" }) => {
  const [showActions, setShowActions] = useState(false);

  if (viewMode === "grid") {
    return (
      <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all duration-200 hover:shadow-sm">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={gig.image} 
            alt={gig.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Selection Checkbox */}
          <div className="absolute top-4 left-4">
            <button 
              onClick={onSelect}
              className="bg-white p-2 rounded-lg border border-gray-300 hover:border-blue-500"
            >
              {isSelected ? (
                <CheckSquare size={18} className="text-blue-600" />
              ) : (
                <Square size={18} className="text-gray-400" />
              )}
            </button>
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant={gig.status === "active" ? "success" : gig.status === "paused" ? "warning" : gig.status === "featured" ? "purple" : "default"}>
              {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
            </Badge>
          </div>

          {/* Quick Stats Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{gig.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package size={14} />
                  <span className="text-sm">{gig.orders} orders</span>
                </div>
              </div>
              <div className="text-lg font-bold">${gig.price}</div>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm">{gig.title}</h3>
            <div className="flex flex-wrap gap-1 mb-4">
              {gig.tags.slice(0, 2).map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-700 rounded-md text-xs border border-gray-200">
                  {tag}
                </span>
              ))}
              {gig.tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded-md text-xs border border-gray-200">
                  +{gig.tags.length - 2}
                </span>
              )}
            </div>
          </div>

          <ProgressBar value={gig.progress} color={gig.progress > 80 ? "green" : "blue"} />

          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">{gig.stats.impressions}</div>
              <div className="text-xs text-gray-500">Impressions</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">{gig.stats.clicks}</div>
              <div className="text-xs text-gray-500">Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">{gig.stats.revenue}</div>
              <div className="text-xs text-gray-500">Revenue</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <ActionButton icon={Edit3} label="Edit" variant="outline" />
            <ActionButton 
              icon={gig.status === "active" ? Pause : Play} 
              label={gig.status === "active" ? "Pause" : "Activate"} 
              variant={gig.status === "active" ? "default" : "success"}
            />
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div 
      className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-4">
        {/* Selection & Image */}
        <div className="flex items-start gap-3">
          <button onClick={onSelect} className="mt-1">
            {isSelected ? (
              <CheckSquare size={20} className="text-blue-600" />
            ) : (
              <Square size={20} className="text-gray-300 hover:text-gray-400" />
            )}
          </button>
          
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
            <img src={gig.image} alt={gig.title} className="w-full h-full object-cover" />
            {gig.status === "featured" && (
              <div className="absolute top-1 right-1">
                <Star size={10} className="fill-yellow-400 text-yellow-400" />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <StatusIndicator status={gig.status} />
                <Badge variant="gray" size="sm">
                  {gig.category}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span>{gig.rating}</span>
                  <span className="mx-1">•</span>
                  <span>{gig.orders} orders</span>
                </div>
              </div>
              
              <h3 className="font-bold text-gray-900 mb-2 text-sm">{gig.title}</h3>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {gig.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-700 rounded-md text-xs border border-gray-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="text-right ml-4">
              <div className="text-lg font-bold text-gray-900 mb-1">${gig.price}</div>
              <div className={`flex items-center justify-end gap-1 text-sm font-medium ${
                gig.trendUp ? 'text-green-600' : gig.trendUp === false ? 'text-red-600' : 'text-gray-500'
              }`}>
                {gig.trendUp ? <TrendingUp size={14} /> : 
                 gig.trendUp === false ? <TrendingDown size={14} /> : null}
                {gig.trend}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div className="bg-gray-50 p-2 rounded-lg">
              <div className="text-sm font-semibold text-gray-900">{gig.stats.impressions}</div>
              <div className="text-xs text-gray-500">Impressions</div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
              <div className="text-sm font-semibold text-gray-900">{gig.stats.clicks}</div>
              <div className="text-xs text-gray-500">Clicks ({gig.stats.ctr} CTR)</div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
              <div className="text-sm font-semibold text-gray-900">{gig.stats.orders}</div>
              <div className="text-xs text-gray-500">Orders ({gig.stats.conversion})</div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
              <div className="text-sm font-semibold text-gray-900">{gig.stats.revenue}</div>
              <div className="text-xs text-gray-500">Revenue</div>
            </div>
          </div>

          {/* Progress & Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex-1 max-w-xs">
              <ProgressBar value={gig.progress} color={gig.progress > 80 ? "green" : "blue"} />
            </div>
            
            <div className={`flex items-center gap-2 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
              <ActionButton icon={Edit3} label="Edit" variant="outline" />
              <ActionButton 
                icon={gig.status === "active" ? Pause : Play} 
                label={gig.status === "active" ? "Pause" : "Activate"} 
                variant={gig.status === "active" ? "default" : "success"}
              />
              <button className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200">
                <MoreVertical size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ManageGigs() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedGigs, setSelectedGigs] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [stats, setStats] = useState({
    earnings: "$25.9K",
    impressions: "23.4K",
    clicks: "777",
    activeOrders: 23,
    totalGigs: 145,
    avgRating: 4.8
  });

  const toggleSelect = (id) => {
    setSelectedGigs(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentGigs = filteredGigs.map(g => g.id);
    setSelectedGigs(prev => 
      prev.length === currentGigs.length ? [] : currentGigs
    );
  };

  const filteredGigs = GIGS.filter(gig => {
    if (activeTab !== "all" && gig.status !== activeTab) return false;
    if (searchQuery && !gig.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeCategory = CATEGORIES.find(cat => cat.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <Briefcase size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gig Management</h1>
                  <p className="text-gray-600 mt-1 text-sm">Manage, optimize, and track your service offerings</p>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveTab(category.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === category.id
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={16} />
                      {category.name}
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        activeTab === category.id ? "bg-white/20" : "bg-gray-100"
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ActionButton icon={Download} label="Export" variant="outline" />
              <ActionButton 
                icon={Plus} 
                label="Create New Gig" 
                variant="primary"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={DollarSign}
            label="30-Day Earnings"
            value={stats.earnings}
            trend="+18.2%"
            trendUp={true}
          />
          <StatCard 
            icon={Eye}
            label="Total Impressions"
            value={stats.impressions}
            trend="+5.4%"
            trendUp={true}
          />
          <StatCard 
            icon={BarChart2}
            label="Click Through Rate"
            value={stats.clicks}
            trend="+2.1%"
            trendUp={true}
          />
          <StatCard 
            icon={Users}
            label="Active Orders"
            value={stats.activeOrders}
            trend="Ongoing"
            trendUp={null}
          />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSelectAll}
                    className="p-2 hover:bg-gray-100 rounded-lg border border-gray-300"
                    title="Select all"
                  >
                    {selectedGigs.length === filteredGigs.length ? (
                      <CheckSquare size={18} className="text-blue-600" />
                    ) : (
                      <Square size={18} className="text-gray-400" />
                    )}
                  </button>
                  <div className="text-sm text-gray-600">
                    {selectedGigs.length} of {filteredGigs.length} selected
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search gigs by title, tags, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full lg:w-80 pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-white border border-gray-300" : "hover:bg-gray-200"}`}
                  >
                    <List size={16} className={viewMode === "list" ? "text-blue-600" : "text-gray-600"} />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-white border border-gray-300" : "hover:bg-gray-200"}`}
                  >
                    <Grid size={16} className={viewMode === "grid" ? "text-blue-600" : "text-gray-600"} />
                  </button>
                </div>

                {/* Filter & Actions */}
                <ActionButton icon={Filter} label="Filter" variant="outline" />
                
                {selectedGigs.length > 0 && (
                  <ActionButton
                    onClick={() => setShowQuickActions(true)}
                    icon={Zap}
                    label="Quick Actions"
                    variant="primary"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="p-4">
            {filteredGigs.length > 0 ? (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                : "space-y-3"
              }>
                {filteredGigs.map(gig => (
                  <GigRow
                    key={gig.id}
                    gig={gig}
                    isSelected={selectedGigs.includes(gig.id)}
                    onSelect={() => toggleSelect(gig.id)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No gigs found</h3>
                <p className="text-gray-600 mb-6 text-sm">Try adjusting your filters or search terms</p>
                <ActionButton 
                  icon={Plus}
                  label="Create Your First Gig"
                  variant="primary"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredGigs.length} of {GIGS.length} gigs
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 border border-gray-300 rounded hover:bg-white">
                <ChevronLeft size={16} />
              </button>
              {[1, 2, 3].map(num => (
                <button
                  key={num}
                  className={`w-8 h-8 rounded text-sm ${
                    num === 1
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {num}
                </button>
              ))}
              <span className="text-gray-400 mx-1">...</span>
              <button className="w-8 h-8 rounded hover:bg-gray-100 text-sm">
                10
              </button>
              <button className="p-2 border border-gray-300 rounded hover:bg-white">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <Sparkles size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">AI Performance Insights</h3>
                <p className="text-gray-600 text-sm">Smart recommendations to boost your gigs</p>
              </div>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <Target size={18} className="text-blue-600" />
                <span className="font-semibold text-gray-900">Optimization Tip</span>
              </div>
              <p className="text-gray-700 text-sm">
                Add 3 more portfolio items to "React SaaS" gig to increase conversions by 23%
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp size={18} className="text-green-600" />
                <span className="font-semibold text-gray-900">Best Time to Post</span>
              </div>
              <p className="text-gray-700 text-sm">
                Post updates on Wednesday at 2 PM EST for 37% more visibility
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-3 mb-3">
                <Award size={18} className="text-purple-600" />
                <span className="font-semibold text-gray-900">Quality Score</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">92/100</span>
                <Badge variant="success" size="sm">Excellent</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Modal */}
      <QuickActionModal
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        gigId={selectedGigs[0]}
      />
    </div>
  );
}