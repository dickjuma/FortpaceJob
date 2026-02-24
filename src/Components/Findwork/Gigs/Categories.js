import React, { useState, useMemo } from "react";
import { 
  Star, Search, Clock, 
  Users, MapPin, Send, CheckCircle2, 
  DollarSign, Briefcase, Zap,
  ArrowRight, Sparkles, Bookmark, Target,
  Filter, X, ChevronDown, ChevronUp,
  Eye, BarChart3, Award, Calendar,
  Shield, Globe, Lock, Heart, FileText,
  TrendingUp, CheckCircle, Award as Trophy
} from "lucide-react";

const BUYER_REQUESTS = [
  {
    id: 1,
    buyer: "TechCorp Inc",
    buyerLogo: "TC",
    verified: true,
    rating: 4.9,
    jobsPosted: 12,
    title: "React Dashboard with Real-time Analytics",
    description: "Need a modern dashboard using React, TypeScript, and Chart.js. Must integrate with REST APIs and provide real-time data visualization. Experience with D3.js is a plus.",
    budget: "$800 - $1,200",
    minBudget: 800,
    maxBudget: 1200,
    offers: 8,
    duration: "21 days",
    postedTime: "3h ago",
    tags: ["React", "TypeScript", "Chart.js", "D3.js", "API Integration"],
    urgent: false,
    featured: true,
    category: "Web Development",
    location: "San Francisco",
    paymentVerified: true,
    skillsMatch: 94,
    clientHiringRate: 92,
    avgResponseTime: "2 hours",
    fixedPrice: true,
    preferredFreelancer: true,
    attachments: 3,
    interviewStages: 2,
    projectSize: "Medium",
    projectType: "One-time Project",
    timezone: "PST",
    lastViewed: "10 min ago",
    weeklyHours: "20-30 hours",
    experienceLevel: "Intermediate",
    milestones: 4,
    successScore: 88,
    lastSpent: "$12.5k",
    totalSpent: "$45.2k",
    reviews: 24,
    saved: true,
    featuredBadge: true
  },
  {
    id: 2,
    buyer: "StartupHub",
    buyerLogo: "SH",
    verified: true,
    rating: 5.0,
    jobsPosted: 6,
    title: "Full-Stack MVP Landing Page",
    description: "Create a landing page with Stripe integration and admin panel. Need authentication, payment processing, and basic analytics dashboard.",
    budget: "$1,500 - $2,000",
    minBudget: 1500,
    maxBudget: 2000,
    offers: 15,
    duration: "30 days",
    postedTime: "1d ago",
    tags: ["Next.js", "Stripe", "Node.js", "MongoDB", "Authentication"],
    urgent: true,
    featured: false,
    category: "Web Development",
    location: "Remote",
    paymentVerified: true,
    skillsMatch: 88,
    clientHiringRate: 98,
    avgResponseTime: "1 hour",
    fixedPrice: true,
    preferredFreelancer: false,
    attachments: 5,
    interviewStages: 1,
    projectSize: "Large",
    projectType: "One-time Project",
    timezone: "Any",
    lastViewed: "Just now",
    weeklyHours: "30-40 hours",
    experienceLevel: "Expert",
    milestones: 5,
    successScore: 92,
    lastSpent: "$8.2k",
    totalSpent: "$22.7k",
    reviews: 12,
    saved: false,
    featuredBadge: false
  },
  {
    id: 3,
    buyer: "E-Shop Pro",
    buyerLogo: "ES",
    verified: false,
    rating: "New",
    jobsPosted: 1,
    title: "Shopify Store Optimization",
    description: "Speed optimization and custom product filters. Need to improve page load time and implement advanced filtering system.",
    budget: "$400 - $600",
    minBudget: 400,
    maxBudget: 600,
    offers: 22,
    duration: "10 days",
    postedTime: "5h ago",
    tags: ["Shopify", "Liquid", "E-commerce", "SEO", "Performance"],
    urgent: false,
    featured: false,
    category: "Web Development",
    location: "New York",
    paymentVerified: true,
    skillsMatch: 76,
    clientHiringRate: 85,
    avgResponseTime: "4 hours",
    fixedPrice: true,
    preferredFreelancer: true,
    attachments: 2,
    interviewStages: 1,
    projectSize: "Small",
    projectType: "Quick Fix",
    timezone: "EST",
    lastViewed: "1 hour ago",
    weeklyHours: "10-15 hours",
    experienceLevel: "Entry",
    milestones: 2,
    successScore: 72,
    lastSpent: "$1.2k",
    totalSpent: "$1.2k",
    reviews: 0,
    saved: true,
    featuredBadge: false
  },
  {
    id: 4,
    buyer: "Brand Studio Co",
    buyerLogo: "BS",
    verified: true,
    rating: 4.8,
    jobsPosted: 18,
    title: "Brand Identity Package",
    description: "Complete brand package: logo, colors, business cards, and brand guidelines. Need modern, minimalist design approach.",
    budget: "$500 - $800",
    minBudget: 500,
    maxBudget: 800,
    offers: 31,
    duration: "14 days",
    postedTime: "2h ago",
    tags: ["Branding", "Figma", "Logo Design", "Illustration", "Typography"],
    urgent: false,
    featured: true,
    category: "Design",
    location: "London, UK",
    paymentVerified: true,
    skillsMatch: 91,
    clientHiringRate: 95,
    avgResponseTime: "3 hours",
    fixedPrice: true,
    preferredFreelancer: true,
    attachments: 7,
    interviewStages: 2,
    projectSize: "Medium",
    projectType: "Ongoing Project",
    timezone: "GMT",
    lastViewed: "30 min ago",
    weeklyHours: "15-25 hours",
    experienceLevel: "Intermediate",
    milestones: 3,
    successScore: 85,
    lastSpent: "$4.5k",
    totalSpent: "$28.9k",
    reviews: 31,
    saved: false,
    featuredBadge: true
  },
  {
    id: 5,
    buyer: "Modern Designs",
    buyerLogo: "MD",
    verified: true,
    rating: 4.9,
    jobsPosted: 9,
    title: "UI/UX for Mobile Banking App",
    description: "Design user-friendly interface for mobile banking app with focus on accessibility and modern design patterns.",
    budget: "$1,000 - $1,500",
    minBudget: 1000,
    maxBudget: 1500,
    offers: 12,
    duration: "20 days",
    postedTime: "6h ago",
    tags: ["UI/UX", "Figma", "Mobile Design", "Wireframing", "Prototyping"],
    urgent: true,
    featured: false,
    category: "Design",
    location: "Berlin",
    paymentVerified: true,
    skillsMatch: 89,
    clientHiringRate: 96,
    avgResponseTime: "1.5 hours",
    fixedPrice: true,
    preferredFreelancer: false,
    attachments: 4,
    interviewStages: 3,
    projectSize: "Medium",
    projectType: "One-time Project",
    timezone: "CET",
    lastViewed: "Just now",
    weeklyHours: "25-35 hours",
    experienceLevel: "Intermediate",
    milestones: 4,
    successScore: 91,
    lastSpent: "$6.8k",
    totalSpent: "$34.2k",
    reviews: 18,
    saved: false,
    featuredBadge: false
  },
  {
    id: 6,
    buyer: "Content Masters",
    buyerLogo: "CM",
    verified: true,
    rating: 4.7,
    jobsPosted: 24,
    title: "SEO Tech Blog Posts (10 Articles)",
    description: "Write SEO-optimized blog posts about AI and ML. Need technical depth with engaging storytelling.",
    budget: "$600 - $800",
    minBudget: 600,
    maxBudget: 800,
    offers: 45,
    duration: "15 days",
    postedTime: "1d ago",
    tags: ["SEO", "Tech Writing", "Content", "AI/ML", "Blogging"],
    urgent: false,
    featured: false,
    category: "Writing",
    location: "Toronto",
    paymentVerified: true,
    skillsMatch: 82,
    clientHiringRate: 89,
    avgResponseTime: "6 hours",
    fixedPrice: true,
    preferredFreelancer: true,
    attachments: 1,
    interviewStages: 1,
    projectSize: "Medium",
    projectType: "One-time Project",
    timezone: "EST",
    lastViewed: "2 hours ago",
    weeklyHours: "20-30 hours",
    experienceLevel: "Intermediate",
    milestones: 3,
    successScore: 78,
    lastSpent: "$3.2k",
    totalSpent: "$42.1k",
    reviews: 42,
    saved: true,
    featuredBadge: false
  }
];

const RequestCard = ({ request, isSaved, onSave, onApply, onQuickView }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getMatchLevel = () => {
    if (request.skillsMatch >= 90) return { 
      label: "Perfect Match", 
      color: "text-green-700", 
      bg: "bg-green-50", 
      border: "border-green-200",
      icon: <Target size={12} className="text-green-600" />
    };
    if (request.skillsMatch >= 80) return { 
      label: "Great Fit", 
      color: "text-[#B53A27]", 
      bg: "bg-[#FDECE7]", 
      border: "border-[#F4C7A1]",
      icon: <CheckCircle2 size={12} className="text-[#C9452F]" />
    };
    return { 
      label: "Good Fit", 
      color: "text-[#4A312F]", 
      bg: "bg-[#F8F4F1]", 
      border: "border-[#E7E1DE]",
      icon: <Briefcase size={12} className="text-[#6B5B50]" />
    };
  };

  const getUrgencyLevel = () => {
    if (request.urgent) return { color: "bg-red-100 text-red-700 border-red-200", text: "Urgent Hire", icon: <Zap size={10} /> };
    if (request.featuredBadge) return { color: "bg-purple-100 text-purple-700 border-purple-200", text: "Featured", icon: <Sparkles size={10} /> };
    return null;
  };

  const formatBudget = (min, max) => {
    const avg = Math.round((min + max) / 2);
    return {
      display: `$${min} - $${max}`,
      hourly: avg >= 1000 ? `~$${Math.round(avg / 40)}/hr` : null
    };
  };

  const getCompetitionLevel = (offers) => {
    if (offers < 10) return { level: "Low", color: "text-green-600", bg: "bg-green-50" };
    if (offers < 20) return { level: "Medium", color: "text-amber-600", bg: "bg-amber-50" };
    return { level: "High", color: "text-red-600", bg: "bg-red-50" };
  };

  const matchInfo = getMatchLevel();
  const urgencyInfo = getUrgencyLevel();
  const budgetInfo = formatBudget(request.minBudget, request.maxBudget);
  const competitionInfo = getCompetitionLevel(request.offers);

  return (
    <div 
      className="bg-white rounded-lg border border-[#E7E1DE] hover:border-green-300 hover:shadow-sm transition-all duration-200 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card Content */}
      <div className="p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Badges */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-[#2E2322] hover:text-green-700 cursor-pointer">
                    {request.title}
                  </h3>
                  {request.featuredBadge && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full border border-purple-200">
                      Featured
                    </span>
                  )}
                </div>
                
                {/* Client Info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <span className="text-sm text-[#2E2322] font-medium">{request.buyer}</span>
                      {request.verified && (
                        <CheckCircle2 size={12} className="ml-1 text-green-600" />
                      )}
                    </div>
                    <div className="flex items-center text-xs text-[#7A5A4C]">
                      <Star size={10} className="text-yellow-500 fill-yellow-500 mr-0.5" />
                      <span className="font-medium">{request.rating}</span>
                      {request.rating !== "New" && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{request.reviews} reviews</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {urgencyInfo && (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${urgencyInfo.color} flex items-center gap-1`}>
                      {urgencyInfo.icon}
                      {urgencyInfo.text}
                    </span>
                  )}
                </div>
                
                {/* Description */}
                <p className="text-[#6B5B50] text-sm mb-4 line-clamp-2">
                  {request.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {request.tags.slice(0, 4).map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 text-xs bg-[#F8F4F1] text-[#4A312F] rounded border border-[#E7E1DE] hover:bg-[#F3E9E5] transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                  {request.tags.length > 4 && (
                    <span className="px-2 py-1 text-xs text-[#7A5A4C]">
                      +{request.tags.length - 4} more
                    </span>
                  )}
                </div>
                
                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B5B50]">
                  <div className="flex items-center gap-1.5">
                    <DollarSign size={14} className="text-[#A38F85]" />
                    <span className="font-medium text-[#2E2322]">{budgetInfo.display}</span>
                    <span className="text-xs text-[#7A5A4C] ml-1">Fixed-price</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[#A38F85]" />
                    <span>Posted {request.postedTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#A38F85]" />
                    <span>{request.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-[#A38F85]" />
                    <span className={competitionInfo.color}>Proposals: {request.offers}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Actions */}
          <div className="flex flex-col items-end gap-3">
            {/* Match Badge */}
            <div className={`px-3 py-1.5 rounded-lg border ${matchInfo.border} ${matchInfo.bg} text-center`}>
              <div className={`text-xs font-semibold ${matchInfo.color} flex items-center gap-1`}>
                {matchInfo.icon}
                {matchInfo.label}
              </div>
              <div className="text-xs text-[#7A5A4C] mt-0.5">
                {request.skillsMatch}% match
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSave();
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved 
                    ? "text-green-600 bg-green-50 hover:bg-green-100" 
                    : "text-[#A38F85] hover:text-[#6B5B50] hover:bg-[#F3E9E5]"
                }`}
                title={isSaved ? "Remove from saved" : "Save for later"}
              >
                <Bookmark size={18} className={isSaved ? "fill-green-600" : ""} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(request);
                }}
                className="p-2 text-[#A38F85] hover:text-[#6B5B50] hover:bg-[#F3E9E5] rounded-lg"
                title="Quick view"
              >
                <Eye size={18} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApply();
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-md transition-colors flex items-center gap-2"
              >
                <Send size={14} />
                Apply Now
              </button>
            </div>
            
            {/* Expand Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-[#A38F85] hover:text-[#6B5B50] text-sm font-medium flex items-center gap-1"
            >
              {isExpanded ? "Show less" : "Show more"}
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-0 border-t border-[#E7E1DE] bg-[#F8F4F1]">
          <div className="space-y-5 pt-4">
            {/* Two Column Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Column */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-[#2E2322] uppercase tracking-wide">Client Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B5B50]">Location:</span>
                    <span className="font-medium">{request.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B5B50]">Jobs Posted:</span>
                    <span className="font-medium">{request.jobsPosted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B5B50]">Hire Rate:</span>
                    <span className="font-medium text-green-600">{request.clientHiringRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B5B50]">Total Spent:</span>
                    <span className="font-medium">{request.totalSpent}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B5B50]">Avg Response:</span>
                    <span className="font-medium">{request.avgResponseTime}</span>
                  </div>
                </div>
              </div>
              
              {/* Project Column */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-[#2E2322] uppercase tracking-wide">Project Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B5B50]">Experience Level:</span>
                    <span className="font-medium">{request.experienceLevel}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B5B50]">Project Type:</span>
                    <span className="font-medium">{request.projectType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B5B50]">Project Size:</span>
                    <span className="font-medium">{request.projectSize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B5B50]">Timezone:</span>
                    <span className="font-medium">{request.timezone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B5B50]">Weekly Hours:</span>
                    <span className="font-medium">{request.weeklyHours}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Skills Section */}
            <div>
              <h4 className="text-sm font-semibold text-[#2E2322] uppercase tracking-wide mb-3">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {request.tags.map((tag, index) => (
                  <span 
                    key={tag}
                    className={`px-3 py-1.5 text-sm rounded-md border ${
                      index < 3 
                        ? "bg-[#FDECE7] text-[#B53A27] border-[#F4C7A1] font-medium" 
                        : "bg-[#F8F4F1] text-[#4A312F] border-[#E7E1DE]"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#7A5A4C] pt-4 border-t border-[#E7E1DE]">
              <div className="flex items-center gap-1.5">
                <Shield size={12} />
                <span>Payment verified</span>
              </div>
              {request.preferredFreelancer && (
                <div className="flex items-center gap-1.5">
                  <Award size={12} />
                  <span>Preferred freelancer</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <FileText size={12} />
                <span>{request.attachments} attachments</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const QuickViewModal = ({ request, onClose }) => {
  if (!request) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E7E1DE] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#2E2322]">{request.title}</h2>
              <p className="text-sm text-[#6B5B50] mt-1">Posted {request.postedTime} • {request.location}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F3E9E5] rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#2E2322]">{request.buyer}</span>
              {request.verified && (
                <CheckCircle2 size={14} className="text-green-600" />
              )}
            </div>
            <div className="flex items-center text-sm text-[#6B5B50]">
              <Star size={12} className="text-yellow-500 fill-yellow-500 mr-1" />
              <span className="font-medium">{request.rating}</span>
              <span className="mx-1">•</span>
              <span>{request.reviews} reviews</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-[#2E2322] uppercase tracking-wide mb-3">Description</h3>
              <p className="text-[#4A312F] leading-relaxed">{request.description}</p>
            </div>
            
            {/* Project Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-[#7A5A4C] uppercase tracking-wide font-medium">Budget</div>
                  <div className="font-semibold text-[#2E2322]">{request.budget}</div>
                </div>
                <div>
                  <div className="text-xs text-[#7A5A4C] uppercase tracking-wide font-medium">Duration</div>
                  <div className="font-medium">{request.duration}</div>
                </div>
                <div>
                  <div className="text-xs text-[#7A5A4C] uppercase tracking-wide font-medium">Proposals</div>
                  <div className="font-medium">{request.offers}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-[#7A5A4C] uppercase tracking-wide font-medium">Project Type</div>
                  <div className="font-medium">{request.projectType}</div>
                </div>
                <div>
                  <div className="text-xs text-[#7A5A4C] uppercase tracking-wide font-medium">Experience Level</div>
                  <div className="font-medium">{request.experienceLevel}</div>
                </div>
                <div>
                  <div className="text-xs text-[#7A5A4C] uppercase tracking-wide font-medium">Client Location</div>
                  <div className="font-medium">{request.location}</div>
                </div>
              </div>
            </div>
            
            {/* Skills */}
            <div>
              <h3 className="text-sm font-semibold text-[#2E2322] uppercase tracking-wide mb-3">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {request.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-[#F8F4F1] text-[#4A312F] text-sm rounded border border-[#E7E1DE]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Client Stats */}
            <div className="bg-[#F8F4F1] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-[#2E2322] uppercase tracking-wide mb-3">About the Client</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B5B50]">Jobs Posted</span>
                    <span className="font-medium">{request.jobsPosted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B5B50]">Hire Rate</span>
                    <span className="font-medium text-green-600">{request.clientHiringRate}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B5B50]">Total Spent</span>
                    <span className="font-medium">{request.totalSpent}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B5B50]">Avg Response</span>
                    <span className="font-medium">{request.avgResponseTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#E7E1DE]">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2 text-[#6B5B50] hover:text-[#2E2322] text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle apply logic
                  onClose();
                }}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-md transition-colors flex items-center gap-2"
              >
                <Send size={14} />
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ApplyModal = ({ request, onClose }) => {
  const [step, setStep] = useState(1);
  const [offer, setOffer] = useState(request.minBudget);
  const [days, setDays] = useState(parseInt(request.duration));
  const [proposal, setProposal] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const steps = [
    { number: 1, title: "Bid Details", icon: DollarSign },
    { number: 2, title: "Proposal", icon: FileText },
    { number: 3, title: "Submit", icon: Send }
  ];

  const handleSubmit = () => {
    alert(`Proposal submitted for $${offer} with ${days} day delivery`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl">
        <div className="border-b border-[#E7E1DE] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#2E2322]">Submit Proposal</h3>
              <p className="text-sm text-[#6B5B50] mt-1">{request.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F3E9E5] rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-md mx-auto">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`flex flex-col items-center ${step >= stepItem.number ? 'text-green-700' : 'text-[#A38F85]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepItem.number ? 'bg-green-600 text-white' : 'bg-[#EFE7E2]'}`}>
                    {step >= stepItem.number ? stepItem.number : <stepItem.icon size={16} />}
                  </div>
                  <span className="text-xs mt-2 font-medium">{stepItem.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 mx-2 ${step > stepItem.number ? 'bg-green-600' : 'bg-[#EFE7E2]'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-[#2E2322] mb-3">Your Bid</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4A312F] mb-2">
                      Bid Amount (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7A5A4C]">$</span>
                      <input
                        type="number"
                        min={request.minBudget}
                        max={request.maxBudget}
                        value={offer}
                        onChange={(e) => setOffer(parseInt(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2.5 border border-[#E7E1DE] rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <p className="text-xs text-[#7A5A4C] mt-2">
                      Client's budget: {request.budget}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#4A312F] mb-2">
                      Estimated Delivery Time (days)
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setDays(Math.max(1, days - 1))}
                        className="w-10 h-10 rounded-md border border-[#E7E1DE] hover:bg-[#F8F4F1] transition-colors"
                      >
                        −
                      </button>
                      <div className="text-center flex-1">
                        <div className="text-2xl font-semibold text-[#2E2322]">{days}</div>
                        <div className="text-sm text-[#7A5A4C]">days</div>
                      </div>
                      <button
                        onClick={() => setDays(days + 1)}
                        className="w-10 h-10 rounded-md border border-[#E7E1DE] hover:bg-[#F8F4F1] transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs text-[#7A5A4C] text-center mt-2">
                      Client expects: {request.duration}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-[#2E2322] mb-3">Cover Letter</h4>
                <div className="space-y-3">
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Introduce yourself and explain why you're the best fit for this project..."
                    className="w-full h-40 p-3 border border-[#E7E1DE] rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-none text-sm"
                    maxLength={2000}
                  />
                  <div className="flex justify-between text-xs text-[#7A5A4C]">
                    <span>Recommended: 150-500 characters</span>
                    <span>{coverLetter.length}/2000</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-[#2E2322] mb-3">Additional Details</h4>
                <textarea
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Add any additional details about your approach, timeline, or questions for the client..."
                  className="w-full h-32 p-3 border border-[#E7E1DE] rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-none text-sm"
                  maxLength={1000}
                />
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">Ready to Submit</h4>
                    <p className="text-sm text-green-700">
                      Review your proposal details before submitting. You can still make changes.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#E7E1DE] pb-3">
                  <span className="text-[#6B5B50]">Bid Amount</span>
                  <span className="font-semibold">${offer}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#E7E1DE] pb-3">
                  <span className="text-[#6B5B50]">Delivery Time</span>
                  <span className="font-semibold">{days} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B5B50]">Cover Letter</span>
                  <span className="text-sm text-[#7A5A4C]">
                    {coverLetter.length > 0 ? `${Math.ceil(coverLetter.length / 5)} words` : 'Not added'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-[#E7E1DE] p-6">
          <div className="flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-[#6B5B50] hover:text-[#2E2322] text-sm font-medium transition-colors"
              >
                Back
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 text-[#6B5B50] hover:text-[#2E2322] text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            )}
            
            <button
              onClick={() => {
                if (step < 3) {
                  setStep(step + 1);
                } else {
                  handleSubmit();
                }
              }}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-md transition-colors flex items-center gap-2"
            >
              {step < 3 ? 'Continue' : 'Submit Proposal'}
              {step < 3 && <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CategoryResults() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedRequests, setSavedRequests] = useState([1, 3, 6]);
  const [showApplyModal, setShowApplyModal] = useState(null);
  const [quickViewRequest, setQuickViewRequest] = useState(null);
  const [filters, setFilters] = useState({
    minMatch: 70,
    maxOffers: 50,
    verifiedOnly: false,
    urgentOnly: false,
    paymentVerified: false,
    fixedPrice: true,
    hourly: false
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const filteredRequests = useMemo(() => {
    return BUYER_REQUESTS.filter(request => {
      if (selectedCategory !== "all" && request.category !== selectedCategory) return false;
      if (searchQuery && !request.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filters.verifiedOnly && !request.verified) return false;
      if (filters.urgentOnly && !request.urgent) return false;
      if (filters.paymentVerified && !request.paymentVerified) return false;
      if (request.skillsMatch < filters.minMatch) return false;
      if (request.offers > filters.maxOffers) return false;
      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.postedTime) - new Date(a.postedTime);
        case "budget":
          return b.maxBudget - a.maxBudget;
        case "proposals":
          return a.offers - b.offers;
        case "relevance":
        default:
          return b.skillsMatch - a.skillsMatch;
      }
    });
  }, [selectedCategory, searchQuery, filters, sortBy]);

  const stats = useMemo(() => ({
    total: filteredRequests.length,
    avgBudget: Math.round(filteredRequests.reduce((sum, r) => sum + r.minBudget, 0) / filteredRequests.length) || 0,
    urgentCount: filteredRequests.filter(r => r.urgent).length,
    featuredCount: filteredRequests.filter(r => r.featuredBadge).length,
    verifiedCount: filteredRequests.filter(r => r.verified).length
  }), [filteredRequests]);

  const toggleSave = (id) => {
    setSavedRequests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const categories = [
    { id: "all", name: "All Projects", count: BUYER_REQUESTS.length },
    { id: "Web Development", name: "Web Development", count: 3, icon: "💻" },
    { id: "Design", name: "Design", count: 2, icon: "🎨" },
    { id: "Writing", name: "Writing", count: 1, icon: "✏️" }
  ];

  const resetFilters = () => {
    setFilters({
      minMatch: 70,
      maxOffers: 50,
      verifiedOnly: false,
      urgentOnly: false,
      paymentVerified: false,
      fixedPrice: true,
      hourly: false
    });
    setSearchQuery("");
    setSortBy("relevance");
  };

  return (
    <div className="min-h-screen bg-[#F8F4F1]">
      {/* Header */}
      <div className="bg-white border-b border-[#E7E1DE]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#2E2322]">Find Work</h1>
              <p className="text-sm text-[#6B5B50] mt-1">Your next project is here</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A38F85]" size={18} />
                <input
                  type="text"
                  placeholder="Search projects by title, skills, or client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-[#E7E1DE] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <button className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-md transition-colors">
                Post a Project
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-40">
              <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-semibold text-[#2E2322]">Filters</h3>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-[#F3E9E5] rounded-md"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-[#2E2322] mb-3">Categories</h4>
                    <div className="space-y-1">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setShowMobileFilters(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
                            selectedCategory === cat.id
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "text-[#6B5B50] hover:bg-[#F8F4F1]"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                          </div>
                          <span className="text-xs bg-[#F3E9E5] text-[#6B5B50] px-1.5 py-0.5 rounded">
                            {cat.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-[#2E2322] mb-3">Filter Options</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-[#4A312F] mb-1">
                          Minimum Match: {filters.minMatch}%
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="100"
                          value={filters.minMatch}
                          onChange={(e) => setFilters(f => ({...f, minMatch: parseInt(e.target.value)}))}
                          className="w-full h-1.5 bg-[#EFE7E2] rounded-lg appearance-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-[#4A312F] mb-1">
                          Max Proposals: {filters.maxOffers}
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="100"
                          value={filters.maxOffers}
                          onChange={(e) => setFilters(f => ({...f, maxOffers: parseInt(e.target.value)}))}
                          className="w-full h-1.5 bg-[#EFE7E2] rounded-lg appearance-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-[#4A312F]">
                          <input
                            type="checkbox"
                            checked={filters.verifiedOnly}
                            onChange={(e) => setFilters(f => ({...f, verifiedOnly: e.target.checked}))}
                            className="rounded border-[#E7E1DE] text-green-600 focus:ring-green-500"
                          />
                          Verified clients only
                        </label>
                        
                        <label className="flex items-center gap-2 text-sm text-[#4A312F]">
                          <input
                            type="checkbox"
                            checked={filters.urgentOnly}
                            onChange={(e) => setFilters(f => ({...f, urgentOnly: e.target.checked}))}
                            className="rounded border-[#E7E1DE] text-green-600 focus:ring-green-500"
                          />
                          Urgent projects
                        </label>
                        
                        <label className="flex items-center gap-2 text-sm text-[#4A312F]">
                          <input
                            type="checkbox"
                            checked={filters.paymentVerified}
                            onChange={(e) => setFilters(f => ({...f, paymentVerified: e.target.checked}))}
                            className="rounded border-[#E7E1DE] text-green-600 focus:ring-green-500"
                          />
                          Payment verified
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={resetFilters}
                    className="flex-1 px-4 py-2.5 border border-[#E7E1DE] text-[#4A312F] rounded-md text-sm font-medium hover:bg-[#F8F4F1] transition-colors"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-64 space-y-6">
            {/* Stats card */}
            <div className="bg-white rounded-lg border border-[#E7E1DE] p-5">
              <h3 className="font-semibold text-[#2E2322] mb-4">Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-[#7A5A4C] mb-1">Available Projects</div>
                  <div className="text-2xl font-bold text-[#2E2322]">{stats.total}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-[#7A5A4C] mb-1">Urgent</div>
                    <div className="text-lg font-semibold text-red-600">{stats.urgentCount}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#7A5A4C] mb-1">Featured</div>
                    <div className="text-lg font-semibold text-purple-600">{stats.featuredCount}</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#E7E1DE]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B5B50]">Saved Jobs</span>
                    <span className="font-semibold">{savedRequests.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg border border-[#E7E1DE] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#2E2322]">Categories</h3>
                <span className="text-xs text-[#7A5A4C]">{BUYER_REQUESTS.length} total</span>
              </div>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
                      selectedCategory === cat.id
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "text-[#6B5B50] hover:bg-[#F8F4F1]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </div>
                    <span className="text-xs bg-[#F3E9E5] text-[#6B5B50] px-1.5 py-0.5 rounded">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-[#E7E1DE] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#2E2322]">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Reset all
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-[#4A312F] mb-1">
                    Minimum Match: {filters.minMatch}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={filters.minMatch}
                    onChange={(e) => setFilters(f => ({...f, minMatch: parseInt(e.target.value)}))}
                    className="w-full h-1.5 bg-[#EFE7E2] rounded-lg appearance-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[#4A312F] mb-1">
                    Max Proposals: {filters.maxOffers}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={filters.maxOffers}
                    onChange={(e) => setFilters(f => ({...f, maxOffers: parseInt(e.target.value)}))}
                    className="w-full h-1.5 bg-[#EFE7E2] rounded-lg appearance-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-[#4A312F]">
                    <input
                      type="checkbox"
                      checked={filters.verifiedOnly}
                      onChange={(e) => setFilters(f => ({...f, verifiedOnly: e.target.checked}))}
                      className="rounded border-[#E7E1DE] text-green-600 focus:ring-green-500"
                    />
                    Verified clients only
                  </label>
                  
                  <label className="flex items-center gap-2 text-sm text-[#4A312F]">
                    <input
                      type="checkbox"
                      checked={filters.urgentOnly}
                      onChange={(e) => setFilters(f => ({...f, urgentOnly: e.target.checked}))}
                      className="rounded border-[#E7E1DE] text-green-600 focus:ring-green-500"
                    />
                    Urgent projects
                  </label>
                  
                  <label className="flex items-center gap-2 text-sm text-[#4A312F]">
                    <input
                      type="checkbox"
                      checked={filters.paymentVerified}
                      onChange={(e) => setFilters(f => ({...f, paymentVerified: e.target.checked}))}
                      className="rounded border-[#E7E1DE] text-green-600 focus:ring-green-500"
                    />
                    Payment verified
                  </label>
                </div>
              </div>
            </div>
            
            {/* Tips Card */}
            <div className="bg-[#FDECE7] border border-[#F4C7A1] rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#FDECE7] flex items-center justify-center">
                  <Target size={16} className="text-[#C9452F]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#2E2322]">Pro Tip</h4>
                  <p className="text-xs text-[#6B5B50]">Stand out from the crowd</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-[#4A312F]">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FDECE7] mt-1.5"></div>
                  <span>Apply within 24 hours for better visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FDECE7] mt-1.5"></div>
                  <span>Customize your proposal for each job</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FDECE7] mt-1.5"></div>
                  <span>Include relevant portfolio samples</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#2E2322]">
                    {selectedCategory === "all" ? "All Projects" : selectedCategory}
                  </h2>
                  <p className="text-sm text-[#6B5B50] mt-1">
                    {filteredRequests.length} projects found • Best matches first
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2">
                    <span className="text-sm text-[#6B5B50]">Sort by:</span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border border-[#E7E1DE] rounded-md px-3 py-1.5 bg-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="newest">Newest</option>
                      <option value="budget">Highest budget</option>
                      <option value="proposals">Fewest proposals</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden px-3 py-2 border border-[#E7E1DE] rounded-md text-sm font-medium hover:bg-[#F8F4F1] transition-colors flex items-center gap-2"
                  >
                    <Filter size={16} />
                    Filters
                  </button>
                  
                  <button className="text-sm text-[#6B5B50] hover:text-[#2E2322] font-medium flex items-center gap-2">
                    <Bookmark size={16} className={savedRequests.length > 0 ? "text-green-600" : ""} />
                    Saved ({savedRequests.length})
                  </button>
                </div>
              </div>
              
              {/* Active filters */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {filters.verifiedOnly && (
                  <span className="px-3 py-1 text-xs font-medium bg-[#FDECE7] text-[#B53A27] rounded-md border border-[#F4C7A1] flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Verified clients
                  </span>
                )}
                {filters.urgentOnly && (
                  <span className="px-3 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-md border border-red-200 flex items-center gap-1">
                    <Zap size={12} />
                    Urgent only
                  </span>
                )}
                {(filters.verifiedOnly || filters.urgentOnly || filters.paymentVerified) && (
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1 text-xs text-[#7A5A4C] hover:text-[#4A312F] hover:bg-[#F3E9E5] rounded-md transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Projects grid */}
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-[#E7E1DE]">
                <div className="w-16 h-16 mx-auto bg-[#F3E9E5] rounded-full flex items-center justify-center mb-4">
                  <Search size={24} className="text-[#A38F85]" />
                </div>
                <h3 className="text-lg font-semibold text-[#2E2322] mb-2">No projects found</h3>
                <p className="text-sm text-[#6B5B50] mb-6 max-w-md mx-auto">
                  Try adjusting your filters or search terms to find more projects
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-md transition-colors"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    isSaved={savedRequests.includes(request.id)}
                    onSave={() => toggleSave(request.id)}
                    onApply={() => setShowApplyModal(request.id)}
                    onQuickView={() => setQuickViewRequest(request)}
                  />
                ))}
              </div>
            )}
            
            {/* Load more */}
            {filteredRequests.length > 0 && (
              <div className="mt-8 text-center">
                <button className="px-5 py-2.5 border border-[#E7E1DE] text-[#4A312F] hover:bg-[#F8F4F1] rounded-md text-sm font-medium transition-colors">
                  Load more projects
                </button>
                <p className="text-xs text-[#7A5A4C] mt-3">
                  Showing {filteredRequests.length} of {BUYER_REQUESTS.length} projects
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quick View Modal */}
      {quickViewRequest && (
        <QuickViewModal
          request={quickViewRequest}
          onClose={() => setQuickViewRequest(null)}
        />
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          request={BUYER_REQUESTS.find(r => r.id === showApplyModal)}
          onClose={() => setShowApplyModal(null)}
        />
      )}

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E7E1DE] p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="flex flex-col items-center gap-1 text-[#6B5B50] hover:text-[#2E2322]"
          >
            <Filter size={20} />
            <span className="text-xs">Filters</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-[#6B5B50] hover:text-[#2E2322]">
            <Bookmark size={20} />
            <span className="text-xs">Saved</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-green-600">
            <Search size={20} />
            <span className="text-xs font-medium">Search</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-[#6B5B50] hover:text-[#2E2322]">
            <BarChart3 size={20} />
            <span className="text-xs">Reports</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-[#6B5B50] hover:text-[#2E2322]">
            <Briefcase size={20} />
            <span className="text-xs">My Jobs</span>
          </button>
        </div>
      </div>
    </div>
  );
}
