import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { User, Award, Briefcase, TrendingUp, DollarSign, ShieldAlert, ShieldCheck, Mail, Calendar, Loader2 } from 'lucide-react';
import { useSuspendAgencyMember, useReactivateAgencyMember, useRemoveAgencyMember } from '../services/agencyHooks';

const METRICS = [
  { label: 'Active contracts', value: 4, icon: Briefcase, color: 'text-blue-700', bg: 'bg-blue-50' },
  { label: 'Revenue generated', value: '$86.4K', icon: DollarSign, color: 'text-emerald-700', bg: 'bg-emerald-50' },
  { label: 'Utilization', value: '91%', icon: TrendingUp, color: 'text-violet-700', bg: 'bg-violet-50' },
  { label: 'Client satisfaction', value: '4.9/5', icon: Award, color: 'text-amber-700', bg: 'bg-amber-50' },
];

export default function TeamMemberDetailsPage() {
  const { id } = useParams();
  const [active, setActive] = useState(true);
  const suspend = useSuspendAgencyMember();
  const reactivate = useReactivateAgencyMember();
  const remove = useRemoveAgencyMember();

  const member = {
    id: id || 'member-1',
    name: 'Amina Ochieng',
    role: 'Senior Full-Stack Engineer',
    email: 'amina@acmeagency.com',
    joinedAt: 'Mar 12, 2024',
    status: active ? 'Active' : 'Suspended',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'System Design'],
    certifications: ['AWS Solutions Architect', 'Scrum Master'],
  };

  const toggleAccess = () => {
    if (active) {
      suspend.mutate({ memberId: member.id, payload: { reason: 'Administrative suspension' } }, { onSuccess: () => setActive(false) });
    } else {
      reactivate.mutate(member.id, { onSuccess: () => setActive(true) });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="rounded-[28px] bg-[#222222] text-white p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-success/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl">{member.name.split(' ').map((n) => n[0]).join('')}</div>
            <div>
              <h1 className="font-display text-3xl font-black">{member.name}</h1>
              <p className="text-white/70 text-sm mt-1">{member.role} · {member.status}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button disabled={suspend.isPending || reactivate.isPending} onClick={toggleAccess} className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#222222] disabled:opacity-50">
              {(suspend.isPending || reactivate.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4 inline mr-2" />}{active ? 'Suspend access' : 'Reactivate access'}
            </button>
            <button disabled={remove.isPending} onClick={() => remove.mutate(member.id)} className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10 disabled:opacity-50">
              Remove from team
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {METRICS.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${metric.bg} ${metric.color} flex items-center justify-center mb-4`}><metric.icon className="w-5 h-5" /></div>
            <p className="text-xs font-bold text-ink-secondary uppercase tracking-wide">{metric.label}</p>
            <p className="font-display text-2xl font-bold text-brand-900 mt-2">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="font-display font-bold text-xl text-brand-900 mb-4">Profile information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-surface-soft p-4"><p className="text-ink-secondary">Email</p><p className="font-bold text-ink-primary mt-1 flex items-center gap-2"><Mail className="w-4 h-4" /> {member.email}</p></div>
              <div className="rounded-xl bg-surface-soft p-4"><p className="text-ink-secondary">Join date</p><p className="font-bold text-ink-primary mt-1 flex items-center gap-2"><Calendar className="w-4 h-4" /> {member.joinedAt}</p></div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="font-display font-bold text-xl text-brand-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill) => <span key={skill} className="rounded-full bg-accent-light text-accent-dark px-3 py-1.5 text-xs font-bold">{skill}</span>)}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="font-display font-bold text-xl text-brand-900 mb-4">Certifications</h3>
            <div className="space-y-3">
              {member.certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-3 rounded-xl border border-border p-4">
                  <Award className="w-5 h-5 text-[#4C1D95]" />
                  <span className="font-bold text-ink-primary">{cert}</span>
                  <span className="ml-auto rounded-full bg-success/10 text-success px-2.5 py-1 text-xs font-bold">Verified</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="font-display font-bold text-xl text-brand-900 mb-4">Role</h3>
            <select className="w-full rounded-xl border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900">
              <option>Senior Full-Stack Engineer</option>
              <option>Project Manager</option>
              <option>Designer</option>
              <option>QA Engineer</option>
            </select>
            <button className="mt-4 w-full rounded-xl bg-[#4C1D95] py-2.5 text-sm font-bold text-white inline-flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4" /> Change role</button>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h3 className="font-display font-bold text-xl text-brand-900 mb-4">Performance metrics</h3>
            <div className="space-y-4">
              <div><div className="flex justify-between text-xs text-ink-secondary mb-1"><span>On-time delivery</span><span>96%</span></div><div className="h-2 rounded-full bg-surface-muted"><div className="h-2 rounded-full bg-success" style={{ width: '96%' }} /></div></div>
              <div><div className="flex justify-between text-xs text-ink-secondary mb-1"><span>Client response</span><span>92%</span></div><div className="h-2 rounded-full bg-surface-muted"><div className="h-2 rounded-full bg-[#4C1D95]" style={{ width: '92%' }} /></div></div>
              <div><div className="flex justify-between text-xs text-ink-secondary mb-1"><span>Budget accuracy</span><span>88%</span></div><div className="h-2 rounded-full bg-surface-muted"><div className="h-2 rounded-full bg-amber-500" style={{ width: '88%' }} /></div></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
