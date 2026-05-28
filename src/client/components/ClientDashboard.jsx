import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { useAuthStore } from "../../admin/store/authStore";
import { 
  Home, 
  Package, 
  Briefcase, 
  MessageSquare, 
  BarChart, 
  User, 
  Settings,
  Wallet,
  FileText,
  ShoppingBag,
  Users,
  Heart,
  Bell,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import FinancePage from "../../common/pages/FinancePage";
import MessagesPage from "../../common/pages/MessagesPage";

// Placeholder Components
const ClientOverview = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Welcome back, Client!</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-semibold mb-2">Active Jobs</h3>
        <p className="text-3xl font-bold text-brand-600">5</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-semibold mb-2">Pending Orders</h3>
        <p className="text-3xl font-bold text-brand-600">3</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-semibold mb-2">Total Spent</h3>
        <p className="text-3xl font-bold text-brand-600">$2,450</p>
      </div>
    </div>
  </div>
);

const ClientJobsPage = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">My Jobs</h2>
    <p>Job listing and management interface will be displayed here.</p>
  </div>
);

const ClientOrdersPage = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">My Orders</h2>
    <p>Order management interface will be displayed here.</p>
  </div>
);

const ClientFavoritesPage = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Favorite Freelancers</h2>
    <p>Your favorite freelancers will be displayed here.</p>
  </div>
);

const ClientSettingsPage = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
    <p>Client settings interface will be displayed here.</p>
  </div>
);

const NavLink = ({ to, icon: Icon, label, badge }) => {
  const location = useLocation();
  const baseHref = "/client-dashboard";
  const fullPath = to ? `${baseHref}/${to}` : baseHref;
  const isActive = location.pathname.startsWith(fullPath);

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
        isActive
          ? "bg-brand-50 text-brand-700 font-medium"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
      {badge && (
        <span className="ml-auto bg-brand-600 text-white text-xs rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
    </Link>
  );
};

const ClientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(3);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const menuItems = [
    { path: "", icon: Home, label: "Overview" },
    { path: "jobs", icon: Briefcase, label: "My Jobs" },
    { path: "orders", icon: ShoppingBag, label: "My Orders" },
    { path: "messages", icon: MessageSquare, label: "Messages", badge: unreadCount },
    { path: "payments", icon: Wallet, label: "Payments" },
    { path: "favorites", icon: Heart, label: "Favorites" },
    { path: "settings", icon: Settings, label: "Settings" },
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    for (const item of menuItems) {
      if (path.includes(item.path) && item.path !== "") return item.label;
    }
    if (path === "/client-dashboard") return "Overview";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{user?.firstName || "Client"}</h2>
              <p className="text-xs text-gray-500">Client Account</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 w-full"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<ClientOverview />} />
              <Route path="jobs/*" element={<ClientJobsPage />} />
              <Route path="orders/*" element={<ClientOrdersPage />} />
              <Route path="messages/*" element={<MessagesPage />} />
              <Route path="payments/*" element={<FinancePage initialTab="payments" />} />
              <Route path="favorites/*" element={<ClientFavoritesPage />} />
              <Route path="settings/*" element={<ClientSettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;