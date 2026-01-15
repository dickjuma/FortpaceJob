// src/components/findWork/FindWork.jsx
import React, { useState } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { 
  PlusCircle, Zap, Target, ChevronDown, 
  Layers, BarChart3, Briefcase, Award, Settings 
} from "lucide-react";

// Imports for your components
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
  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col">
      
      {/* 1. Global Dark Header */}
      <header className="bg-[#4A312F] px-8 py-5 text-white shadow-2xl z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-[#B7E2BF] p-2 rounded-xl shadow-inner">
               <Zap size={20} className="text-[#4A312F] fill-[#4A312F]" />
            </div>
            <h1 className="text-xl font-black tracking-tight uppercase italic">Marketplace</h1>
          </div>

          <Link
            to="gigs/create"
            className="bg-[#D34079] hover:bg-white hover:text-[#D34079] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <PlusCircle size={14} /> Post a Gig
          </Link>
        </div>
      </header>

      {/* 2. Grouped Horizontal Navigation */}
      <nav className="bg-white border-b border-gray-100 px-8 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          
          {/* Dropdown: GIGS */}
          <NavDropdown 
            label="Service Gigs" 
            active={isActive("gigs")}
            icon={<Layers size={16} />}
            items={[
              { label: "Browse Categories", to: "gigs/categories" },
              { label: "Manage My Gigs", to: "gigs/manage" },
              { label: "Create New Gig", to: "gigs/create" },
            ]}
          />

          {/* Dropdown: OPPORTUNITIES */}
          <NavDropdown 
            label="Opportunities" 
            active={isActive("requests")}
            icon={<Briefcase size={16} />}
            items={[
              { label: "View Buyer Requests", to: "requests/view" },
              { label: "My Sent Proposals", to: "requests/manager" },
            ]}
          />

          {/* Dropdown: PERFORMANCE */}
          <NavDropdown 
            label="Performance" 
            active={isActive("performance")}
            icon={<BarChart3 size={16} />}
            items={[
              { label: "Earnings Analytics", to: "performance/analytics" },
              { label: "Skill Levels", to: "performance/skills" },
              { label: "Badges & Awards", to: "performance/badges" },
            ]}
          />

        </div>
      </nav>

      {/* 3. Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-8 py-10">
        
        {/* Contextual Logic Alert */}
        {isActive("requests") && (
            <div className="mb-8 bg-[#4A312F] text-white p-5 rounded-[2rem] flex items-center gap-4 shadow-xl">
                <div className="bg-[#B7E2BF] p-2 rounded-lg text-[#4A312F]"><Target size={18} /></div>
                <p className="text-xs font-bold uppercase tracking-widest">
                  System: Accepted proposals are automatically assigned to clients for billing.
                </p>
            </div>
        )}

        <Routes>
          <Route path="/" element={<Navigate to="gigs/categories" />} />
          
          {/* Gigs Routes */}
          <Route path="gigs/categories" element={<Categories />} />
          <Route path="gigs/create" element={<CreateGig />} />
          <Route path="gigs/manage" element={<ManageGigs />} />

          {/* Requests Routes */}
          <Route path="requests/view" element={<ViewRequests />} />
          <Route path="requests/manager" element={<ProposalManager />} />

          {/* Performance Routes */}
          <Route path="performance/analytics" element={<Analytics />} />
          <Route path="performance/skills" element={<SkillLevels />} />
          <Route path="performance/badges" element={<Badges />} />
          
          <Route path="*" element={<div className="p-20 text-center text-gray-300 font-black uppercase tracking-widest">Select a menu item</div>} />
        </Routes>
      </main>
    </div>
  );
}

// Reusable Dropdown Component
function NavDropdown({ label, items, active, icon }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className={`flex items-center gap-2 px-5 py-6 transition-all border-b-2 ${
        active ? "border-[#D34079] text-black" : "border-transparent text-gray-400"
      }`}>
        <span className={active ? "text-[#D34079]" : "text-gray-300"}>{icon}</span>
        <span className="text-[11px] font-black uppercase tracking-[0.15em]">{label}</span>
        <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <div className={`absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-2xl rounded-b-2xl py-2 transition-all duration-200 origin-top-left ${
        isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      }`}>
        {items.map((item, idx) => (
          <Link
            key={idx}
            to={item.to}
            className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#D34079] hover:bg-[#F7F9FB] transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}