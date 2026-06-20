// ClientPermissionsPage.jsx
// Self-contained Access Control & Team Permissions page with design tokens,
// framer-motion animations, and local toast notifications.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  ShieldCheck,
  Plus,
  UserPlus,
  Key,
  Check,
  Info,
  X,
  Lock,
  Eye,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

// Helper for conditional classes
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function ClientPermissionsPage() {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alex Morgan', role: 'Chief Financial Officer', dept: 'Finance', status: 'Active' },
    { id: 2, name: 'Sarah Jenkins', role: 'Operations Lead', dept: 'Operations', status: 'Active' },
    { id: 3, name: 'Kiprotich Arap', role: 'Field Coordinator', dept: 'Onsite Delivery', status: 'Active' },
  ]);

  const [permissionsMatrix, setPermissionsMatrix] = useState([
    { key: 'escrow_release', name: 'Authorize Escrow Releases', exec: true, manager: false, procurement: false, surveyor: false },
    { key: 'deploy_field', name: 'Deploy Field Coordinates', exec: true, manager: true, procurement: false, surveyor: false },
    { key: 'view_tax', name: 'Access Tax Records', exec: true, manager: false, procurement: true, surveyor: false },
    { key: 'edit_chains', name: 'Modify Approval Chains', exec: true, manager: false, procurement: false, surveyor: false },
  ]);

  const [toast, setToast] = useState(null);

  const showToast = (type, message, duration = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  };

  const togglePermission = (permKey, roleField) => {
    setPermissionsMatrix((prev) =>
      prev.map((p) =>
        p.key === permKey ? { ...p, [roleField]: !p[roleField] } : p
      )
    );
    showToast('success', 'Access privilege updated successfully.');
  };

  const handleAddCustomRole = () => {
    showToast('info', 'New custom role configured.');
  };

  const handleInvite = (e) => {
    e.preventDefault();
    showToast('success', 'Invitation email dispatched to candidate admin.');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };
  const tableRowVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };
  const buttonTap = { scale: 0.97 };
  const cardHover = {
    rest: { y: 0, boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    hover: {
      y: -3,
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6 mb-8">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-900 tracking-tight">
              Access Control & Team Permissions
            </h1>
            <p className="text-ink-secondary text-sm mt-1">
              Manage corporate team roles, define granular RBAC security privilege matrices, and invite department managers.
            </p>
          </div>
          <motion.button
            whileTap={buttonTap}
            onClick={handleAddCustomRole}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors shadow-sm"
          >
            <Plus size={16} /> Add Custom Role
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Team Members */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              whileHover={cardHover.hover}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm"
            >
              <h3 className="flex items-center gap-1.5 font-display font-bold text-brand-900 text-sm uppercase tracking-wide mb-4">
                <Users size={16} className="text-accent" /> Active Administrators
              </h3>
              <div className="space-y-3">
                {teamMembers.map((member, idx) => (
                  <motion.div
                    key={member.id}
                    variants={itemVariants}
                    className="p-3 bg-surface-soft border border-border rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-ink-primary">{member.name}</h4>
                      <p className="text-[10px] text-ink-tertiary mt-0.5">
                        {member.role} • {member.dept}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-accent-light text-accent-dark">
                      {member.status}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Invite form */}
              <div className="mt-5 pt-4 border-t border-border">
                <h4 className="text-xs font-semibold text-ink-primary mb-3">Invite New Admin</h4>
                <form onSubmit={handleInvite} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="colleague@company.com"
                    className="flex-1 h-10 border border-border rounded-lg px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                    required
                  />
                  <motion.button
                    whileTap={buttonTap}
                    type="submit"
                    className="px-4 py-2 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors"
                  >
                    <UserPlus size={16} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Permissions Matrix Table */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-border">
                <h3 className="flex items-center gap-2 font-display font-bold text-brand-900 text-sm uppercase tracking-wide">
                  <Lock size={16} className="text-accent" /> RBAC Permissions Matrix
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-soft text-ink-tertiary">
                    <tr className="border-b border-border">
                      <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide">
                        Security Privilege Node
                      </th>
                      <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wide">
                        CFO / Executive
                      </th>
                      <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wide">
                        SME Manager
                      </th>
                      <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wide">
                        Procurement Officer
                      </th>
                      <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wide">
                        Field Operator
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {permissionsMatrix.map((perm, idx) => (
                      <motion.tr
                        key={perm.key}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-surface-soft transition-colors"
                      >
                        <td className="px-5 py-4 font-medium text-ink-primary">{perm.name}</td>
                        <td className="px-5 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={perm.exec}
                            onChange={() => togglePermission(perm.key, 'exec')}
                            className="w-4 h-4 rounded border-border text-accent focus:ring-accent focus:ring-offset-0"
                          />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={perm.manager}
                            onChange={() => togglePermission(perm.key, 'manager')}
                            className="w-4 h-4 rounded border-border text-accent focus:ring-accent focus:ring-offset-0"
                          />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={perm.procurement}
                            onChange={() => togglePermission(perm.key, 'procurement')}
                            className="w-4 h-4 rounded border-border text-accent focus:ring-accent focus:ring-offset-0"
                          />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={perm.surveyor}
                            onChange={() => togglePermission(perm.key, 'surveyor')}
                            className="w-4 h-4 rounded border-border text-accent focus:ring-accent focus:ring-offset-0"
                          />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-info-light border border-info/20 rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-info shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-info-dark text-sm">Role-Based Access Control</h4>
                  <p className="text-sm text-ink-secondary mt-1">
                    Permissions are enforced in real‑time. Changes take effect immediately across all sessions.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
            style={{
              backgroundColor:
                toast.type === 'success'
                  ? 'rgb(220, 252, 231)'
                  : toast.type === 'error'
                  ? 'rgb(254, 226, 226)'
                  : 'rgb(219, 234, 254)',
              color:
                toast.type === 'success'
                  ? 'rgb(21, 128, 61)'
                  : toast.type === 'error'
                  ? 'rgb(185, 28, 28)'
                  : 'rgb(29, 78, 216)',
            }}
          >
            {toast.type === 'success' && <CheckCircle size={16} />}
            {toast.type === 'error' && <AlertCircle size={16} />}
            {toast.type === 'info' && <ShieldCheck size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
