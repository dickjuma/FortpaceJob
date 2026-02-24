import React, { useState } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  Plus,
  Search,
  Grid,
  FileText,
  TrendingUp,
  Users,
  Settings,
  Bell,
  User,
  Home,
  Package,
  MessageSquare,
  Briefcase,
  BarChart,
  Award,
  ChevronRight,
  Filter,
  Star,
  Clock,
  CheckCircle,
  MoreVertical,
  Folder,
  Layers,
  Target,
  CreditCard,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  Copy,
  ExternalLink
} from "lucide-react";

/* ===== Child Pages ===== */
import Categories from "./Gigs/Categories";
import CreateGig from "./Gigs/CreateGig";
import ManageGigs from "./Gigs/ManageGigs";
import Analytics from "./Performance/Analytics";
import SkillLevels from "./Performance/SkillLevels";
import Badges from "./Performance/Badges";
import ViewRequests from "./BuyerRequests/ViewRequests";
import ProposalManager from "./BuyerRequests/ProposalManager";
import Messages from "./Messages";

export default function FindWork() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname.includes(path);
  const brand = {
    ink: "text-[#2E2322]",
    muted: "text-[#6B5B50]",
    border: "border-[#E7E1DE]",
    softBg: "bg-[#F8F4F1]",
    card: "bg-white",
    accentBg: "bg-[#FDECE7]",
    accentText: "text-[#B53A27]",
    accent: "bg-[#C9452F]",
    accentHover: "hover:bg-[#B53A27]",
    shadow: "shadow-[0_12px_30px_rgba(28,20,18,0.08)]"
  };

  // Navigation structure
  const navigation = {
    gigs: {
      icon: Package,
      label: "Gigs",
      subItems: [
        { to: "gigs/categories", label: "Browse Categories", icon: Grid },
        { to: "gigs/manage", label: "Manage Gigs", icon: FileText },
        { to: "gigs/create", label: "Create Gig", icon: Plus },
      ]
    },
    requests: {
      icon: Target,
      label: "Buyer Requests",
      subItems: [
        { to: "requests/view", label: "View Requests", icon: Eye },
        { to: "requests/manager", label: "My Proposals", icon: Briefcase },
      ]
    },
    performance: {
      icon: BarChart,
      label: "Performance",
      subItems: [
        { to: "performance/analytics", label: "Analytics", icon: TrendingUp },
        { to: "performance/skills", label: "Skill Levels", icon: Star },
        { to: "performance/badges", label: "Badges", icon: Award },
      ]
    }
  };

  return (
    <div className={`min-h-screen ${brand.softBg} flex`}>
      {/* Desktop Sidebar */}
      <div className={`w-64 ${brand.card} border-r ${brand.border} hidden md:flex flex-col`}>
        <div className={`p-6 border-b ${brand.border}`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${brand.accent} rounded-lg flex items-center justify-center`}>
              <Briefcase size={18} className="text-white" />
            </div>
            <span className={`font-semibold ${brand.ink}`}>Marketplace</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <NavSection
            title="Services"
            items={[
              { to: "", icon: Home, label: "Dashboard" },
              navigation.gigs,
              navigation.requests,
              { to: "messages", icon: MessageSquare, label: "Messages", badge: "3" },
            ]}
          />

          <div className="mt-8">
            <div className="text-xs font-semibold text-[#7A5A4C] uppercase tracking-wider mb-3">
              Tools
            </div>
            <nav className="space-y-1">
              <NavLink
                to="performance/analytics"
                icon={BarChart}
                label="Analytics"
              />
              <NavLink
                to="settings"
                icon={Settings}
                label="Settings"
              />
            </nav>
          </div>
        </div>

        <div className={`p-4 border-t ${brand.border}`}>
          <UserProfile />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className={`absolute left-0 top-0 bottom-0 w-64 ${brand.card} shadow-xl`}>
            <div className={`p-4 border-b ${brand.border}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${brand.accent} rounded-lg flex items-center justify-center`}>
                    <Briefcase size={18} className="text-white" />
                  </div>
                  <span className={`font-semibold ${brand.ink}`}>Menu</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <MoreVertical size={20} className={brand.muted} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <MobileNavSection navigation={navigation} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className={`${brand.card} border-b ${brand.border} px-4 md:px-6 py-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2"
              >
                <MoreVertical size={20} className={brand.muted} />
              </button>
              
              <div className="md:hidden">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 ${brand.accent} rounded flex items-center justify-center`}>
                    <Briefcase size={12} className="text-white" />
                  </div>
                  <span className={`font-semibold text-sm ${brand.ink}`}>Marketplace</span>
                </div>
              </div>

              {/* Breadcrumb */}
              <div className={`hidden md:flex items-center gap-2 text-sm ${brand.muted}`}>
                <span className="text-[#A38F85]">Marketplace</span>
                <ChevronRight size={14} />
                <Breadcrumb path={location.pathname} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:block flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A38F85]" size={16} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2 border ${brand.border} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#C9452F] focus:border-[#C9452F]`}
                  />
                </div>
              </div>

              <button className="relative p-2 hover:bg-[#F3E9E5] rounded-lg">
                <Bell size={18} className={brand.muted} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A38F85]" size={16} />
              <input
                type="text"
                placeholder="Search gigs, requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 border ${brand.border} rounded-lg text-sm`}
              />
            </div>
          </div>
        </header>

        {/* Sub-navigation for current section */}
        <div className={`${brand.card} border-b ${brand.border} px-4 md:px-6 py-3`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-lg md:text-xl font-semibold ${brand.ink}`}>
                {getPageTitle(location.pathname)}
              </h1>
              <p className={`text-xs md:text-sm ${brand.muted} mt-1`}>
                {getPageDescription(location.pathname)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {getPageActions(location.pathname)}
            </div>
          </div>

          {/* Section tabs */}
          <div className="mt-4">
            {getSectionTabs(location.pathname)}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route index element={<Navigate to="" replace />} />

              {/* Dashboard */}
              <Route path="" element={<Dashboard />} />

              {/* Gigs Section */}
              <Route path="gigs">
                <Route path="categories" element={<Categories />} />
                <Route path="create" element={<CreateGig />} />
                <Route path="manage" element={<ManageGigs />} />
                <Route index element={<Navigate to="manage" replace />} />
              </Route>

              {/* Requests Section */}
              <Route path="requests">
                <Route path="view" element={<ViewRequests />} />
                <Route path="manager" element={<ProposalManager />} />
                <Route index element={<Navigate to="view" replace />} />
              </Route>

              {/* Messages */}
              <Route path="messages" element={<Messages />} />

              {/* Performance Section */}
              <Route path="performance">
                <Route path="analytics" element={<Analytics />} />
                <Route path="skills" element={<SkillLevels />} />
                <Route path="badges" element={<Badges />} />
                <Route index element={<Navigate to="analytics" replace />} />
              </Route>
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavSection({ title, items }) {
  return (
    <div className="mb-6">
      <div className="text-xs font-semibold text-[#7A5A4C] uppercase tracking-wider mb-3">
        {title}
      </div>
      <nav className="space-y-1">
        {items.map((item, index) => {
          if (item.subItems) {
            return <CollapsibleNavItem key={index} item={item} />;
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
            />
          );
        })}
      </nav>
    </div>
  );
}

function CollapsibleNavItem({ item }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const hasActiveChild = item.subItems.some(subItem => 
    location.pathname.includes(subItem.to)
  );

  const Icon = item.icon;

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors ${
          hasActiveChild 
            ? "bg-[#FDECE7] text-[#B53A27]" 
            : "text-[#4A312F] hover:bg-[#F3E9E5]"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={16} />
          <span>{item.label}</span>
        </div>
        <ChevronRight 
          size={14} 
          className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="ml-7 mt-1 space-y-1">
          {item.subItems.map((subItem) => (
            <NavLink
              key={subItem.to}
              to={subItem.to}
              icon={subItem.icon}
              label={subItem.label}
              indent
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavLink({ to, icon: Icon, label, badge, indent = false }) {
  const location = useLocation();
  const isActive = location.pathname.includes(to);

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
        indent ? 'pl-9' : ''
      } ${
        isActive
          ? "bg-[#FDECE7] text-[#B53A27] border-l-4 border-[#C9452F]"
          : "text-[#4A312F] hover:bg-[#F3E9E5]"
      }`}
    >
      <Icon size={16} />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="bg-[#FDECE7] text-[#B53A27] text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}

function MobileNavSection({ navigation }) {
  const location = useLocation();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="space-y-4">
      <Link
        to=""
        className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg ${
          location.pathname === "/find-work" 
            ? "bg-[#FDECE7] text-[#B53A27]" 
            : "text-[#4A312F] hover:bg-[#F3E9E5]"
        }`}
      >
        <Home size={16} />
        <span>Dashboard</span>
      </Link>

      {Object.entries(navigation).map(([key, section]) => {
        const Icon = section.icon;
        const isOpen = openSection === key;
        const hasActiveChild = section.subItems.some(item => 
          location.pathname.includes(item.to)
        );

        return (
          <div key={key}>
            <button
              onClick={() => toggleSection(key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg ${
                hasActiveChild 
                  ? "bg-[#FDECE7] text-[#B53A27]" 
                  : "text-[#4A312F] hover:bg-[#F3E9E5]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} />
                <span>{section.label}</span>
              </div>
              <ChevronRight 
                size={14} 
                className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} 
              />
            </button>

            {isOpen && (
              <div className="ml-7 mt-1 space-y-1">
                {section.subItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded ${
                      location.pathname.includes(item.to)
                        ? "text-[#B53A27]"
                        : "text-[#6B5B50] hover:text-[#2E2322]"
                    }`}
                  >
                    <item.icon size={14} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function UserProfile() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-[#F3E9E5] rounded-full flex items-center justify-center">
        <User size={16} className="text-[#7A5A4C]" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-[#2E2322]">John Doe</div>
        <div className="text-xs text-[#6B5B50]">Seller Level 2</div>
      </div>
    </div>
  );
}

function Breadcrumb({ path }) {
  const segments = path.split('/').filter(seg => seg && seg !== 'find-work');
  
  if (segments.length === 0) {
    return <span className="font-medium">Dashboard</span>;
  }

  return segments.map((segment, index) => (
    <React.Fragment key={segment}>
      {index > 0 && <ChevronRight size={14} className="mx-2 text-[#A38F85]" />}
      <span className={`${index === segments.length - 1 ? 'font-medium text-[#2E2322]' : 'text-[#6B5B50]'}`}>
        {formatBreadcrumb(segment)}
      </span>
    </React.Fragment>
  ));
}

function formatBreadcrumb(segment) {
  const mapping = {
    'gigs': 'Gigs',
    'manage': 'Manage',
    'create': 'Create',
    'categories': 'Categories',
    'requests': 'Requests',
    'view': 'View',
    'manager': 'Proposals',
    'performance': 'Performance',
    'analytics': 'Analytics',
    'skills': 'Skills',
    'badges': 'Badges'
  };
  
  return mapping[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
}

function getPageTitle(path) {
  if (path.includes('gigs/manage')) return 'Manage Gigs';
  if (path.includes('gigs/create')) return 'Create New Gig';
  if (path.includes('gigs/categories')) return 'Browse Categories';
  if (path.includes('requests/view')) return 'Buyer Requests';
  if (path.includes('requests/manager')) return 'My Proposals';
  if (path.includes('messages')) return 'Messages';
  if (path.includes('performance/analytics')) return 'Analytics Dashboard';
  if (path.includes('performance/skills')) return 'Skill Levels';
  if (path.includes('performance/badges')) return 'Badges & Awards';
  return 'Marketplace Dashboard';
}

function getPageDescription(path) {
  if (path.includes('gigs/manage')) return 'View and manage your service listings';
  if (path.includes('gigs/create')) return 'Create a new service offering';
  if (path.includes('gigs/categories')) return 'Browse available service categories';
  if (path.includes('requests/view')) return 'Find work opportunities from buyers';
  if (path.includes('requests/manager')) return 'Track your sent proposals';
  if (path.includes('messages')) return 'Chat with clients and manage conversations';
  if (path.includes('performance/analytics')) return 'View your performance metrics';
  if (path.includes('performance/skills')) return 'Manage your skill levels';
  if (path.includes('performance/badges')) return 'View your achievements and badges';
  return 'Overview of your marketplace activity';
}

function getPageActions(path) {
  if (path.includes('gigs/manage')) {
    return (
      <Link
        to="gigs/create"
        className="px-3 py-2 bg-[#C9452F] text-white text-sm font-medium rounded-lg hover:bg-[#B53A27] flex items-center gap-2"
      >
        <Plus size={14} />
        Create Gig
      </Link>
    );
  }
  if (path.includes('requests/view')) {
    return (
      <button className="px-3 py-2 border border-[#E7E1DE] text-sm font-medium rounded-lg hover:bg-[#F3E9E5] flex items-center gap-2">
        <Filter size={14} />
        Filter
      </button>
    );
  }
  return null;
}

function getSectionTabs(path) {
  if (path.includes('gigs')) {
    return (
      <div className="flex space-x-1">
        <Link
          to="gigs/manage"
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            path.includes('gigs/manage')
              ? 'bg-[#FDECE7] text-[#B53A27]'
              : 'text-[#6B5B50] hover:bg-[#F3E9E5]'
          }`}
        >
          Manage
        </Link>
        <Link
          to="gigs/create"
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            path.includes('gigs/create')
              ? 'bg-[#FDECE7] text-[#B53A27]'
              : 'text-[#6B5B50] hover:bg-[#F3E9E5]'
          }`}
        >
          Create
        </Link>
        <Link
          to="gigs/categories"
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            path.includes('gigs/categories')
              ? 'bg-[#FDECE7] text-[#B53A27]'
              : 'text-[#6B5B50] hover:bg-[#F3E9E5]'
          }`}
        >
          Categories
        </Link>
      </div>
    );
  }
  
  if (path.includes('requests')) {
    return (
      <div className="flex space-x-1">
        <Link
          to="requests/view"
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            path.includes('requests/view')
              ? 'bg-[#FDECE7] text-[#B53A27]'
              : 'text-[#6B5B50] hover:bg-[#F3E9E5]'
          }`}
        >
          View Requests
        </Link>
        <Link
          to="requests/manager"
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            path.includes('requests/manager')
              ? 'bg-[#FDECE7] text-[#B53A27]'
              : 'text-[#6B5B50] hover:bg-[#F3E9E5]'
          }`}
        >
          My Proposals
        </Link>
      </div>
    );
  }
  
  if (path.includes('performance')) {
    return (
      <div className="flex space-x-1">
        <Link
          to="performance/analytics"
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            path.includes('performance/analytics')
              ? 'bg-[#FDECE7] text-[#B53A27]'
              : 'text-[#6B5B50] hover:bg-[#F3E9E5]'
          }`}
        >
          Analytics
        </Link>
        <Link
          to="performance/skills"
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            path.includes('performance/skills')
              ? 'bg-[#FDECE7] text-[#B53A27]'
              : 'text-[#6B5B50] hover:bg-[#F3E9E5]'
          }`}
        >
          Skills
        </Link>
        <Link
          to="performance/badges"
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            path.includes('performance/badges')
              ? 'bg-[#FDECE7] text-[#B53A27]'
              : 'text-[#6B5B50] hover:bg-[#F3E9E5]'
          }`}
        >
          Badges
        </Link>
      </div>
    );
  }
  
  return null;
}

function Dashboard() {
  const stats = [
    { label: "Active Gigs", value: "7", icon: Package, change: "+2" },
    { label: "Pending Proposals", value: "3", icon: FileText, change: "-1" },
    { label: "Monthly Earnings", value: "$4,250", icon: TrendingUp, change: "+12%" },
    { label: "Response Rate", value: "89%", icon: CheckCircle, change: "+3%" },
  ];

  const quickLinks = [
    { to: "gigs/create", icon: Plus, label: "Create Gig", description: "Post a new service" },
    { to: "requests/view", icon: Target, label: "Find Requests", description: "Browse buyer requests" },
    { to: "gigs/manage", icon: FileText, label: "Manage Gigs", description: "Edit your listings" },
    { to: "performance/analytics", icon: BarChart, label: "View Analytics", description: "Track performance" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-[#E7E1DE] rounded-xl p-4 shadow-[0_12px_30px_rgba(28,20,18,0.08)]">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-[#F3E9E5] rounded-lg">
                <stat.icon size={16} className="text-[#7A5A4C]" />
              </div>
              <span className={`text-xs font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="text-xl font-semibold text-[#2E2322] mb-1">{stat.value}</div>
            <div className="text-sm text-[#6B5B50]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white border border-[#E7E1DE] rounded-xl p-6 shadow-[0_12px_30px_rgba(28,20,18,0.08)]">
        <h3 className="font-semibold text-[#2E2322] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="group border border-[#E7E1DE] rounded-lg p-4 hover:border-[#C9452F] hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#F3E9E5] rounded-lg group-hover:bg-[#FDECE7]">
                  <link.icon size={16} className="text-[#7A5A4C] group-hover:text-[#C9452F]" />
                </div>
                <span className="font-medium text-[#2E2322]">{link.label}</span>
              </div>
              <p className="text-sm text-[#6B5B50]">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
