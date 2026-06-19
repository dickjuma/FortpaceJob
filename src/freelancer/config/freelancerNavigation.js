import {
  LayoutDashboard,
  UserCircle,
  Briefcase,
  BadgeCheck,
  ShieldCheck,
  CalendarCheck,
  Search,
  Heart,
  Calendar,
  Send,
  FileText,
  Layers,
  Plus,
  FolderKanban,
  BarChart2,
  Upload,
  MessageSquare,
  Bell,
  DollarSign,
  Wallet,
  Receipt,
  ArrowUpRight,
  Star,
  Users,
  Building,
  AlertCircle,
  Ticket,
  Settings,
  Lock,
  Link,
  Key,
  Sliders,
  MapPin,
} from 'lucide-react';
import { normalizeClientType } from '../../platform/common/constants/accountTypes';

const agencyAccountTypes = ['AGENCY'];

export const isFreelancerBusinessAccountType = (accountType) =>
  agencyAccountTypes.includes(normalizeClientType(accountType));

const commonIndividualSections = [
  {
    key: 'dashboard_section',
    title: 'Dashboard',
    icon: LayoutDashboard,
    links: [
      { name: 'Dashboard', path: '/freelancer/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    key: 'profile',
    title: 'Profile',
    icon: UserCircle,
    links: [
      { name: 'My Profile', path: '/freelancer/profile', icon: UserCircle },
      { name: 'Portfolio', path: '/freelancer/portfolio', icon: Briefcase },
      { name: 'Skills & Certifications', path: '/freelancer/certifications', icon: BadgeCheck },
      { name: 'Verification', path: '/freelancer/verification-center', icon: ShieldCheck },
      { name: 'Availability', path: '/freelancer/availability', icon: CalendarCheck },
    ],
  },
  {
    key: 'jobs',
    title: 'Jobs',
    icon: Search,
    links: [
      { name: 'Browse Jobs', path: '/freelancer/jobs', icon: Search },
      { name: 'Saved Jobs', path: '/freelancer/saved-jobs', icon: Heart },
      { name: 'Job Invitations', path: '/freelancer/booking-requests', icon: Calendar },
      { name: 'Applied Jobs', path: '/freelancer/my-jobs', icon: Send },
      { name: 'Proposal Drafts', path: '/freelancer/proposals?draft=true', icon: FileText },
    ],
  },
  {
    key: 'gigs',
    title: 'Gigs',
    icon: Layers,
    links: [
      { name: 'My Gigs', path: '/freelancer/gigs', icon: Layers },
      { name: 'Create Gig', path: '/freelancer/gigs/create', icon: Plus },
      { name: 'Gig Orders', path: '/freelancer/orders', icon: FolderKanban },
      { name: 'Gig Analytics', path: '/freelancer/gig-analytics', icon: BarChart2 },
    ],
  },
  {
    key: 'contracts',
    title: 'Contracts',
    icon: FileText,
    links: [
      { name: 'Contracts', path: '/freelancer/contracts', icon: FileText },
      { name: 'Milestones', path: '/freelancer/contracts?tab=milestones', icon: CalendarCheck },
      { name: 'Deliverables', path: '/freelancer/deliverables', icon: Upload },
    ],
  },
  {
    key: 'communication',
    title: 'Communication',
    icon: MessageSquare,
    links: [
      { name: 'Messages', path: '/freelancer/messages', icon: MessageSquare },
      { name: 'Notifications', path: '/freelancer/notifications', icon: Bell },
    ],
  },
  {
    key: 'finance',
    title: 'Finance',
    icon: Wallet,
    links: [
      { name: 'Earnings', path: '/freelancer/earnings', icon: DollarSign },
      { name: 'Wallet', path: '/freelancer/wallet', icon: Wallet },
      { name: 'Transactions', path: '/freelancer/wallet?tab=transactions', icon: Receipt },
      { name: 'Withdrawals', path: '/freelancer/withdrawal', icon: ArrowUpRight },
      { name: 'Invoices', path: '/freelancer/invoices', icon: FileText },
    ],
  },
  {
    key: 'reputation',
    title: 'Reputation',
    icon: Star,
    links: [
      { name: 'Reviews', path: '/freelancer/reviews', icon: Star },
      { name: 'Performance Analytics', path: '/freelancer/analytics', icon: BarChart2 },
    ],
  },
  {
    key: 'support',
    title: 'Support',
    icon: AlertCircle,
    links: [
      { name: 'Disputes', path: '/freelancer/disputes', icon: AlertCircle },
      { name: 'Support Tickets', path: '/freelancer/tickets', icon: Ticket },
    ],
  },
  {
    key: 'settings',
    title: 'Settings',
    icon: Settings,
    links: [
      { name: 'Account Settings', path: '/freelancer/personal-details', icon: Settings },
      { name: 'Security', path: '/freelancer/privacy-security', icon: Lock },
      { name: 'Connected Accounts', path: '/freelancer/connected-accounts', icon: Link },
      { name: 'API Keys', path: '/freelancer/api-keys', icon: Key },
      { name: 'Preferences', path: '/freelancer/preferences', icon: Sliders },
    ],
  },
];

const agencySections = [
  {
    key: 'business',
    title: 'Business (Agency Only)',
    icon: Building,
    links: [
      { name: 'Agency Dashboard', path: '/freelancer/agency-dashboard', icon: LayoutDashboard },
      { name: 'Team Management', path: '/freelancer/team', icon: Users },
      { name: 'Roles & Permissions', path: '/freelancer/roles', icon: ShieldCheck },
      { name: 'Workspace', path: '/freelancer/workspace', icon: Building },
      { name: 'Agency Portfolio', path: '/freelancer/agency-portfolio', icon: Briefcase },
      { name: 'Talent Pool', path: '/freelancer/talent-pool', icon: Users },
      { name: 'Recruitment', path: '/freelancer/recruitment', icon: Search },
      { name: 'Enterprise Contracts', path: '/freelancer/enterprise-contracts', icon: FileText },
      { name: 'Team Analytics', path: '/freelancer/team-analytics', icon: BarChart2 },
      { name: 'Billing', path: '/freelancer/billing', icon: DollarSign },
    ],
  },
];

export const getFreelancerNavSections = (accountType, isOfflineProvider) => {
  const normalized = normalizeClientType(accountType);
  
  const sections = [...commonIndividualSections];
  
  if (normalized === 'AGENCY' || isFreelancerBusinessAccountType(accountType)) {
    // Insert business section before support (index 8)
    sections.splice(8, 0, ...agencySections);
  }

  if (isOfflineProvider) {
    sections.push({
      key: 'offline',
      title: 'LOCAL & OFFLINE',
      icon: MapPin,
      links: [{ name: 'Nearby Jobs', path: '/freelancer/nearby-jobs', icon: MapPin }],
    });
  }

  return sections;
};
