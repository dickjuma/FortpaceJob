import React, { useState, useEffect } from "react";
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
  Package, Layers, FileText, Settings,
  DollarSign as Dollar, Eye as EyeIcon,
  MousePointer, Percent, TrendingUp as TrendingUpIcon,
  Users as UserIcon, ShoppingCart, Timer,
  BarChart3, Bell, ArrowUpDown, Check,
  PieChart, LineChart, Activity,
  Target as TargetIcon, Rocket, TrendingDown as TrendingDownIcon
} from "lucide-react";

// Custom Components with Fiverr styling
const Badge = ({ children, variant = "default", size = "sm", className = "" }) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  const sizeClasses = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  const variantClasses = {
    default: "bg-[#F3E9E5] text-[#4A312F]",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    primary: "bg-[#FDECE7] text-[#9E331E] border border-[#F4C7A1]",
    purple: "bg-purple-100 text-purple-800 border border-purple-200",
    gray: "bg-[#F8F4F1] text-[#6B5B50] border border-[#E7E1DE]",
    fiverr: "bg-green-50 text-green-700 border border-green-200"
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  trendDirection = "neutral",
  description,
  loading = false,
  onClick
}) => {
  const getTrendColor = () => {
    switch(trendDirection) {
      case "up": return "text-green-600 bg-green-50 border-green-200";
      case "down": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-[#6B5B50] bg-[#F8F4F1] border-[#E7E1DE]";
    }
  };

  const getTrendIcon = () => {
    switch(trendDirection) {
      case "up": return <TrendingUpIcon size={12} />;
      case "down": return <TrendingDownIcon size={12} />;
      default: return null;
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl border border-[#E7E1DE] p-5 hover:border-green-300 hover:shadow-sm transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${
            trendDirection === "up" ? "bg-green-50 border border-green-100" :
            trendDirection === "down" ? "bg-red-50 border border-red-100" :
            "bg-[#F8F4F1] border border-[#E7E1DE]"
          }`}>
            <Icon className={`
              ${trendDirection === "up" ? "text-green-600" :
              trendDirection === "down" ? "text-red-600" :
              "text-[#6B5B50]"}
            `} size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2E2322]">{value}</div>
            <div className="text-sm text-[#7A5A4C]">{label}</div>
          </div>
        </div>
        
        {trend && (
          <div className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 border ${getTrendColor()}`}>
            {getTrendIcon()}
            {trend}
          </div>
        )}
      </div>
      
      {description && (
        <div className="text-xs text-[#7A5A4C] border-t border-[#E7E1DE] pt-3 mt-3">
          {description}
        </div>
      )}
    </div>
  );
};

const ProgressBar = ({ value, max = 100, label, showPercentage = true, color = "green" }) => {
  const percentage = (value / max) * 100;
  
  const colorClasses = {
    green: "bg-green-500",
    blue: "bg-[#FDECE7]",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500"
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#4A312F]">{label}</span>
          {showPercentage && (
            <span className="text-sm font-semibold text-[#2E2322]">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className="h-2 bg-[#F3E9E5] rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-700`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

const ActionButton = ({ 
  icon: Icon, 
  label, 
  variant = "default", 
  onClick, 
  disabled = false,
  size = "md",
  fullWidth = false
}) => {
  const baseClasses = "flex items-center justify-center gap-2 font-medium transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2";
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base"
  };
  
  const variantClasses = {
    default: "bg-[#F3E9E5] text-[#4A312F] hover:bg-[#EFE7E2] border border-[#E7E1DE]",
    primary: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    outline: "bg-white text-[#4A312F] border border-[#E7E1DE] hover:bg-[#F8F4F1]",
    ghost: "text-[#6B5B50] hover:bg-[#F3E9E5] hover:text-[#2E2322]"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses} 
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {Icon && <Icon size={16} />}
      {label}
    </button>
  );
};

const StatusIndicator = ({ status, showIcon = true }) => {
  const config = {
    active: { 
      color: "bg-green-500", 
      label: "Active", 
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: Play 
    },
    paused: { 
      color: "bg-yellow-500", 
      label: "Paused", 
      textColor: "text-yellow-700",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      icon: Pause 
    },
    draft: { 
      color: "bg-[#F8F4F1]0", 
      label: "Draft", 
      textColor: "text-[#4A312F]",
      bgColor: "bg-[#F8F4F1]",
      borderColor: "border-[#E7E1DE]",
      icon: FileText 
    },
    pending: { 
      color: "bg-[#FDECE7]", 
      label: "Pending Review", 
      textColor: "text-[#B53A27]",
      bgColor: "bg-[#FDECE7]",
      borderColor: "border-[#F4C7A1]",
      icon: Clock 
    },
    featured: { 
      color: "bg-purple-500", 
      label: "Featured", 
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      icon: Star 
    },
    limited: { 
      color: "bg-orange-500", 
      label: "Limited Availability", 
      textColor: "text-orange-700",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      icon: AlertCircle 
    }
  };

  const { color, label: statusLabel, textColor, bgColor, borderColor, icon: Icon } = config[status] || config.active;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${bgColor} ${borderColor} border`}>
      <div className="flex items-center gap-2">
        <div className={`${color} w-2 h-2 rounded-full`} />
        <span className={`font-medium ${textColor}`}>{statusLabel}</span>
      </div>
      {showIcon && <Icon size={14} className={textColor} />}
    </div>
  );
};

// Enhanced Sample Data with realistic metrics
const GIGS = [
  { 
    id: "GIG-8821", 
    title: "I will create enterprise React SaaS with scalable architecture", 
    status: "active", 
    price: 1250,
    category: "Web Development",
    rating: 4.9,
    reviews: 128,
    orders: 47,
    responseTime: "2h",
    deliveryTime: "7 days",
    impressions: 12456,
    clicks: 420,
    ctr: "3.4%",
    conversions: 14,
    conversionRate: "3.3%",
    revenue: "$17,500",
    completionRate: "95%",
    tags: ["React", "TypeScript", "AWS", "Scalability", "SaaS"],
    createdAt: "2023-10-15",
    lastOrder: "2024-01-10",
    performanceScore: 92,
    qualityScore: 94,
    customerSatisfaction: 96,
    gigExtras: ["Express Delivery", "Source Files", "Maintenance"],
    isPromoted: true,
    promotionBudget: 150,
    views: 2456,
    saves: 187,
    gigUrl: "react-saas-enterprise"
  },
  { 
    id: "GIG-4402", 
    title: "I will perform UI/UX audit and conversion rate optimization", 
    status: "paused", 
    price: 350,
    category: "Design",
    rating: 4.7,
    reviews: 89,
    orders: 23,
    responseTime: "4h",
    deliveryTime: "3 days",
    impressions: 2104,
    clicks: 45,
    ctr: "2.1%",
    conversions: 2,
    conversionRate: "4.4%",
    revenue: "$700",
    completionRate: "85%",
    tags: ["UI/UX", "Figma", "Analytics", "CRO"],
    createdAt: "2023-11-20",
    lastOrder: "2024-01-05",
    performanceScore: 76,
    qualityScore: 88,
    customerSatisfaction: 92,
    gigExtras: ["Additional Revision", "Source Files"],
    isPromoted: false,
    views: 987,
    saves: 56,
    gigUrl: "ui-ux-audit-cro"
  },
  { 
    id: "GIG-7723", 
    title: "I will develop custom WordPress theme from scratch", 
    status: "active", 
    price: 850,
    category: "Web Development",
    rating: 5.0,
    reviews: 156,
    orders: 89,
    responseTime: "1h",
    deliveryTime: "5 days",
    impressions: 8920,
    clicks: 312,
    ctr: "3.5%",
    conversions: 9,
    conversionRate: "2.9%",
    revenue: "$7,650",
    completionRate: "98%",
    tags: ["WordPress", "PHP", "Custom Themes", "WooCommerce"],
    createdAt: "2023-09-05",
    lastOrder: "2024-01-12",
    performanceScore: 88,
    qualityScore: 95,
    customerSatisfaction: 100,
    gigExtras: ["Plugin Installation", "SEO Setup", "Maintenance"],
    isPromoted: true,
    promotionBudget: 80,
    views: 3120,
    saves: 245,
    gigUrl: "wordpress-custom-theme"
  },
  { 
    id: "GIG-5567", 
    title: "I will build mobile app with React Native and Firebase", 
    status: "featured", 
    price: 2000,
    category: "Mobile Development",
    rating: 4.8,
    reviews: 67,
    orders: 34,
    responseTime: "3h",
    deliveryTime: "14 days",
    impressions: 5210,
    clicks: 189,
    ctr: "3.6%",
    conversions: 5,
    conversionRate: "2.6%",
    revenue: "$10,000",
    completionRate: "92%",
    tags: ["React Native", "iOS", "Android", "Firebase", "Mobile App"],
    createdAt: "2023-12-01",
    lastOrder: "2024-01-08",
    performanceScore: 85,
    qualityScore: 90,
    customerSatisfaction: 94,
    gigExtras: ["App Store Submission", "Backend API", "Admin Panel"],
    isPromoted: true,
    promotionBudget: 200,
    views: 1890,
    saves: 134,
    gigUrl: "react-native-mobile-app"
  },
  { 
    id: "GIG-2234", 
    title: "I will create content strategy and SEO optimization plan", 
    status: "draft", 
    price: 500,
    category: "Marketing",
    rating: 4.6,
    reviews: 42,
    orders: 18,
    responseTime: "6h",
    deliveryTime: "4 days",
    impressions: 0,
    clicks: 0,
    ctr: "0%",
    conversions: 0,
    conversionRate: "0%",
    revenue: "$0",
    completionRate: "0%",
    tags: ["SEO", "Content Strategy", "Marketing", "Analytics"],
    createdAt: "2024-01-01",
    lastOrder: null,
    performanceScore: 0,
    qualityScore: 75,
    customerSatisfaction: 0,
    gigExtras: ["Competitor Analysis", "Monthly Report"],
    isPromoted: false,
    views: 0,
    saves: 0,
    gigUrl: "content-strategy-seo"
  },
  { 
    id: "GIG-9987", 
    title: "I will edit video and create motion graphics for social media", 
    status: "active", 
    price: 600,
    category: "Video Production",
    rating: 4.9,
    reviews: 203,
    orders: 56,
    responseTime: "1h",
    deliveryTime: "2 days",
    impressions: 15840,
    clicks: 890,
    ctr: "5.6%",
    conversions: 22,
    conversionRate: "2.5%",
    revenue: "$13,200",
    completionRate: "96%",
    tags: ["Video Editing", "Motion Graphics", "Social Media", "Adobe Premiere"],
    createdAt: "2023-08-15",
    lastOrder: "2024-01-11",
    performanceScore: 95,
    qualityScore: 96,
    customerSatisfaction: 98,
    gigExtras: ["Express Delivery", "Color Grading", "Sound Design"],
    isPromoted: true,
    promotionBudget: 120,
    views: 4567,
    saves: 389,
    gigUrl: "video-editing-motion-graphics"
  },
];

const CATEGORIES = [
  { id: "all", name: "All Gigs", count: 145, icon: Layers, color: "text-[#6B5B50]" },
  { id: "active", name: "Active", count: 89, icon: Play, color: "text-green-600" },
  { id: "paused", name: "Paused", count: 12, icon: Pause, color: "text-yellow-600" },
  { id: "draft", name: "Drafts", count: 23, icon: FileText, color: "text-[#6B5B50]" },
  { id: "featured", name: "Featured", count: 8, icon: Star, color: "text-purple-600" },
  { id: "promoted", name: "Promoted", count: 15, icon: Rocket, color: "text-[#C9452F]" }
];

// Enhanced Analytics Data
const ANALYTICS = {
  totalRevenue: "$48,050",
  avgOrderValue: "$842",
  totalOrders: 57,
  avgResponseTime: "2.3h",
  overallRating: 4.8,
  gigPerformanceScore: 89,
  customerSatisfaction: 95,
  repeatCustomers: 42,
  monthlyGrowth: "+18.2%",
  topPerformingCategory: "Web Development"
};

const QuickActionModal = ({ isOpen, onClose, selectedGigs }) => {
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const actions = [
    {
      icon: Pause,
      title: "Pause Selected",
      description: "Temporarily hide from marketplace",
      variant: "warning",
      action: "pause"
    },
    {
      icon: Play,
      title: "Activate Selected",
      description: "Make gigs visible to buyers",
      variant: "success",
      action: "activate"
    },
    {
      icon: Copy,
      title: "Duplicate Gigs",
      description: "Create copies with new IDs",
      variant: "default",
      action: "duplicate"
    },
    {
      icon: TrendingUp,
      title: "Promote Gigs",
      description: "Boost visibility with promotion",
      variant: "primary",
      action: "promote"
    },
    {
      icon: RefreshCw,
      title: "Refresh Listings",
      description: "Update all selected gigs",
      variant: "default",
      action: "refresh"
    },
    {
      icon: Download,
      title: "Export Analytics",
      description: "Download performance data as CSV",
      variant: "default",
      action: "export"
    }
  ];

  const handleAction = async (actionType) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    switch(actionType) {
      case 'pause':
        alert(`Paused ${selectedGigs.length} gig(s)`);
        break;
      case 'activate':
        alert(`Activated ${selectedGigs.length} gig(s)`);
        break;
      case 'duplicate':
        alert(`Duplicated ${selectedGigs.length} gig(s)`);
        break;
      default:
        alert(`Action completed for ${selectedGigs.length} gig(s)`);
    }
    
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl border border-[#E7E1DE] max-w-2xl w-full shadow-xl">
        <div className="p-6 border-b border-[#E7E1DE]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#2E2322]">Bulk Actions</h3>
              <p className="text-sm text-[#7A5A4C] mt-1">
                {selectedGigs.length} gig(s) selected
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[#F3E9E5] rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {actions.map((item) => (
              <button
                key={item.action}
                onClick={() => handleAction(item.action)}
                disabled={loading}
                className="p-4 text-left border border-[#E7E1DE] rounded-lg hover:border-green-300 hover:shadow-sm transition-all duration-200 flex items-start gap-3"
              >
                <div className={`p-2 rounded-lg ${
                  item.variant === 'success' ? 'bg-green-50 text-green-600 border border-green-200' :
                  item.variant === 'warning' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                  item.variant === 'primary' ? 'bg-[#FDECE7] text-[#C9452F] border border-[#F4C7A1]' :
                  'bg-[#F8F4F1] text-[#6B5B50] border border-[#E7E1DE]'
                }`}>
                  <item.icon size={18} />
                </div>
                <div>
                  <div className="font-medium text-[#2E2322]">{item.title}</div>
                  <div className="text-sm text-[#7A5A4C]">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-0.5" size={18} />
              <div>
                <h4 className="font-medium text-red-900">Danger Zone</h4>
                <p className="text-sm text-red-700 mt-1">
                  Deleting gigs will remove all data and cannot be undone
                </p>
                <button className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                  Delete Selected Gigs
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#E7E1DE] flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2.5 text-[#4A312F] hover:text-[#2E2322] hover:bg-[#F3E9E5] rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

const GigRow = ({ gig, isSelected, onSelect, viewMode = "list", onAction }) => {
  const [showActions, setShowActions] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 70) return "text-[#C9452F] bg-[#FDECE7] border-[#F4C7A1]";
    if (score >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  if (viewMode === "grid") {
    return (
      <div className="group bg-white border border-[#E7E1DE] rounded-xl overflow-hidden hover:border-green-300 transition-all duration-200 hover:shadow-sm">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#F8F4F1] to-[#EFE7E2]">
          {/* Selection Checkbox */}
          <div className="absolute top-4 left-4 z-10">
            <button 
              onClick={onSelect}
              className="bg-white p-2 rounded-lg border border-[#E7E1DE] hover:border-green-500 shadow-sm"
            >
              {isSelected ? (
                <CheckSquare size={18} className="text-green-600" />
              ) : (
                <Square size={18} className="text-[#A38F85]" />
              )}
            </button>
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-10">
            <StatusIndicator status={gig.status} showIcon={false} />
          </div>

          {/* Promotion Badge */}
          {gig.isPromoted && (
            <div className="absolute top-12 right-4 z-10">
              <Badge variant="primary" size="xs">
                <Rocket size={10} /> Promoted
              </Badge>
            </div>
          )}

          {/* Gig Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
            <div className="text-white">
              <h3 className="font-bold text-white mb-1 text-sm line-clamp-1">{gig.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold">{gig.rating}</span>
                  </div>
                  <span className="text-xs text-[#C1B1A8]">({gig.reviews})</span>
                </div>
                <div className="text-lg font-bold text-white">${gig.price}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-[#2E2322]">{formatNumber(gig.impressions)}</div>
              <div className="text-xs text-[#7A5A4C]">Impressions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#2E2322]">{gig.clicks}</div>
              <div className="text-xs text-[#7A5A4C]">Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#2E2322]">{gig.conversions}</div>
              <div className="text-xs text-[#7A5A4C]">Orders</div>
            </div>
          </div>

          {/* Performance Score */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#4A312F]">Performance</span>
              <span className={`text-xs px-2 py-1 rounded-full border ${getPerformanceColor(gig.performanceScore)}`}>
                {gig.performanceScore}/100
              </span>
            </div>
            <ProgressBar value={gig.performanceScore} color={gig.performanceScore >= 90 ? "green" : "blue"} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ActionButton 
              icon={Edit3} 
              label="Edit" 
              variant="outline" 
              size="sm"
              fullWidth
            />
            <ActionButton 
              icon={gig.status === "active" ? Pause : Play} 
              label={gig.status === "active" ? "Pause" : "Activate"} 
              variant={gig.status === "active" ? "default" : "success"}
              size="sm"
              fullWidth
            />
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div 
      className="bg-white border border-[#E7E1DE] rounded-xl p-4 hover:border-green-300 hover:shadow-sm transition-all duration-200"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-4">
        {/* Selection & Status */}
        <div className="flex items-start gap-3">
          <button onClick={onSelect} className="mt-1">
            {isSelected ? (
              <CheckSquare size={20} className="text-green-600" />
            ) : (
              <Square size={20} className="text-[#C1B1A8] hover:text-[#A38F85]" />
            )}
          </button>
          
          <div className="flex flex-col items-center gap-2">
            <StatusIndicator status={gig.status} />
            {gig.isPromoted && (
              <Badge variant="primary" size="xs">
                <Rocket size={10} /> Promoted
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-[#2E2322] mb-2 text-sm hover:text-green-700 cursor-pointer">
                {gig.title}
              </h3>
              
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <Badge variant="gray" size="sm">
                  {gig.category}
                </Badge>
                
                <div className="flex items-center gap-2 text-sm text-[#6B5B50]">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{gig.rating}</span>
                    <span className="text-[#7A5A4C]">({gig.reviews})</span>
                  </div>
                  <span className="text-[#C1B1A8]">•</span>
                  <div className="flex items-center gap-1">
                    <Package size={12} />
                    <span>{gig.orders} orders</span>
                  </div>
                  <span className="text-[#C1B1A8]">•</span>
                  <div className="flex items-center gap-1">
                    <Timer size={12} />
                    <span>{gig.deliveryTime}</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="bg-[#F8F4F1] p-3 rounded-lg border border-[#E7E1DE]">
                  <div className="text-sm font-semibold text-[#2E2322]">{formatNumber(gig.impressions)}</div>
                  <div className="text-xs text-[#7A5A4C] flex items-center gap-1">
                    <EyeIcon size={10} />
                    Impressions
                  </div>
                </div>
                <div className="bg-[#F8F4F1] p-3 rounded-lg border border-[#E7E1DE]">
                  <div className="text-sm font-semibold text-[#2E2322]">{gig.clicks}</div>
                  <div className="text-xs text-[#7A5A4C] flex items-center gap-1">
                    <MousePointer size={10} />
                    Clicks ({gig.ctr})
                  </div>
                </div>
                <div className="bg-[#F8F4F1] p-3 rounded-lg border border-[#E7E1DE]">
                  <div className="text-sm font-semibold text-[#2E2322]">{gig.conversions}</div>
                  <div className="text-xs text-[#7A5A4C] flex items-center gap-1">
                    <ShoppingCart size={10} />
                    Orders ({gig.conversionRate})
                  </div>
                </div>
                <div className="bg-[#F8F4F1] p-3 rounded-lg border border-[#E7E1DE]">
                  <div className="text-sm font-semibold text-[#2E2322]">{gig.revenue}</div>
                  <div className="text-xs text-[#7A5A4C] flex items-center gap-1">
                    <Dollar size={10} />
                    Revenue
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Trend */}
            <div className="text-right ml-4 flex flex-col items-end">
              <div className="text-2xl font-bold text-[#2E2322] mb-1">${gig.price}</div>
              <div className="text-sm text-[#7A5A4C] mb-2">{gig.responseTime} avg response</div>
              
              <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${
                gig.performanceScore >= 90 ? 'text-green-600 bg-green-50 border border-green-200' :
                gig.performanceScore >= 70 ? 'text-[#C9452F] bg-[#FDECE7] border border-[#F4C7A1]' :
                'text-yellow-600 bg-yellow-50 border border-yellow-200'
              }`}>
                <TargetIcon size={12} />
                {gig.performanceScore}/100
              </div>
            </div>
          </div>

          {/* Tags & Progress */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E7E1DE]">
            <div className="flex-1">
              <div className="flex flex-wrap gap-1 mb-3">
                {gig.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-[#F8F4F1] text-[#4A312F] rounded-md text-xs border border-[#E7E1DE]">
                    {tag}
                  </span>
                ))}
                {gig.tags.length > 3 && (
                  <span className="px-2 py-1 bg-[#F8F4F1] text-[#7A5A4C] rounded-md text-xs border border-[#E7E1DE]">
                    +{gig.tags.length - 3}
                  </span>
                )}
              </div>
              
              <div className="max-w-xs">
                <ProgressBar 
                  value={gig.performanceScore} 
                  label="Performance Score" 
                  color={gig.performanceScore >= 90 ? "green" : "blue"}
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className={`flex items-center gap-2 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
              <ActionButton 
                icon={BarChart3}
                label="Analytics"
                variant="ghost"
                size="sm"
                onClick={() => setShowAnalytics(true)}
              />
              <ActionButton 
                icon={Edit3} 
                label="Edit" 
                variant="outline" 
                size="sm"
              />
              <ActionButton 
                icon={gig.status === "active" ? Pause : Play} 
                label={gig.status === "active" ? "Pause" : "Activate"} 
                variant={gig.status === "active" ? "default" : "success"}
                size="sm"
              />
              <button className="p-2 hover:bg-[#F3E9E5] rounded-lg border border-[#E7E1DE]">
                <MoreVertical size={16} className="text-[#6B5B50]" />
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
  const [timeRange, setTimeRange] = useState("30d");
  const [stats, setStats] = useState({
    totalRevenue: "$48,050",
    avgOrderValue: "$842",
    totalOrders: 57,
    conversionRate: "3.2%",
    activeGigs: 89,
    gigPerformance: 89,
    customerSatisfaction: 95,
    repeatRate: "42%"
  });

  // Analytics data
  const [analytics, setAnalytics] = useState({
    monthlyRevenue: [12500, 18700, 15200, 22000, 18900, 25600, 31200, 28000, 33100, 29400, 37600, 48050],
    monthlyOrders: [32, 45, 38, 52, 41, 58, 67, 61, 72, 64, 81, 103],
    trafficSources: {
      organic: 45,
      promoted: 28,
      social: 15,
      direct: 8,
      referral: 4
    }
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

  const timeRanges = [
    { id: "7d", label: "Last 7 days" },
    { id: "30d", label: "Last 30 days" },
    { id: "90d", label: "Last 90 days" },
    { id: "ytd", label: "Year to date" }
  ];

  return (
    <div className="min-h-screen bg-[#F8F4F1]">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-[#E7E1DE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <Briefcase size={24} className="text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#2E2322]">Gig Management</h1>
                  <p className="text-[#6B5B50] mt-1 text-sm">Manage your services, track performance, and optimize earnings</p>
                </div>
              </div>
              
              {/* Enhanced Tabs */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(category => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveTab(category.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          activeTab === category.id
                            ? "bg-green-600 text-white shadow-sm"
                            : "bg-white text-[#4A312F] border border-[#E7E1DE] hover:bg-[#F8F4F1]"
                        }`}
                      >
                        <Icon size={16} className={activeTab === category.id ? "text-white" : category.color} />
                        {category.name}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          activeTab === category.id ? "bg-white/20" : "bg-[#F3E9E5] text-[#6B5B50]"
                        }`}>
                          {category.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Range Selector */}
                <div className="hidden lg:flex items-center gap-2">
                  <span className="text-sm text-[#7A5A4C]">Period:</span>
                  <select 
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="text-sm border border-[#E7E1DE] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  >
                    {timeRanges.map(range => (
                      <option key={range.id} value={range.id}>{range.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={DollarSign}
            label="Total Revenue"
            value={stats.totalRevenue}
            trend="+18.2%"
            trendDirection="up"
            description="Last 30 days"
          />
          <StatCard 
            icon={ShoppingCart}
            label="Total Orders"
            value={stats.totalOrders}
            trend="+12.5%"
            trendDirection="up"
            description={`${stats.conversionRate} conversion rate`}
          />
          <StatCard 
            icon={BarChart2}
            label="Gig Performance"
            value={stats.gigPerformance + "/100"}
            trend="+5.4%"
            trendDirection="up"
            description="Average performance score"
          />
          <StatCard 
            icon={UserIcon}
            label="Customer Satisfaction"
            value={stats.customerSatisfaction + "%"}
            trend="+2.1%"
            trendDirection="up"
            description="Based on reviews"
          />
        </div>

        {/* Analytics Bar */}
        <div className="mb-6 bg-white rounded-xl border border-[#E7E1DE] p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FDECE7] rounded-lg border border-[#F4C7A1]">
                <Activity size={20} className="text-[#C9452F]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2E2322]">Performance Analytics</h3>
                <p className="text-[#6B5B50] text-sm">Key metrics for your gigs</p>
              </div>
            </div>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-2">
              <Download size={14} />
              Export Report
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-[#2E2322] mb-3">Traffic Sources</h4>
              <div className="space-y-3">
                {Object.entries(analytics.trafficSources).map(([source, percentage]) => (
                  <div key={source} className="flex items-center justify-between">
                    <span className="text-sm text-[#6B5B50] capitalize">{source}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-[#EFE7E2] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[#2E2322]">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-[#2E2322] mb-3">Revenue Trend</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-[#2E2322]">{stats.totalRevenue}</div>
                    <div className="text-sm text-[#7A5A4C]">Total Revenue</div>
                  </div>
                  <Badge variant="success" size="sm">
                    <TrendingUpIcon size={12} /> +18.2%
                  </Badge>
                </div>
                <ProgressBar value={75} label="Monthly Target" color="green" />
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-[#2E2322] mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-[#F8F4F1] hover:bg-[#F3E9E5] rounded-lg border border-[#E7E1DE] transition-colors flex items-center gap-3">
                  <Sparkles size={16} className="text-purple-600" />
                  <span className="text-sm">Optimize with AI</span>
                </button>
                <button className="w-full text-left p-3 bg-[#F8F4F1] hover:bg-[#F3E9E5] rounded-lg border border-[#E7E1DE] transition-colors flex items-center gap-3">
                  <TrendingUpIcon size={16} className="text-green-600" />
                  <span className="text-sm">Boost Performance</span>
                </button>
                <button className="w-full text-left p-3 bg-[#F8F4F1] hover:bg-[#F3E9E5] rounded-lg border border-[#E7E1DE] transition-colors flex items-center gap-3">
                  <Bell size={16} className="text-[#C9452F]" />
                  <span className="text-sm">Set Alerts</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-[#E7E1DE] overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-[#E7E1DE] bg-[#F8F4F1]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSelectAll}
                    className="p-2 hover:bg-white rounded-lg border border-[#E7E1DE] bg-white shadow-sm"
                    title="Select all"
                  >
                    {selectedGigs.length === filteredGigs.length ? (
                      <CheckSquare size={18} className="text-green-600" />
                    ) : (
                      <Square size={18} className="text-[#A38F85]" />
                    )}
                  </button>
                  <div className="text-sm text-[#6B5B50]">
                    {selectedGigs.length} of {filteredGigs.length} selected
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A38F85]" size={16} />
                  <input
                    type="text"
                    placeholder="Search gigs by title, tags, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full lg:w-80 pl-10 pr-4 py-2.5 bg-white border border-[#E7E1DE] rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#EFE7E2] rounded"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex bg-[#F3E9E5] p-1 rounded-lg border border-[#E7E1DE]">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-white border border-[#E7E1DE] shadow-sm" : "hover:bg-[#EFE7E2]"}`}
                  >
                    <List size={16} className={viewMode === "list" ? "text-green-600" : "text-[#6B5B50]"} />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-white border border-[#E7E1DE] shadow-sm" : "hover:bg-[#EFE7E2]"}`}
                  >
                    <Grid size={16} className={viewMode === "grid" ? "text-green-600" : "text-[#6B5B50]"} />
                  </button>
                </div>

                {/* Filter & Actions */}
                <ActionButton 
                  icon={Filter} 
                  label="Filter" 
                  variant="outline" 
                  onClick={() => {/* Filter logic */}}
                />
                
                <ActionButton 
                  icon={Plus} 
                  label="Create Gig" 
                  variant="primary"
                  onClick={() => {/* Create gig logic */}}
                />
                
                {selectedGigs.length > 0 && (
                  <ActionButton
                    onClick={() => setShowQuickActions(true)}
                    icon={Zap}
                    label={`Actions (${selectedGigs.length})`}
                    variant="success"
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
                    onAction={(action) => console.log(action, gig.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-[#F8F4F1] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E7E1DE]">
                  <Briefcase size={32} className="text-[#A38F85]" />
                </div>
                <h3 className="text-xl font-bold text-[#2E2322] mb-2">No gigs found</h3>
                <p className="text-[#6B5B50] mb-6 max-w-md mx-auto text-sm">
                  {searchQuery 
                    ? `No gigs match "${searchQuery}". Try different keywords.`
                    : activeTab === "all" 
                      ? "You haven't created any gigs yet. Start by creating your first service."
                      : `You don't have any gigs in the ${activeCategory?.name.toLowerCase()} status.`}
                </p>
                <div className="flex gap-3 justify-center">
                  <ActionButton 
                    icon={Plus}
                    label="Create Your First Gig"
                    variant="primary"
                    size="lg"
                  />
                  <ActionButton 
                    icon={Sparkles}
                    label="Use AI Generator"
                    variant="outline"
                    size="lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-[#E7E1DE] bg-[#F8F4F1] flex items-center justify-between">
            <div className="text-sm text-[#6B5B50] flex items-center gap-4">
              <div>
                Showing <span className="font-semibold">{filteredGigs.length}</span> of <span className="font-semibold">{GIGS.length}</span> gigs
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#7A5A4C]">Rows per page:</span>
                <select className="text-sm border border-[#E7E1DE] rounded px-2 py-1 bg-white">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 border border-[#E7E1DE] rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft size={16} />
              </button>
              {[1, 2, 3].map(num => (
                <button
                  key={num}
                  className={`w-8 h-8 rounded text-sm ${
                    num === 1
                      ? "bg-green-600 text-white"
                      : "hover:bg-[#F3E9E5]"
                  }`}
                >
                  {num}
                </button>
              ))}
              <span className="text-[#A38F85] mx-1">...</span>
              <button className="w-8 h-8 rounded hover:bg-[#F3E9E5] text-sm">
                10
              </button>
              <button className="p-2 border border-[#E7E1DE] rounded hover:bg-white">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-[#F8F4F1] rounded-xl border border-green-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl border border-green-300">
                <Sparkles size={20} className="text-green-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2E2322]">AI Performance Insights</h3>
                <p className="text-[#6B5B50] text-sm">Smart recommendations to boost your gigs</p>
              </div>
            </div>
            <button className="text-sm text-green-700 hover:text-green-800 font-medium flex items-center gap-2">
              View All
              <ArrowRight size={14} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-[#E7E1DE] hover:border-green-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#FDECE7] rounded-lg border border-[#F4C7A1]">
                  <TrendingUpIcon size={16} className="text-[#C9452F]" />
                </div>
                <span className="font-semibold text-[#2E2322]">Optimization Tip</span>
              </div>
              <p className="text-[#4A312F] text-sm">
                Add 3 more portfolio items to your React gig to increase conversions by 23%
              </p>
              <button className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium">
                Apply Suggestion →
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-[#E7E1DE] hover:border-green-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-50 rounded-lg border border-purple-100">
                  <Clock size={16} className="text-purple-600" />
                </div>
                <span className="font-semibold text-[#2E2322]">Best Time to Post</span>
              </div>
              <p className="text-[#4A312F] text-sm">
                Update your gigs on Wednesday at 2 PM EST for 37% more visibility
              </p>
              <div className="mt-3 text-xs text-[#7A5A4C]">
                Next optimal time: Tomorrow, 2:00 PM
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-[#E7E1DE] hover:border-green-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-50 rounded-lg border border-green-100">
                  <TargetIcon size={16} className="text-green-600" />
                </div>
                <span className="font-semibold text-[#2E2322]">Quality Score</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-2xl font-bold text-[#2E2322]">92/100</div>
                  <div className="text-sm text-[#7A5A4C]">Excellent</div>
                </div>
                <Badge variant="success" size="sm">Top 10%</Badge>
              </div>
              <ProgressBar value={92} color="green" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Modal */}
      <QuickActionModal
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        selectedGigs={selectedGigs}
      />

      {/* Floating Action Button for Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6">
        <button className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors">
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}
