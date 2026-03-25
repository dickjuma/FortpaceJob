import React from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronRight,
  Compass,
  FileSearch,
  FolderKanban,
  LayoutDashboard,
  MonitorSmartphone,
  Palette,
  PenTool,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wrench,
} from "lucide-react";
import Categories from "./Gigs/Categories";

const skin = {
  bg: "bg-[#F6F0EB]",
  card: "bg-white",
  border: "border-[#E7DCD4]",
  ink: "text-[#2C211F]",
  muted: "text-[#6F5E56]",
  accent: "bg-[#C64A33]",
  accentSoft: "bg-[#FCE9E3]",
  accentText: "text-[#B13E29]",
  deep: "bg-[#2C211F]",
};

const marketGroups = [
  {
    title: "Creative",
    items: ["Branding", "UI/UX Design", "Illustration", "Content Design"],
    icon: Palette,
  },
  {
    title: "Digital Build",
    items: ["Web Development", "Mobile Apps", "No-code Builds", "E-commerce"],
    icon: MonitorSmartphone,
  },
  {
    title: "Business Support",
    items: ["Virtual Assistance", "Research", "Operations", "Project Support"],
    icon: BriefcaseBusiness,
  },
  {
    title: "Trades & Field Work",
    items: ["Repairs", "Installations", "Maintenance", "Site Services"],
    icon: Wrench,
  },
];

const focusCards = [
  {
    title: "High-fit categories",
    text: "Open the marketplace categories and focus on work that fits your strongest service areas.",
    to: "/find-work/gigs/categories",
    icon: Compass,
  },
  {
    title: "Proposal readiness",
    text: "Keep your proposals, gigs, and trust signals polished from the profile workspace before you apply.",
    to: "/my-profile/proposals",
    icon: ShieldCheck,
  },
  {
    title: "Profile quality",
    text: "A stronger profile usually converts better than applying to everything at once.",
    to: "/my-profile/overview",
    icon: FolderKanban,
  },
];

const quickActions = [
  { label: "Browse categories", to: "/find-work/gigs/categories", icon: Compass },
  { label: "Open proposals", to: "/my-profile/proposals", icon: FileSearch },
  { label: "Manage gigs", to: "/my-profile/gigs/manage", icon: PenTool },
];

function MarketLink({ to, label, icon: Icon }) {
  const location = useLocation();
  const active = location.pathname.includes(`/find-work/${to}`);

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
        active ? `${skin.accentSoft} ${skin.accentText}` : `${skin.ink} hover:bg-[#F2EAE4]`
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </Link>
  );
}

function PanelCard({ title, children, className = "" }) {
  return (
    <div className={`${skin.card} ${skin.border} rounded-[28px] border p-5 shadow-[0_18px_45px_rgba(33,24,21,0.05)] ${className}`}>
      <h2 className={`text-lg font-semibold ${skin.ink}`}>{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function MarketHome() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[34px] border border-[#E7DCD4] bg-[radial-gradient(circle_at_top_left,_#FFF7F2,_#F5ECE6_42%,_#FFFDFB_100%)] p-6 shadow-[0_22px_60px_rgba(33,24,21,0.07)] lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className={`text-sm uppercase tracking-[0.18em] ${skin.muted}`}>Find Work</p>
            <h1 className={`mt-3 text-3xl font-semibold ${skin.ink} sm:text-4xl`}>A clearer marketplace dashboard for opportunity discovery</h1>
            <p className={`mt-4 max-w-3xl text-sm leading-7 ${skin.muted}`}>
              This area is now focused on discovery, category direction, and next-step clarity. Your execution tools stay in the
              profile workspace, while messages, wallet, and payments remain on their own pages.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D8CCC4] bg-white px-4 py-2.5 text-sm font-medium text-[#2C211F] transition hover:bg-[#FCF6F1]"
                >
                  <action.icon size={15} />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[24px] bg-white/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#8A766D]">Best use</p>
              <p className="mt-2 text-lg font-semibold text-[#2C211F]">Discover, shortlist, then apply intentionally</p>
            </div>
            <div className="rounded-[24px] bg-white/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#8A766D]">Workspace split</p>
              <p className="mt-2 text-lg font-semibold text-[#2C211F]">Discovery here. Tools elsewhere.</p>
            </div>
            <div className="rounded-[24px] bg-white/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#8A766D]">Focus</p>
              <p className="mt-2 text-lg font-semibold text-[#2C211F]">Categories, fit, and better decisions</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <PanelCard title="Opportunity Board">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] bg-[#FCF7F3] p-4">
              <TrendingUp size={18} className="text-[#B13E29]" />
              <p className="mt-4 text-2xl font-semibold text-[#2C211F]">24</p>
              <p className="mt-1 text-sm text-[#6F5E56]">Fresh opportunities worth checking today</p>
            </div>
            <div className="rounded-[24px] bg-[#FCF7F3] p-4">
              <Sparkles size={18} className="text-[#B13E29]" />
              <p className="mt-4 text-2xl font-semibold text-[#2C211F]">8</p>
              <p className="mt-1 text-sm text-[#6F5E56]">Categories that closely match common freelancer strengths</p>
            </div>
            <div className="rounded-[24px] bg-[#FCF7F3] p-4">
              <ShieldCheck size={18} className="text-[#B13E29]" />
              <p className="mt-4 text-2xl font-semibold text-[#2C211F]">3</p>
              <p className="mt-1 text-sm text-[#6F5E56]">Core actions before you start applying widely</p>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] bg-[#2C211F] p-5 text-white">
            <p className="text-sm uppercase tracking-[0.16em] text-white/65">Recommended flow</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">1. Scan categories instead of random listings.</div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">2. Open only the spaces that fit your actual service offer.</div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">3. Move into profile tools once you know what you want to pursue.</div>
            </div>
          </div>
        </PanelCard>

        <PanelCard title="Category Panel">
          <div className="grid gap-4 md:grid-cols-2">
            {marketGroups.map((group) => (
              <div key={group.title} className="rounded-[24px] border border-[#EFE3DB] bg-[#FFFCFA] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#FCE9E3] p-3 text-[#B13E29]">
                    <group.icon size={18} />
                  </div>
                  <h3 className="text-base font-semibold text-[#2C211F]">{group.title}</h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full bg-[#F5EEE8] px-3 py-1.5 text-xs font-medium text-[#5E4E48]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/find-work/gigs/categories"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#C64A33] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#AF3E29]"
          >
            Open category explorer
            <ArrowRight size={15} />
          </Link>
        </PanelCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {focusCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className={`${skin.card} ${skin.border} rounded-[28px] border p-5 shadow-[0_18px_45px_rgba(33,24,21,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_55px_rgba(33,24,21,0.08)]`}
          >
            <div className={`${skin.accentSoft} inline-flex rounded-2xl p-3 ${skin.accentText}`}>
              <card.icon size={18} />
            </div>
            <h2 className={`mt-4 text-lg font-semibold ${skin.ink}`}>{card.title}</h2>
            <p className={`mt-2 text-sm leading-6 ${skin.muted}`}>{card.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function FindWork() {
  const location = useLocation();

  const title = location.pathname.includes("/gigs/categories")
    ? "Browse Categories"
    : "Find Work";

  const description = location.pathname.includes("/gigs/categories")
    ? "Explore opportunity spaces by category and navigate the marketplace more intentionally."
    : "A cleaner dashboard for discovery, category direction, and smarter next steps.";

  return (
    <div className={`min-h-screen ${skin.bg} flex`}>
      <aside className={`hidden w-80 shrink-0 border-r ${skin.border} ${skin.card} lg:flex lg:flex-col`}>
        <div className={`border-b ${skin.border} px-6 py-6`}>
          <p className={`text-xs uppercase tracking-[0.2em] ${skin.muted}`}>Marketplace</p>
          <h1 className={`mt-2 text-xl font-semibold ${skin.ink}`}>Find Work</h1>
          <p className={`mt-2 text-sm ${skin.muted}`}>Discovery first, action second.</p>
        </div>

        <div className="space-y-6 px-4 py-6">
          <div>
            <p className={`px-3 pb-2 text-xs uppercase tracking-[0.18em] ${skin.muted}`}>Dashboard</p>
            <div className="space-y-1">
              <MarketLink to="overview" label="Overview" icon={LayoutDashboard} />
              <MarketLink to="gigs/categories" label="Category Explorer" icon={Compass} />
            </div>
          </div>

          <div>
            <p className={`px-3 pb-2 text-xs uppercase tracking-[0.18em] ${skin.muted}`}>Next Steps</p>
            <div className="space-y-1">
              <Link
                to="/my-profile/proposals"
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${skin.ink} hover:bg-[#F2EAE4]`}
              >
                <FileSearch size={16} />
                <span>Proposal Workspace</span>
              </Link>
              <Link
                to="/my-profile/gigs/manage"
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${skin.ink} hover:bg-[#F2EAE4]`}
              >
                <FolderKanban size={16} />
                <span>Manage Gigs</span>
              </Link>
            </div>
          </div>

          <div className="rounded-[26px] bg-[#2C211F] p-5 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-white/60">Tip</p>
            <p className="mt-3 text-sm leading-6 text-white/85">
              Freelancers usually get better results when they narrow their search through categories first, then apply with stronger fit.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className={`${skin.card} border-b ${skin.border} px-4 py-4 md:px-6`}>
          <div className="flex items-center gap-2 text-sm">
            <Link to="/find-work/overview" className={skin.muted}>
              Find Work
            </Link>
            <ChevronRight size={14} className={skin.muted} />
            <span className={skin.ink}>{title}</span>
          </div>
          <h2 className={`mt-3 text-2xl font-semibold ${skin.ink}`}>{title}</h2>
          <p className={`mt-1 text-sm ${skin.muted}`}>{description}</p>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6">
          <div className="mx-auto max-w-7xl">
            <Routes>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<MarketHome />} />
              <Route path="gigs/categories" element={<Categories />} />

              <Route path="gigs/manage" element={<Navigate to="/my-profile/gigs/manage" replace />} />
              <Route path="gigs/create" element={<Navigate to="/my-profile/gigs/create" replace />} />
              <Route path="requests/view" element={<Navigate to="/buyer-requests" replace />} />
              <Route path="requests/manager" element={<Navigate to="/my-profile/proposals" replace />} />
              <Route path="messages" element={<Navigate to="/messages" replace />} />
              <Route path="performance/analytics" element={<Navigate to="/my-profile/analytics" replace />} />
              <Route path="performance/skills" element={<Navigate to="/my-profile/skills" replace />} />
              <Route path="performance/badges" element={<Navigate to="/my-profile/badges" replace />} />
              <Route path="performance/promotions" element={<Navigate to="/my-profile/promotions" replace />} />
              <Route path="*" element={<Navigate to="overview" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
