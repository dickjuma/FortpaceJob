import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ShieldCheck, Save, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { useCreateAgencyRole, useAgencyRoles, useUpdateAgencyRole } from '../services/agencyHooks';

const PERMISSION_GROUPS = [
  { name: 'Contracts', permissions: ['View contracts', 'Create contracts', 'Approve contracts', 'Reject contracts'] },
  { name: 'Projects', permissions: ['View projects', 'Create projects', 'Assign members', 'Close projects'] },
  { name: 'Team Members', permissions: ['Invite members', 'Suspend members', 'Change roles', 'View profiles'] },
  { name: 'Billing', permissions: ['View invoices', 'Pay invoices', 'Manage payout methods', 'View revenue'] },
  { name: 'Analytics', permissions: ['View dashboards', 'Export reports', 'View utilization', 'View satisfaction'] },
  { name: 'Settings', permissions: ['Manage org settings', 'Manage SSO', 'Manage webhooks', 'Manage API keys'] },
];

export default function CreateRolePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data: roles = [] } = useAgencyRoles();
  const createRole = useCreateAgencyRole();
  const updateRole = useUpdateAgencyRole();
  const existing = roles.find((role) => String(role.id) === String(id));
  const [form, setForm] = useState({
    name: existing?.name || '',
    description: existing?.description || '',
    permissions: existing?.permissions || {},
  });

  const togglePermission = (group, permission) => {
    setForm((current) => {
      const groupPermissions = Array.isArray(current.permissions[group]) ? current.permissions[group] : [];
      const nextPermissions = groupPermissions.includes(permission)
        ? groupPermissions.filter((item) => item !== permission)
        : [...groupPermissions, permission];
      return { ...current, permissions: { ...current.permissions, [group]: nextPermissions } };
    });
  };

  const submit = () => {
    if (!form.name.trim()) return;
    const payload = { name: form.name.trim(), description: form.description.trim(), permissions: form.permissions };
    if (isEdit) {
      updateRole.mutate({ roleId: id, payload }, { onSuccess: () => navigate('/agency/roles') });
    } else {
      createRole.mutate(payload, { onSuccess: () => navigate('/agency/roles') });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <button onClick={() => navigate('/agency/roles')} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-ink-secondary hover:text-brand-900">
        <ArrowLeft className="w-4 h-4" /> Back to roles
      </button>
      <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-[#4C1D95]/10 rounded-xl"><ShieldCheck className="w-6 h-6 text-[#4C1D95]" /></div>
              <h1 className="font-display font-bold text-3xl text-brand-900">{isEdit ? 'Edit role' : 'Create role'}</h1>
            </div>
            <p className="text-sm text-ink-secondary">Define a role name, description, and permission matrix.</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block text-sm">
              <span className="font-bold text-ink-primary">Role name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-xl border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-900" placeholder="Operations Manager" />
            </label>
            <label className="block text-sm">
              <span className="font-bold text-ink-primary">Description</span>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2 w-full rounded-xl border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-900" placeholder="Can manage day-to-day delivery operations" />
            </label>
          </div>

          {PERMISSION_GROUPS.map((group) => (
            <div key={group.name} className="rounded-2xl border border-border bg-surface-soft p-5">
              <h3 className="font-display font-bold text-lg text-brand-900 mb-4">{group.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.permissions.map((permission) => {
                  const enabled = Boolean(form.permissions[group.name]?.includes(permission));
                  return (
                    <label key={permission} className="flex items-center gap-3 rounded-xl border border-border bg-white p-3 cursor-pointer hover:border-[#4C1D95]">
                      <input type="checkbox" checked={enabled} onChange={() => togglePermission(group.name, permission)} className="h-4 w-4 accent-[#4C1D95]" />
                      <span className="text-sm font-medium text-ink-primary">{permission}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 border-t border-border flex justify-end gap-3">
          <button onClick={() => navigate('/agency/roles')} className="rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-ink-primary">Cancel</button>
          <button disabled={createRole.isPending || updateRole.isPending} onClick={submit} className="rounded-xl bg-[#4C1D95] px-5 py-2.5 text-sm font-bold text-white inline-flex items-center gap-2 disabled:opacity-50">
            {(createRole.isPending || updateRole.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Save role' : 'Create role'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
