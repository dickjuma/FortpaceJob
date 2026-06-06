// ClientTeamManagementPage.jsx
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, DollarSign, FileText, Clock, Mail, ChevronDown, ChevronUp,
  Shield, Search, X, Check, MoreVertical, Trash2, Edit2, UserPlus,
  Activity, AlertCircle, CheckCircle, Filter, ChevronRight, Send,
  Eye, EyeOff, RefreshCw, Download, Lock, Unlock, ArrowUpDown,
  BadgeCheck, Bell, Briefcase, Building, Calendar, Star
} from "lucide-react";
import { getClientTeamMembers } from "../services/clientApi";

// Helper for conditional classes
const cn = (...classes) => classes.filter(Boolean).join(' ');

// ─── Mock Data ───────────────────────────────────────────────────────────────

const ROLES = ["Owner", "Hiring Manager", "Finance", "Recruiter", "Viewer"];

const ROLE_COLORS = {
  Owner: "bg-accent-light text-accent-dark",
  "Hiring Manager": "bg-accent-light text-accent-dark",
  Finance: "bg-info-light text-info",
  Recruiter: "bg-info-light text-info",
  Viewer: "bg-surface-muted text-ink-secondary",
};

const PERMISSIONS = [
  { key: "postJobs", label: "Post Jobs" },
  { key: "reviewProposals", label: "Review Proposals" },
  { key: "hireFreelancers", label: "Hire Freelancers" },
  { key: "manageContracts", label: "Manage Contracts" },
  { key: "viewBilling", label: "View Billing" },
  { key: "processPayments", label: "Process Payments" },
  { key: "manageTeam", label: "Manage Team" },
  { key: "viewAnalytics", label: "View Analytics" },
];

const PERMISSIONS_MATRIX = {
  Owner:          { postJobs: true,  reviewProposals: true,  hireFreelancers: true,  manageContracts: true,  viewBilling: true,  processPayments: true,  manageTeam: true,  viewAnalytics: true },
  "Hiring Manager": { postJobs: true,  reviewProposals: true,  hireFreelancers: true,  manageContracts: true,  viewBilling: false, processPayments: false, manageTeam: false, viewAnalytics: true },
  Finance:        { postJobs: false, reviewProposals: false, hireFreelancers: false, manageContracts: true,  viewBilling: true,  processPayments: true,  manageTeam: false, viewAnalytics: true },
  Recruiter:      { postJobs: true,  reviewProposals: true,  hireFreelancers: false, manageContracts: false, viewBilling: false, processPayments: false, manageTeam: false, viewAnalytics: false },
  Viewer:         { postJobs: false, reviewProposals: true,  hireFreelancers: false, manageContracts: false, viewBilling: false, processPayments: false, manageTeam: false, viewAnalytics: true },
};

const ACTIVITY_LOG = [
  { id: 1, icon: UserPlus, color: "text-accent", description: "Invited Rachel Torres as Viewer", member: "Alexandra Carter", time: "10 min ago" },
  { id: 2, icon: Edit2, color: "text-accent", description: "Changed Daniel Kim's role to Recruiter", member: "Alexandra Carter", time: "2 hours ago" },
  { id: 3, icon: FileText, color: "text-accent", description: "Created contract #C-2041 with freelancer", member: "Marcus Johnson", time: "3 hours ago" },
  { id: 4, icon: CheckCircle, color: "text-accent", description: "Approved proposal from John Doe", member: "Sophia Williams", time: "5 hours ago" },
  { id: 5, icon: DollarSign, color: "text-accent", description: "Processed payment of $4,200", member: "Priya Sharma", time: "8 hours ago" },
  { id: 6, icon: Trash2, color: "text-danger", description: "Removed Sarah Chen from the team", member: "Alexandra Carter", time: "1 day ago" },
  { id: 7, icon: Users, color: "text-accent", description: "Updated team permissions matrix", member: "Alexandra Carter", time: "2 days ago" },
  { id: 8, icon: Briefcase, color: "text-warn", description: "Posted new job: Senior React Developer", member: "Marcus Johnson", time: "2 days ago" },
  { id: 9, icon: Star, color: "text-warn", description: "Left review for freelancer Mike Ross", member: "Sophia Williams", time: "3 days ago" },
  { id: 10, icon: Bell, color: "text-ink-tertiary", description: "Updated notification preferences", member: "Ben Harper", time: "4 days ago" },
];

const STAT_CARDS = [
  { label: "Total Members", value: "8", icon: Users, color: "text-accent", bg: "bg-accent-light" },
  { label: "Active Contracts", value: "14", icon: FileText, color: "text-accent", bg: "bg-accent-light" },
  { label: "This Month Spend", value: "$28,400", icon: DollarSign, color: "text-accent", bg: "bg-accent-light" },
  { label: "Pending Invites", value: "2", icon: Clock, color: "text-warn", bg: "bg-warn-light" },
];

// ─── Mock Members Data ───────────────────────────────────────────────────────
const MOCK_MEMBERS = [
  {
    id: 1,
    name: "Alexandra Carter",
    email: "alex@acme.com",
    role: "Owner",
    lastActive: "Today",
    contracts: 12,
    status: "Active",
    avatar: "AC",
    avatarBg: "bg-accent",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    email: "marcus@acme.com",
    role: "Hiring Manager",
    lastActive: "2 hours ago",
    contracts: 8,
    status: "Active",
    avatar: "MJ",
    avatarBg: "bg-info",
  },
  {
    id: 3,
    name: "Sophia Williams",
    email: "sophia@acme.com",
    role: "Recruiter",
    lastActive: "5 hours ago",
    contracts: 5,
    status: "Active",
    avatar: "SW",
    avatarBg: "bg-info",
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya@acme.com",
    role: "Finance",
    lastActive: "Yesterday",
    contracts: 3,
    status: "Active",
    avatar: "PS",
    avatarBg: "bg-info",
  },
  {
    id: 5,
    name: "Ben Harper",
    email: "ben@acme.com",
    role: "Viewer",
    lastActive: "2 days ago",
    contracts: 0,
    status: "Inactive",
    avatar: "BH",
    avatarBg: "bg-surface-muted",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ card, index }) {
  const Icon = card.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white border border-border rounded-2xl shadow-sm p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-tertiary">{card.label}</p>
          <p className="text-2xl font-bold text-ink-primary mt-1">{card.value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${card.color}`} />
        </div>
      </div>
    </motion.div>
  );
}

function RoleBadge({ role }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[role]}`}>
      {role}
    </span>
  );
}

function InviteModal({ onClose }) {
  const [form, setForm] = useState({ email: "", role: "Viewer", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email) { setError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setError("Enter a valid email"); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white border border-border rounded-2xl shadow-xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-lg font-bold text-brand-900">Invite Team Member</h3>
            <p className="text-sm text-ink-secondary mt-0.5">Send an invitation to join your team</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-soft transition-colors">
            <X className="w-5 h-5 text-ink-tertiary" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-8 text-center"
            >
              <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-accent-dark" />
              </div>
              <h4 className="font-display text-lg font-bold text-brand-900">Invitation Sent!</h4>
              <p className="text-ink-secondary mt-2 text-sm">
                Invitation sent to <span className="font-medium text-ink-primary">{form.email}</span>
              </p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg font-medium transition-colors">
                Done
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-primary mb-1.5">Email Address <span className="text-danger">*</span></label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => { setForm(f => ({ ...f, email: e.target.value })); setError(""); }}
                  placeholder="colleague@company.com"
                  className="w-full h-10 border border-border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                />
                {error && <p className="text-danger text-xs mt-1">{error}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-primary mb-1.5">Role</label>
                <div className="relative">
                  <select
                    value={form.role}
                    onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-900 appearance-none"
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-primary mb-1.5">Message <span className="text-ink-tertiary font-normal">(optional)</span></label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Add a personal note to the invitation..."
                  rows={3}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 resize-none"
                />
              </div>
              <div className={`rounded-xl p-3 border text-sm ${ROLE_COLORS[form.role]} border-current/20 bg-opacity-10`}>
                <p className="font-medium mb-1">{form.role} permissions include:</p>
                <p className="opacity-80 text-xs">
                  {Object.entries(PERMISSIONS_MATRIX[form.role])
                    .filter(([, v]) => v)
                    .map(([k]) => PERMISSIONS.find(p => p.key === k)?.label)
                    .join(", ")}
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-ink-primary hover:bg-surface-soft font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent-dark disabled:opacity-60 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Invite
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function EditRoleDropdown({ member, onClose, onSave }) {
  const [selected, setSelected] = useState(member.role);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute right-0 top-8 z-30 w-48 bg-white border border-border rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-2">
        <p className="text-xs font-medium text-ink-tertiary px-2 py-1">Change Role</p>
        {ROLES.map(r => (
          <button
            key={r}
            onClick={() => { setSelected(r); onSave(r); onClose(); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
              selected === r
                ? "bg-accent-light text-accent-dark"
                : "hover:bg-surface-soft text-ink-primary"
            }`}
          >
            {r}
            {selected === r && <Check className="w-4 h-4" />}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function MemberRow({ member, selected, onToggleSelect, onUpdateRole, onRemove, index }) {
  const [expanded, setExpanded] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`border-b border-border hover:bg-surface-soft transition-colors cursor-pointer ${selected ? "bg-accent-light" : ""}`}
      >
        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect(member.id)}
            className="rounded border-border text-accent focus:ring-accent"
          />
        </td>
        <td className="px-4 py-3.5" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${member.avatarBg} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
              {member.avatar}
            </div>
            <div>
              <p className="text-sm font-medium text-ink-primary">{member.name}</p>
              <p className="text-xs text-ink-tertiary">{member.email}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3.5" onClick={() => setExpanded(!expanded)}>
          <RoleBadge role={member.role} />
        </td>
        <td className="px-4 py-3.5 text-sm text-ink-tertiary hidden md:table-cell" onClick={() => setExpanded(!expanded)}>
          {member.lastActive}
        </td>
        <td className="px-4 py-3.5 text-sm text-ink-primary hidden lg:table-cell" onClick={() => setExpanded(!expanded)}>
          {member.contracts}
        </td>
        <td className="px-4 py-3.5 hidden sm:table-cell" onClick={() => setExpanded(!expanded)}>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            member.status === "Active"
              ? "bg-accent-light text-accent-dark"
              : "bg-surface-muted text-ink-tertiary"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${member.status === "Active" ? "bg-accent" : "bg-ink-tertiary"}`} />
            {member.status}
          </span>
        </td>
        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1 justify-end relative">
            <div className="relative">
              <button
                onClick={() => { setShowEdit(!showEdit); setShowConfirmRemove(false); }}
                className="p-1.5 rounded-lg hover:bg-surface-soft transition-colors text-ink-tertiary hover:text-accent"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {showEdit && (
                  <EditRoleDropdown
                    member={member}
                    onClose={() => setShowEdit(false)}
                    onSave={(role) => onUpdateRole(member.id, role)}
                  />
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => { setShowConfirmRemove(!showConfirmRemove); setShowEdit(false); }}
              disabled={member.role === "Owner"}
              className="p-1.5 rounded-lg hover:bg-danger-light transition-colors text-ink-tertiary hover:text-danger disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showConfirmRemove && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-8 z-30 bg-white border border-danger/20 rounded-xl shadow-lg p-3 w-56"
                >
                  <p className="text-sm text-ink-primary mb-2">Remove <span className="font-medium">{member.name}</span> from team?</p>
                  <div className="flex gap-2">
                    <button onClick={() => setShowConfirmRemove(false)} className="flex-1 px-3 py-1.5 text-xs border border-border rounded-lg text-ink-secondary hover:bg-surface-soft">
                      Cancel
                    </button>
                    <button onClick={() => { onRemove(member.id); setShowConfirmRemove(false); }} className="flex-1 px-3 py-1.5 text-xs bg-danger hover:bg-danger-dark text-white rounded-lg">
                      Remove
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </td>
      </motion.tr>

      <AnimatePresence>
        {expanded && (
          <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-accent-light"
          >
            <td colSpan={7} className="px-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-ink-tertiary mb-1">Department</p>
                  <p className="text-sm font-medium text-ink-primary">Engineering</p>
                </div>
                <div>
                  <p className="text-xs text-ink-tertiary mb-1">Joined Team</p>
                  <p className="text-sm font-medium text-ink-primary">Jan 15, 2024</p>
                </div>
                <div>
                  <p className="text-xs text-ink-tertiary mb-1">Total Spend</p>
                  <p className="text-sm font-medium text-ink-primary">${(member.contracts * 1800).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-tertiary mb-1">Permissions</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(PERMISSIONS_MATRIX[member.role])
                      .filter(([, v]) => v)
                      .slice(0, 3)
                      .map(([k]) => (
                        <span key={k} className="text-xs bg-white border border-border rounded px-1.5 py-0.5 text-ink-secondary">
                          {PERMISSIONS.find(p => p.key === k)?.label}
                        </span>
                      ))}
                    {Object.values(PERMISSIONS_MATRIX[member.role]).filter(Boolean).length > 3 && (
                      <span className="text-xs text-ink-tertiary">+{Object.values(PERMISSIONS_MATRIX[member.role]).filter(Boolean).length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClientTeamManagementPage() {
  const [members, setMembers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [roleFilter, setRoleFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, dir: "asc" });
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [logCount, setLogCount] = useState(5);
  const [bulkAction, setBulkAction] = useState("");
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  const allFilterTabs = ["All", ...ROLES];

  const filtered = useMemo(() => {
    let list = members;
    if (roleFilter !== "All") list = list.filter(m => m.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
    }
    if (sortConfig.key) {
      list = [...list].sort((a, b) => {
        const av = a[sortConfig.key]?.toLowerCase?.() ?? a[sortConfig.key];
        const bv = b[sortConfig.key]?.toLowerCase?.() ?? b[sortConfig.key];
        if (av < bv) return sortConfig.dir === "asc" ? -1 : 1;
        if (av > bv) return sortConfig.dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return list;
  }, [members, roleFilter, search, sortConfig]);

  const toggleSort = (key) => {
    setSortConfig(s => s.key === key && s.dir === "asc" ? { key, dir: "desc" } : { key, dir: "asc" });
  };

  const toggleSelect = (id) => {
    setSelectedIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const toggleSelectAll = () => {
    const visibleIds = filtered.map(m => m.id);
    const allSelected = visibleIds.every(id => selectedIds.includes(id));
    setSelectedIds(allSelected ? selectedIds.filter(id => !visibleIds.includes(id)) : [...new Set([...selectedIds, ...visibleIds])]);
  };

  const updateRole = (id, role) => {
    setMembers(ms => ms.map(m => m.id === id ? { ...m, role } : m));
  };

  const removeMember = (id) => {
    setMembers(ms => ms.filter(m => m.id !== id));
    setSelectedIds(s => s.filter(x => x !== id));
  };

  const handleBulkAction = () => {
    if (bulkAction === "Remove") {
      setMembers(ms => ms.filter(m => !selectedIds.includes(m.id)));
    } else if (bulkAction === "Deactivate") {
      setMembers(ms => ms.map(m => selectedIds.includes(m.id) ? { ...m, status: "Inactive" } : m));
    }
    setSelectedIds([]);
    setBulkAction("");
    setShowBulkConfirm(false);
  };

  const allVisibleSelected = filtered.length > 0 && filtered.every(m => selectedIds.includes(m.id));

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const team = await getClientTeamMembers();
        setMembers(team?.items || team || []);
      } catch (err) {
        console.error('Failed to load team members', err);
      }
    };
    loadTeam();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };
  const buttonTap = { scale: 0.97 };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-900">Team Management</h1>
            <p className="text-ink-secondary text-sm mt-1">Manage your hiring team, roles and permissions</p>
          </div>
          <motion.button
            whileTap={buttonTap}
            onClick={() => setShowInvite(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map((card, i) => <StatCard key={card.label} card={card} index={i} />)}
        </div>

        {/* Search + Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-border rounded-2xl shadow-sm p-4 mb-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-4 h-10 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-ink-tertiary hover:text-ink-primary" />
                </button>
              )}
            </div>
          </div>

          {/* Role Tabs */}
          <div className="flex gap-1 flex-wrap">
            {allFilterTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setRoleFilter(tab)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  roleFilter === tab
                    ? "bg-accent text-white"
                    : "text-ink-secondary hover:bg-surface-soft"
                )}
              >
                {tab}
                <span className={`ml-1.5 text-xs ${roleFilter === tab ? "text-white/80" : "text-ink-tertiary"}`}>
                  {tab === "All" ? members.length : members.filter(m => m.role === tab).length}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bulk Action Bar */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-accent rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span className="text-white text-sm font-medium">{selectedIds.length} member{selectedIds.length > 1 ? "s" : ""} selected</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <select
                      value={bulkAction}
                      onChange={(e) => setBulkAction(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white/20 border border-white/30 text-white text-sm focus:outline-none appearance-none pr-7"
                    >
                      <option value="" className="text-ink-primary">Choose action</option>
                      <option value="Deactivate" className="text-ink-primary">Deactivate</option>
                      <option value="Remove" className="text-ink-primary">Remove</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none" />
                  </div>
                  <button
                    onClick={() => { if (bulkAction) setShowBulkConfirm(true); }}
                    disabled={!bulkAction}
                    className="px-3 py-1.5 bg-white text-accent rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-40"
                  >
                    Apply
                  </button>
                  <button onClick={() => setSelectedIds([])} className="px-3 py-1.5 text-white/80 hover:text-white text-sm transition-colors">
                    Clear
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Confirm Dialog */}
        <AnimatePresence>
          {showBulkConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white border border-border rounded-2xl shadow-xl p-6 max-w-sm w-full"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-danger-light rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-danger" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink-primary">Confirm {bulkAction}</h3>
                    <p className="text-sm text-ink-secondary mt-1">
                      Are you sure you want to {bulkAction.toLowerCase()} {selectedIds.length} member{selectedIds.length > 1 ? "s" : ""}?
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowBulkConfirm(false)} className="flex-1 px-4 py-2 border border-border rounded-lg text-ink-secondary text-sm hover:bg-surface-soft">
                    Cancel
                  </button>
                  <button onClick={handleBulkAction} className="flex-1 px-4 py-2 bg-danger hover:bg-danger-dark text-white rounded-lg text-sm font-medium">
                    {bulkAction}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Members Table (Desktop) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white border border-border rounded-2xl shadow-sm mb-6 overflow-hidden"
        >
          <div className="overflow-x-auto hidden sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-soft">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      className="rounded border-border text-accent focus:ring-accent"
                    />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => toggleSort("name")} className="flex items-center gap-1.5 text-xs font-semibold text-ink-tertiary uppercase tracking-wide hover:text-ink-primary">
                      Member <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => toggleSort("role")} className="flex items-center gap-1.5 text-xs font-semibold text-ink-tertiary uppercase tracking-wide hover:text-ink-primary">
                      Role <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-tertiary uppercase tracking-wide hidden md:table-cell">Last Active</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-tertiary uppercase tracking-wide hidden lg:table-cell">Contracts</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-tertiary uppercase tracking-wide hidden sm:table-cell">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-ink-tertiary uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-ink-tertiary">
                        <Users className="w-10 h-10 opacity-30" />
                        <p className="text-sm">No members match your search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((member, i) => (
                    <MemberRow
                      key={member.id}
                      member={member}
                      index={i}
                      selected={selectedIds.includes(member.id)}
                      onToggleSelect={toggleSelect}
                      onUpdateRole={updateRole}
                      onRemove={removeMember}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="w-10 h-10 text-ink-tertiary mx-auto mb-2" />
                <p className="text-sm text-ink-tertiary">No members found</p>
              </div>
            ) : (
              filtered.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(member.id)}
                      onChange={() => toggleSelect(member.id)}
                      className="mt-1 rounded border-border text-accent"
                    />
                    <div className={`w-10 h-10 rounded-full ${member.avatarBg} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-ink-primary">{member.name}</p>
                          <p className="text-xs text-ink-tertiary truncate">{member.email}</p>
                        </div>
                        <RoleBadge role={member.role} />
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          member.status === "Active"
                            ? "bg-accent-light text-accent-dark"
                            : "bg-surface-muted text-ink-tertiary"
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${member.status === "Active" ? "bg-accent" : "bg-ink-tertiary"}`} />
                          {member.status}
                        </span>
                        <span className="text-xs text-ink-tertiary">{member.lastActive}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Permissions Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-border rounded-2xl shadow-sm mb-6 overflow-hidden"
        >
          <button
            onClick={() => setPermissionsOpen(!permissionsOpen)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface-soft transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent-light rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-accent" />
              </div>
              <div className="text-left">
                <h2 className="font-display text-base font-semibold text-brand-900">Permissions Matrix</h2>
                <p className="text-xs text-ink-tertiary">View role-based access control</p>
              </div>
            </div>
            <motion.div animate={{ rotate: permissionsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-5 h-5 text-ink-tertiary" />
            </motion.div>
          </button>

          <AnimatePresence>
            {permissionsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="overflow-x-auto border-t border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-surface-soft">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-ink-tertiary uppercase tracking-wide min-w-40">Permission</th>
                        {ROLES.map(role => (
                          <th key={role} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide min-w-28">
                            <span className={`px-2 py-0.5 rounded-full ${ROLE_COLORS[role]}`}>{role}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {PERMISSIONS.map((perm, i) => (
                        <tr key={perm.key} className={`border-t border-border ${i % 2 === 0 ? "" : "bg-surface-soft"}`}>
                          <td className="px-4 py-3 text-ink-primary font-medium text-sm">{perm.label}</td>
                          {ROLES.map(role => (
                            <td key={role} className="px-3 py-3 text-center">
                              {PERMISSIONS_MATRIX[role][perm.key] ? (
                                <div className="flex justify-center">
                                  <div className="w-6 h-6 bg-accent-light rounded-full flex items-center justify-center">
                                    <Check className="w-3.5 h-3.5 text-accent-dark" />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-ink-tertiary text-base">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white border border-border rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent-light rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-base font-semibold text-brand-900">Activity Log</h2>
                <p className="text-xs text-ink-tertiary">Recent team actions</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <AnimatePresence>
              {ACTIVITY_LOG.slice(0, logCount).map((log, i) => {
                const Icon = log.icon;
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-soft transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className={`w-4 h-4 ${log.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink-primary">{log.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-medium text-ink-tertiary">{log.member}</span>
                        <span className="text-ink-tertiary/40">·</span>
                        <span className="text-xs text-ink-tertiary">{log.time}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {logCount < ACTIVITY_LOG.length && (
            <button
              onClick={() => setLogCount(ACTIVITY_LOG.length)}
              className="mt-3 w-full text-center text-sm text-accent hover:text-accent-dark font-medium py-2 hover:bg-accent-light rounded-xl transition-colors"
            >
              Load more ({ACTIVITY_LOG.length - logCount} remaining) →
            </button>
          )}
        </motion.div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
      </AnimatePresence>
    </div>
  );
}
