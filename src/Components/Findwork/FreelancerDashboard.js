import React from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  Briefcase,
  MessageSquare,
  BarChart,
  User,
  Settings,
} from "lucide-react";

// Import the components that will be moved here
import ManageGigs from "../Findwork/Gigs/ManageGigs";
import CreateGig from "../Findwork/Gigs/CreateGig";
import ProposalManager from "../Findwork/BuyerRequests/ProposalManager";
import Messages from "../Findwork/Messages";
import Analytics from "../Findwork/Performance/Analytics";
import SkillLevels from "../Findwork/Performance/SkillLevels";
import Badges from "../Findwork/Performance/Badges";
import ProfileSettings from "../Profile/ProfileSettings";

// Placeholders for new pages
const DashboardOverview = () => <div className="text-gray-700"><h2>Your Activity Overview</h2><p>Stats and quick links will be shown here.</p></div>; 

const NavLink = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const baseHref = "/dashboard"; // Base path for this dashboard
  const fullPath = to ? `${baseHref}/${to}` : baseHref;
  const isActive = location.pathname.startsWith(fullPath);

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
        isActive
          ? "bg-purple-50 text-purple-700 font-medium"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </Link>
  );
};

export default function FreelancerDashboard() {
  const location = useLocation();
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/gigs")) return "My Gigs";
    if (path.includes("/proposals")) return "My Proposals";
    if (path.includes("/messages")) return "Messages";
    if (path.includes("/performance")) return "Performance";
    if (path.includes("/settings")) return "Settings";
    return "Dashboard Overview";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <span className="font-semibold text-gray-900">My Dashboard</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="" icon={Home} label="Overview" />
          <NavLink to="gigs/manage" icon={Package} label="My Gigs" />
          <NavLink to="proposals" icon={Briefcase} label="My Proposals" />
          <NavLink to="messages" icon={MessageSquare} label="Messages" />
          <NavLink to="performance/analytics" icon={BarChart} label="Performance" />
          <NavLink to="settings" icon={Settings} label="Settings" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<DashboardOverview />} />
              <Route path="gigs">
                <Route path="manage" element={<ManageGigs />} />
                <Route path="create" element={<CreateGig />} />
                <Route index element={<Navigate to="manage" replace />} />
              </Route>
              <Route path="proposals" element={<ProposalManager />} />
              <Route path="messages/*" element={<Messages />} />
              <Route path="performance">
                <Route path="analytics" element={<Analytics />} />
                <Route path="skills" element={<SkillLevels />} />
                <Route path="badges" element={<Badges />} />
                <Route index element={<Navigate to="analytics" replace />} />
              </Route>
              <Route path="settings" element={<ProfileSettings />} />
              <Route path="*" element={<Navigate to="" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}