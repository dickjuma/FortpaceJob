import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Wallet, 
  Gavel, 
  ShieldAlert, 
  MessageSquare, 
  BarChart3, 
  History, 
  Settings,
  Search,
  LogOut,
  ShieldCheck,
  X
} from "lucide-react";
import SidebarItem from "./sidebar/SidebarItem";
import SidebarGroup from "./sidebar/SidebarGroup";

const sidebarStructure = [
  {
    type: "group",
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
    items: [
      { label: "Overview", path: "/admin" },
      { label: "Live Activity", path: "/admin/activity" },
      { label: "Alerts Center", path: "/admin/alerts", badge: "3" }
    ]
  },
  {
    type: "group",
    id: "users",
    label: "User Management",
    icon: Users,
    items: [
      { label: "All Users", path: "/admin/users" },
      { label: "Freelancers", path: "/admin/users/freelancers" },
      { label: "Clients", path: "/admin/users/clients" },
      { label: "Organizations", path: "/admin/users/orgs" },
      { label: "Admins", path: "/admin/users/admins" }
    ]
  },
  {
    type: "group",
    id: "marketplace",
    label: "Marketplace",
    icon: Briefcase,
    items: [
      { label: "Jobs", path: "/admin/marketplace/jobs" },
      { label: "Gigs", path: "/admin/marketplace/gigs" },
      { label: "Proposals", path: "/admin/marketplace/proposals" },
      { label: "Contracts", path: "/admin/marketplace/contracts" },
      { label: "Reviews", path: "/admin/marketplace/reviews" },
      { label: "Reported Content", path: "/admin/marketplace/reports", badge: "12" },
      { label: "Categories", path: "/admin/marketplace/categories" },
      { label: "Rankings", path: "/admin/marketplace/rankings" },
      { label: "Quality", path: "/admin/marketplace/quality" },
      { label: "Moderation", path: "/admin/marketplace/moderation" },
      { label: "Fraud Center", path: "/admin/marketplace/fraud-center" },
      { label: "Payments", path: "/admin/marketplace/payments" },
      { label: "Proposal Audit", path: "/admin/marketplace/proposal-audit" },
      { label: "Chat Intelligence", path: "/admin/marketplace/chat" }
    ]
  },
  {
    type: "item",
    id: "finance-overview",
    label: "Finance: Overview",
    icon: Wallet,
    path: "/admin/finance"
  },
  {
    type: "item",
    id: "finance-transactions",
    label: "Finance: Transactions",
    icon: Wallet,
    path: "/admin/finance/transactions"
  },
  {
    type: "item",
    id: "finance-deposits",
    label: "Finance: Deposits",
    icon: Wallet,
    path: "/admin/finance/deposits"
  },
  {
    type: "item",
    id: "finance-escrow",
    label: "Finance: Escrow",
    icon: Wallet,
    path: "/admin/finance/escrow"
  },
  {
    type: "item",
    id: "finance-withdrawals",
    label: "Finance: Withdrawals",
    icon: Wallet,
    path: "/admin/finance/withdrawals",
    badge: "8"
  },
  {
    type: "item",
    id: "finance-refunds",
    label: "Finance: Refunds",
    icon: Wallet,
    path: "/admin/finance/refunds"
  },
  {
    type: "item",
    id: "finance-fees",
    label: "Finance: Fees & Config",
    icon: Wallet,
    path: "/admin/finance/fees"
  },
  {
    type: "item",
    id: "finance-fee-collection",
    label: "Finance: Fees Collected",
    icon: Wallet,
    path: "/admin/finance/fee-collection"
  },
  {
    type: "item",
    id: "finance-subscriptions",
    label: "Finance: Subscriptions",
    icon: Wallet,
    path: "/admin/finance/subscriptions"
  },
  {
    type: "item",
    id: "finance-reconciliation",
    label: "Finance: Reconciliation",
    icon: Wallet,
    path: "/admin/finance/reconciliation"
  },
  {
    type: "item",
    id: "finance-payouts",
    label: "Finance: Payout Reports",
    icon: Wallet,
    path: "/admin/finance/payouts"
  },
  {
    type: "item",
    id: "finance-tax",
    label: "Finance: Tax Compliance",
    icon: Wallet,
    path: "/admin/finance/tax"
  },
  {
    type: "item",
    id: "finance-wallets",
    label: "Finance: Wallet Controls",
    icon: Wallet,
    path: "/admin/finance/wallets"
  },
  {
    type: "group",
    id: "disputes",
    label: "Dispute Resolution",
    icon: Gavel,
    items: [
      { label: "Open Disputes", path: "/admin/disputes", badge: "4" },
      { label: "In Review", path: "/admin/disputes/review" },
      { label: "Resolved", path: "/admin/disputes/resolved" }
    ]
  },
  {
    type: "group",
    id: "fraud",
    label: "Fraud & Security",
    icon: ShieldAlert,
    items: [
      { label: "Security Alerts", path: "/admin/fraud/alerts", badge: "!" },
      { label: "Risky Users", path: "/admin/fraud/risky" },
      { label: "Blacklist", path: "/admin/fraud/blacklist" },
      { label: "Rules Engine", path: "/admin/fraud/rules" },
      { label: "IP Monitoring", path: "/admin/fraud/ips" }
    ]
  },
  {
    type: "group",
    id: "chat",
    label: "Chat Oversight",
    icon: MessageSquare,
    items: [
      { label: "Conversations", path: "/admin/chat/list" },
      { label: "Reported Messages", path: "/admin/chat/reports" },
      { label: "Auto Mod Logs", path: "/admin/chat/automod" }
    ]
  },
  {
    type: "group",
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    items: [
      { label: "Platform KPIs", path: "/admin/analytics" },
      { label: "Revenue", path: "/admin/analytics/revenue" },
      { label: "User Growth", path: "/admin/analytics/growth" },
      { label: "Fraud Trends", path: "/admin/analytics/fraud" }
    ]
  },
  {
    type: "item",
    id: "audit",
    label: "Audit Logs",
    icon: History,
    path: "/admin/audit"
  },
  {
    type: "group",
    id: "settings",
    label: "System Config",
    icon: Settings,
    items: [
      { label: "General", path: "/admin/config/general" },
      { label: "Security", path: "/admin/config/security" },
      { label: "Gateways", path: "/admin/config/gateways" },
      { label: "Roles", path: "/admin/config/roles" },
      { label: "Feature Flags", path: "/admin/config/flags" }
    ]
  }
];

const AdminSidebar = ({ isMobile, onClose }) => {
  const [openGroup, setOpenGroup] = useState("finance");

  const handleToggle = (id) => {
    setOpenGroup(openGroup === id ? null : id);
  };

  return (
    <aside className={`
      ${isMobile ? "w-full h-full" : "w-72 h-screen border-r border-zinc-800"} 
      bg-surface-dark text-zinc-300 flex flex-col transition-all duration-300 z-50
    `}>
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="bg-success p-2 rounded-xl shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight text-lg leading-none">FORTE</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Control Hub</p>
          </div>
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Global Search in Sidebar for fast access */}
      {!isMobile && (
        <div className="px-6 py-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-600 group-focus-within:text-success transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Quick Jump..." 
              className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-emerald-500/50 transition-all text-zinc-300 placeholder:text-zinc-600"
            />
          </div>
        </div>
      )}

      {/* Navigation Tree */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1 custom-scrollbar">
        {sidebarStructure.map((node) => {
          if (node.type === "group") {
            return (
              <SidebarGroup
                key={node.id}
                label={node.label}
                icon={node.icon}
                items={node.items}
                isOpen={openGroup === node.id}
                onToggle={() => handleToggle(node.id)}
              />
            );
          }
          
          // Flatten items for mobile if they are main items
          if (isMobile && node.items) {
            return (
               <div key={node.id} className="space-y-1">
                 <p className="px-4 pt-4 pb-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{node.label}</p>
                 {node.items.map(sub => (
                    <SidebarItem key={sub.path} item={sub} onClick={onClose} />
                 ))}
               </div>
            );
          }

          return <SidebarItem key={node.id} item={node} onClick={isMobile ? onClose : undefined} />;
        })}
      </nav>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-zinc-800 bg-surface-dark/50">
        <div className="bg-zinc-800/40 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-zinc-800/60 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-xs font-bold text-success border border-emerald-500/20">
              SA
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">Super Admin</p>
              <p className="text-[10px] text-zinc-500 truncate font-medium">master@forte.com</p>
            </div>
          </div>
          <button className="text-zinc-500 group-hover:text-rose-500 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
