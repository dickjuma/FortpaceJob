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

export default function FindWork() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname.includes(path);

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase size={18} className="text-white" />
            </div>
            <span className="font-semibold text-gray-900">Marketplace</span>
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
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
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

        <div className="p-4 border-t border-gray-200">
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
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Briefcase size={18} className="text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">Menu</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <MoreVertical size={20} className="text-gray-500" />
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
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2"
              >
                <MoreVertical size={20} className="text-gray-600" />
              </button>
              
              <div className="md:hidden">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <Briefcase size={12} className="text-white" />
                  </div>
                  <span className="font-semibold text-sm">Marketplace</span>
                </div>
              </div>

              {/* Breadcrumb */}
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <span className="text-gray-400">Marketplace</span>
                <ChevronRight size={14} />
                <Breadcrumb path={location.pathname} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:block flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell size={18} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search gigs, requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </header>

        {/* Sub-navigation for current section */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                {getPageTitle(location.pathname)}
              </h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
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
          <div className="max-w-7xl mx-auto">
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
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
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
            ? "bg-blue-50 text-blue-700" 
            : "text-gray-700 hover:bg-gray-100"
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
          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon size={16} />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
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
            ? "bg-blue-50 text-blue-700" 
            : "text-gray-700 hover:bg-gray-100"
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
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-700 hover:bg-gray-100"
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
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
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
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
        <User size={16} className="text-gray-600" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900">John Doe</div>
        <div className="text-xs text-gray-500">Seller Level 2</div>
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
      {index > 0 && <ChevronRight size={14} className="mx-2 text-gray-400" />}
      <span className={`${index === segments.length - 1 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
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
        className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <Plus size={14} />
        Create Gig
      </Link>
    );
  }
  if (path.includes('requests/view')) {
    return (
      <button className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2">
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
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Manage
        </Link>
        <Link
          to="gigs/create"
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            path.includes('gigs/create')
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Create
        </Link>
        <Link
          to="gigs/categories"
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            path.includes('gigs/categories')
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
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
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          View Requests
        </Link>
        <Link
          to="requests/manager"
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            path.includes('requests/manager')
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
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
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Analytics
        </Link>
        <Link
          to="performance/skills"
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            path.includes('performance/skills')
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Skills
        </Link>
        <Link
          to="performance/badges"
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            path.includes('performance/badges')
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
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
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <stat.icon size={16} className="text-gray-600" />
              </div>
              <span className={`text-xs font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="text-xl font-semibold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="group border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50">
                  <link.icon size={16} className="text-gray-600 group-hover:text-blue-600" />
                </div>
                <span className="font-medium text-gray-900">{link.label}</span>
              </div>
              <p className="text-sm text-gray-500">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}