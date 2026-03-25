import React from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { BriefcaseBusiness, ChevronRight, FilePlus2, LayoutDashboard, Layers3, UserCircle2 } from "lucide-react";

const shell = {
  bg: "bg-[#F5EFEA]",
  card: "bg-white",
  border: "border-[#E5D9D0]",
  ink: "text-[#2B211F]",
  muted: "text-[#726058]",
  accent: "bg-[#C9452F]",
  accentSoft: "bg-[#FDECE7]",
  accentText: "text-[#B53A27]",
};

const navItems = [
  { to: "/client-services/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/client-services/profile", label: "Profile", icon: UserCircle2 },
  { to: "/client-services/create-job", label: "Create Job", icon: FilePlus2 },
  { to: "/client-services/my-jobs", label: "My Jobs", icon: BriefcaseBusiness },
];

export default function ClientServicesLayout() {
  const location = useLocation();
  const current = navItems.find((item) => location.pathname.startsWith(item.to))?.label || "Client Services";

  return (
    <div className={`min-h-screen ${shell.bg} flex`}>
      <aside className={`hidden w-72 shrink-0 border-r ${shell.border} ${shell.card} lg:flex lg:flex-col`}>
        <div className={`border-b ${shell.border} px-6 py-6`}>
          <p className={`text-xs uppercase tracking-[0.2em] ${shell.muted}`}>Client System</p>
          <h1 className={`mt-2 text-xl font-semibold ${shell.ink}`}>Service Requests</h1>
          <p className={`mt-2 text-sm ${shell.muted}`}>
            Client-side workspace for posting jobs and reviewing market responses.
          </p>
        </div>

        <div className="flex-1 space-y-2 px-4 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                  isActive ? `${shell.accentSoft} ${shell.accentText}` : `${shell.ink} hover:bg-[#F3ECE8]`
                }`
              }
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className={`border-t ${shell.border} px-4 py-5`}>
          <Link
            to="/talent"
            className={`flex items-center gap-3 rounded-xl border ${shell.border} px-3 py-3 text-sm ${shell.ink} hover:bg-[#F8F2EE]`}
          >
            <Layers3 size={16} />
            <span>Browse Talent</span>
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className={`${shell.card} border-b ${shell.border} px-4 py-4 md:px-6`}>
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/client-services/overview" className={shell.muted}>
                Client Services
              </Link>
              <ChevronRight size={14} className={shell.muted} />
              <span className={shell.ink}>{current}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
