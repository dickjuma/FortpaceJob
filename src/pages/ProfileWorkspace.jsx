import React from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  BarChart3,
  Briefcase,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  Plus,
  ShieldCheck,
  User,
  Award,
  Sparkles,
} from "lucide-react";
import MyProfile from "./MyProfile";
import ManageGigs from "../Components/Findwork/Gigs/ManageGigs";
import CreateGig from "../Components/Findwork/Gigs/CreateGig";
import ProposalManager from "../Components/Findwork/BuyerRequests/ProposalManager";
import Analytics from "../Components/Findwork/Performance/Analytics";
import SkillLevels from "../Components/Findwork/Performance/SkillLevels";
import Badges from "../Components/Findwork/Performance/Badges";
import Promotions from "../Components/Findwork/Performance/Promotions";
import { getUser } from "../Services/api";

const shell = {
  bg: "bg-[#F6F1EE]",
  card: "bg-white",
  border: "border-[#E7DDD8]",
  ink: "text-[#2B211F]",
  muted: "text-[#6F5B53]",
  accent: "bg-[#C9452F]",
  accentText: "text-[#B53A27]",
  accentSoft: "bg-[#FDECE7]",
};

const menuSections = [
  {
    title: "Profile",
    items: [
      { to: "overview", label: "Workspace", icon: LayoutDashboard },
      { to: "edit", label: "Edit Profile", icon: User },
    ],
  },
  {
    title: "Work",
    items: [
      { to: "gigs/manage", label: "Manage Gigs", icon: FolderKanban },
      { to: "gigs/create", label: "Create Gig", icon: Plus },
      { to: "proposals", label: "Proposals", icon: Briefcase },
    ],
  },
  {
    title: "Growth",
    items: [
      { to: "analytics", label: "Analytics", icon: BarChart3 },
      { to: "skills", label: "Skill Levels", icon: Sparkles },
      { to: "badges", label: "Badges", icon: Award },
      { to: "promotions", label: "Promotions", icon: ShieldCheck },
    ],
  },
];

function WorkspaceNavLink({ to, label, icon: Icon }) {
  const location = useLocation();
  const isActive = location.pathname.includes(`/my-profile/${to}`);

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
        isActive
          ? `${shell.accentSoft} ${shell.accentText}`
          : `${shell.ink} hover:bg-[#F2EBE7]`
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </Link>
  );
}

function WorkspaceOverview() {
  const user = getUser();

  const sections = [
    {
      title: "Profile",
      text: "Edit your profile details, verification, media, and account settings.",
      to: "/my-profile/edit",
      icon: User,
    },
    {
      title: "Work",
      text: "Manage gigs and proposals from one clean workspace.",
      to: "/my-profile/gigs/manage",
      icon: FolderKanban,
    },
    {
      title: "Growth",
      text: "Track analytics, badges, promotions, and profile momentum.",
      to: "/my-profile/analytics",
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-6">
      <div className={`${shell.card} ${shell.border} rounded-3xl border p-6`}>
        <p className={`text-sm uppercase tracking-[0.18em] ${shell.muted}`}>Profile workspace</p>
        <h1 className={`mt-2 text-3xl font-semibold ${shell.ink}`}>
          {user?.name || user?.companyName || "Workspace"}
        </h1>
        <p className={`mt-3 max-w-2xl text-sm ${shell.muted}`}>
          This is your main profile workspace. Use the left menu to move between profile, work, growth, and finance without
          jumping back into Find Work.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {sections.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className={`${shell.card} ${shell.border} rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className={`${shell.accentSoft} inline-flex rounded-xl p-3 ${shell.accentText}`}>
              <card.icon size={18} />
            </div>
            <h2 className={`mt-4 text-lg font-semibold ${shell.ink}`}>{card.title}</h2>
            <p className={`mt-2 text-sm ${shell.muted}`}>{card.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ProfileWorkspace() {
  const location = useLocation();
  const pageTitle =
    menuSections
      .flatMap((section) => section.items)
      .find((item) => location.pathname.includes(`/my-profile/${item.to}`))?.label || "Profile Workspace";

  return (
    <div className={`min-h-screen ${shell.bg} flex`}>
      <aside className={`hidden w-72 shrink-0 border-r ${shell.border} ${shell.card} lg:flex lg:flex-col`}>
        <div className={`border-b ${shell.border} px-6 py-6`}>
          <p className={`text-xs uppercase tracking-[0.2em] ${shell.muted}`}>Workspace</p>
          <h1 className={`mt-2 text-xl font-semibold ${shell.ink}`}>My Profile Hub</h1>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              <p className={`px-3 pb-2 text-xs uppercase tracking-[0.18em] ${shell.muted}`}>
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <WorkspaceNavLink key={item.to} {...item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className={`${shell.card} border-b ${shell.border} px-4 py-4 md:px-6`}>
          <div className="flex items-center gap-2 text-sm">
            <Link to="/my-profile/overview" className={shell.muted}>
              My Profile
            </Link>
            <ChevronRight size={14} className={shell.muted} />
            <span className={shell.ink}>{pageTitle}</span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6">
          <div className="mx-auto max-w-7xl">
            <Routes>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<WorkspaceOverview />} />
              <Route path="edit" element={<MyProfile />} />
              <Route path="gigs/manage" element={<ManageGigs />} />
              <Route path="gigs/create" element={<CreateGig />} />
              <Route path="proposals" element={<ProposalManager />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="skills" element={<SkillLevels />} />
              <Route path="badges" element={<Badges />} />
              <Route path="promotions" element={<Promotions />} />
              <Route path="wallet" element={<Navigate to="/wallet" replace />} />
              <Route path="payments" element={<Navigate to="/payments" replace />} />
              <Route path="*" element={<Navigate to="overview" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
