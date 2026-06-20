import {
  LayoutDashboard,
  Search,
  Heart,
  PlusCircle,
  Briefcase,
  FileText,
  MessageSquare,
  Video,
  CreditCard,
  Settings,
  HelpCircle,
  Users,
  FileSignature,
  Building,
  Lock,
} from 'lucide-react';
import { normalizeClientType } from '../../platform/common/constants/accountTypes';

const businessAccountTypes = ['SME', 'CORPORATE'];

export const getClientAccountType = (user) => normalizeClientType(
  user?.accountType
  || user?.clientType
  || user?.clientProfile?.accountType
  || user?.clientProfile?.clientType,
);

export const isBusinessClient = (user) => businessAccountTypes.includes(getClientAccountType(user));

export const formatClientAccountType = (accountType) => {
  const normalized = normalizeClientType(accountType);

  if (normalized === 'SME') return 'SME Client';
  if (normalized === 'CORPORATE') return 'Corporate Client';

  return 'Individual Client';
};

const activePath = (path, pathname) => String(path).split('?')[0] === pathname;

export const isNavItemActive = (item, pathname) => {
  if (Array.isArray(item.path)) {
    return item.path.some((path) => activePath(path, pathname));
  }

  return activePath(item.path, pathname);
};

export const CLIENT_NAVIGATION = {
  individual: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/client/dashboard' },
    {
      id: 'find_talent',
      label: 'Find Talent',
      icon: Search,
      href: '/client/talent-search',
      children: [
        { id: 'search_freelancers', label: 'Search Freelancers', icon: Search, path: '/client/talent-search' },
        { id: 'saved_freelancers', label: 'Saved Talent', icon: Heart, path: '/client/shortlist' },
      ],
    },
    {
      id: 'projects',
      label: 'My Jobs',
      icon: Briefcase,
      href: '/client-services/my-jobs',
      children: [
        { id: 'post_project', label: 'Post a Job', icon: PlusCircle, path: '/client/post-job' },
        { id: 'active_projects', label: 'Manage Jobs', icon: Briefcase, path: '/client-services/my-jobs' },
      ],
    },
    {
      id: 'proposals',
      label: 'Proposals',
      icon: FileText,
      path: '/client/proposals',
    },
    {
      id: 'contracts_work',
      label: 'Contracts',
      icon: FileSignature,
      path: '/client/contracts',
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      href: '/client/messages',
      children: [
        { id: 'inbox', label: 'Messages', icon: MessageSquare, path: '/client/messages' },
        { id: 'interviews', label: 'Interviews', icon: Video, path: '/client/interviews' },
      ],
    },
    {
      id: 'payments_billing',
      label: 'Payments',
      icon: CreditCard,
      path: '/client/wallet',
    },
    {
      id: 'support',
      label: 'Support',
      icon: HelpCircle,
      path: '/client/support',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/client/profile',
      children: [
        { id: 'profile_settings', label: 'Profile Settings', icon: Settings, path: '/client/profile' },
        { id: 'setup_profile', label: 'Setup Wizard', icon: Settings, path: '/client/setup' },
        { id: 'security', label: 'Security', icon: Lock, path: '/client/security-center' },
      ],
    },
  ],
  business: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/client/dashboard' },
    {
      id: 'find_talent',
      label: 'Find Talent',
      icon: Search,
      href: '/client/talent-search',
      children: [
        { id: 'search_freelancers', label: 'Search Freelancers', icon: Search, path: '/client/talent-search' },
        { id: 'saved_freelancers', label: 'Saved Talent', icon: Heart, path: '/client/shortlist' },
      ],
    },
    {
      id: 'projects',
      label: 'My Jobs',
      icon: Briefcase,
      href: '/client-services/my-jobs',
      children: [
        { id: 'post_project', label: 'Post a Job', icon: PlusCircle, path: '/client/post-job' },
        { id: 'active_projects', label: 'Manage Jobs', icon: Briefcase, path: '/client-services/my-jobs' },
      ],
    },
    {
      id: 'proposals',
      label: 'Proposals',
      icon: FileText,
      path: '/client/proposals',
    },
    {
      id: 'contracts_work',
      label: 'Contracts',
      icon: FileSignature,
      path: '/client/contracts',
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      href: '/client/messages',
      children: [
        { id: 'inbox', label: 'Messages', icon: MessageSquare, path: '/client/messages' },
        { id: 'interviews', label: 'Interviews', icon: Video, path: '/client/interviews' },
      ],
    },
    {
      id: 'payments_billing',
      label: 'Payments',
      icon: CreditCard,
      path: '/client/wallet',
    },
    {
      id: 'team_management',
      label: 'Team Management',
      icon: Users,
      path: '/client/team',
    },
    {
      id: 'support',
      label: 'Support',
      icon: HelpCircle,
      path: '/client/support',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/client/profile',
      children: [
        { id: 'profile_settings', label: 'Profile Settings', icon: Settings, path: '/client/profile' },
        { id: 'security', label: 'Security', icon: Lock, path: '/client/security-center' },
      ],
    },
  ],
};
