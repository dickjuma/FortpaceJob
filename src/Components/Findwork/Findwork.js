import React, { useState } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  PlusCircle,
  Zap,
  Target,
  ChevronDown,
  Layers,
  BarChart3,
  Briefcase,
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

  const isActive = (segment) =>
    location.pathname.split("/").includes(segment);

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="bg-[#4A312F] px-8 py-5 text-white shadow-2xl z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-[#B7E2BF] p-2 rounded-xl">
              <Zap size={20} className="text-[#4A312F]" />
            </div>
            <h1 className="text-xl font-black uppercase italic">
              Marketplace
            </h1>
          </div>

          <Link
            to="gigs/create"
            className="bg-[#D34079] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-[#D34079] transition-all"
          >
            <PlusCircle size={14} />
            Post a Gig
          </Link>
        </div>
      </header>

      {/* ================= NAV ================= */}
      <nav className="bg-white border-b px-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex gap-2">
          <NavDropdown
            label="Service Gigs"
            icon={<Layers size={16} />}
            active={isActive("gigs")}
            items={[
              { label: "Browse Categories", to: "gigs/categories" },
              { label: "Manage My Gigs", to: "gigs/manage" },
              { label: "Create New Gig", to: "gigs/create" },
            ]}
          />

          <NavDropdown
            label="Opportunities"
            icon={<Briefcase size={16} />}
            active={isActive("requests")}
            items={[
              { label: "View Buyer Requests", to: "requests/view" },
              { label: "My Sent Proposals", to: "requests/manager" },
            ]}
          />

          <NavDropdown
            label="Performance"
            icon={<BarChart3 size={16} />}
            active={isActive("performance")}
            items={[
              { label: "Earnings Analytics", to: "performance/analytics" },
              { label: "Skill Levels", to: "performance/skills" },
              { label: "Badges & Awards", to: "performance/badges" },
            ]}
          />
        </div>
      </nav>

      {/* ================= CONTENT ================= */}
      <main className="flex-1 max-w-7xl mx-auto px-8 py-10 w-full">
        {isActive("requests") && (
          <div className="mb-8 bg-[#4A312F] text-white p-5 rounded-[2rem] flex items-center gap-4">
            <div className="bg-[#B7E2BF] p-2 rounded-lg text-[#4A312F]">
              <Target size={18} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest">
              Accepted proposals are automatically assigned for billing.
            </p>
          </div>
        )}

        <Routes>
          {/* ✅ CORRECT DEFAULT CHILD ROUTE */}
          <Route
            index
            element={<Navigate to="gigs/categories" replace />}
          />

          {/* Gigs */}
          <Route path="gigs/categories" element={<Categories />} />
          <Route path="gigs/create" element={<CreateGig />} />
          <Route path="gigs/manage" element={<ManageGigs />} />

          {/* Requests */}
          <Route path="requests/view" element={<ViewRequests />} />
          <Route
            path="requests/manager"
            element={<ProposalManager />}
          />

          {/* Performance */}
          <Route
            path="performance/analytics"
            element={<Analytics />}
          />
          <Route
            path="performance/skills"
            element={<SkillLevels />}
          />
          <Route
            path="performance/badges"
            element={<Badges />}
          />

          {/* Fallback */}
          <Route
            path="*"
            element={
              <div className="p-20 text-center text-gray-400 font-black uppercase">
                Select a menu item
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

/* ================= DROPDOWN ================= */
function NavDropdown({ label, items, active, icon }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={`flex items-center gap-2 px-5 py-6 border-b-2 transition-all ${
          active
            ? "border-[#D34079] text-black"
            : "border-transparent text-gray-600 hover:text-black"
        }`}
      >
        <span
          className={
            active ? "text-[#D34079]" : "text-gray-500"
          }
        >
          {icon}
        </span>
        <span className="text-[11px] font-black uppercase tracking-widest">
          {label}
        </span>
        <ChevronDown
          size={12}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute left-0 top-full w-56 bg-white border shadow-2xl rounded-b-2xl py-2 transition-all z-50 ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-[#F7F9FB] hover:text-[#D34079]"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
