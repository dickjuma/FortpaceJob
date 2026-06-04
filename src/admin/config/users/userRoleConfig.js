import { Shield, ShieldAlert, ShieldCheck, Settings, Users, Briefcase, DollarSign, MessageSquare, Scale, Clock, Ban } from 'lucide-react';

export const ADMIN_ROLES = {
  admin: {
    id: 'admin',
    label: 'Standard Admin',
    level: 1,
    icon: Shield,
    description: 'Basic management access for daily operations.'
  },
  moderator: {
    id: 'moderator',
    label: 'Content Moderator',
    level: 2,
    icon: MessageSquare,
    description: 'Focused on job, gig, and chat oversight.'
  },
  finance: {
    id: 'finance',
    label: 'Finance Manager',
    level: 3,
    icon: DollarSign,
    description: 'Access to payments, escrow, and withdrawals.'
  },
  super_admin: {
    id: 'super_admin',
    label: 'Super Administrator',
    level: 5,
    icon: ShieldAlert,
    description: 'Unrestricted access to all system modules.'
  }
};

export const MODULE_PERMISSIONS = [
  { id: 'users_read', label: 'View Users', module: 'Users' },
  { id: 'users_write', label: 'Edit Users', module: 'Users' },
  { id: 'users_delete', label: 'Ban/Delete Users', module: 'Users' },
  { id: 'marketplace_read', label: 'View Marketplace', module: 'Marketplace' },
  { id: 'marketplace_write', label: 'Moderate Content', module: 'Marketplace' },
  { id: 'finance_read', label: 'View Transactions', module: 'Finance' },
  { id: 'finance_write', label: 'Manage Escrow', module: 'Finance' },
  { id: 'disputes_read', label: 'View Disputes', module: 'Disputes' },
  { id: 'disputes_write', label: 'Resolve Disputes', module: 'Disputes' },
  { id: 'settings_read', label: 'View Settings', module: 'Settings' },
  { id: 'settings_write', label: 'Change Config', module: 'Settings' },
];

export const USER_STATUS_CONFIG = {
  active: { label: 'Active', color: 'text-success', bg: 'bg-success/10' },
  suspended: { label: 'Suspended', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  pending: { label: 'Pending', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  flagged: { label: 'Flagged', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  banned: { label: 'Banned', color: 'text-red-600', bg: 'bg-red-600/10' },
};

export const KYC_STATUSES = {
  not_submitted: { label: 'Unverified', color: 'text-zinc-400', bg: 'bg-zinc-100 dark:bg-zinc-800' },
  pending: { label: 'In Review', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  verified: { label: 'Verified', color: 'text-success', bg: 'bg-success/10' },
  rejected: { label: 'Rejected', color: 'text-rose-500', bg: 'bg-rose-500/10' },
};

export const USER_ROLE_CONFIG = {
  freelancer: { label: 'Freelancer', color: 'text-success', bg: 'bg-success/10' },
  client: { label: 'Client', color: 'text-[#2bb75c]', bg: 'bg-[#2bb75c]/10' },
  admin: { label: 'Admin', color: 'text-[#2bb75c]', bg: 'bg-[#2bb75c]/10' },
};

export const USER_STATUSES = {
  active:    { label: 'Active',    color: 'text-emerald-700', bg: 'bg-emerald-50',  dot: 'bg-success' },
  suspended: { label: 'Suspended', color: 'text-rose-700',    bg: 'bg-rose-50',     dot: 'bg-rose-500' },
  pending:   { label: 'Pending',   color: 'text-amber-700',   bg: 'bg-amber-50',    dot: 'bg-amber-500' },
  flagged:   { label: 'Flagged',   color: 'text-orange-700',  bg: 'bg-orange-50',   dot: 'bg-orange-500' },
  inactive:  { label: 'Inactive',  color: 'text-zinc-500',   bg: 'bg-zinc-100',   dot: 'bg-zinc-400' },
  banned:    { label: 'Banned',    color: 'text-red-700',     bg: 'bg-red-50',      dot: 'bg-red-600' },
};

export const USER_GROUPS = {
  freelancer: { label: 'Freelancer' },
  client:     { label: 'Client' },
  admin:      { label: 'Admin' },
};

