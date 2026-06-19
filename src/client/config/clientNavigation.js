import {
  LayoutDashboard,
  Search,
  FolderSearch,
  Heart,
  Star,
  PlusCircle,
  Briefcase,
  FileText,
  MessageSquare,
  Video,
  CreditCard,
  Landmark,
  Receipt,
  ArrowLeftRight,
  Scale,
  Users,
  ShieldCheck,
  Building,
  History,
  BarChart3,
  BellRing,
  Settings,
  HelpCircle,
  Sparkles,
  Library,
  KanbanSquare,
  FileSignature,
  Award,
  CalendarCheck,
  LayoutGrid,
  ShieldAlert,
  Gift,
  Handshake,
  Archive,
  Copy,
  ListChecks,
  ClipboardCheck,
  KeyRound,
  Lock,
  Building2,
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
        { id: 'categories', label: 'Browse Categories', icon: FolderSearch, path: '/client/talent-search?view=categories' },
        { id: 'saved_freelancers', label: 'Saved Freelancers', icon: Heart, path: '/client/shortlist' },
        { id: 'recommended_freelancers', label: 'Recommended Freelancers', icon: Star, path: '/client/talent-search?view=recommended' },
      ],
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: PlusCircle,
      href: '/client/post-job',
      children: [
        { id: 'post_project', label: 'Post a Project', icon: PlusCircle, path: '/client/post-job' },
        { id: 'active_projects', label: 'Active Projects', icon: Briefcase, path: '/client-services/my-jobs?status=active' },
        { id: 'draft_projects', label: 'Draft Projects', icon: Copy, path: '/client-services/my-jobs?status=draft' },
        { id: 'archived_projects', label: 'Archived Projects', icon: Archive, path: '/client-services/my-jobs?status=archived' },
        { id: 'project_templates', label: 'Project Templates', icon: Copy, path: '/client/post-job?template=true' },
      ],
    },
    {
      id: 'proposals',
      label: 'Proposals',
      icon: FileText,
      href: '/client/proposals',
      children: [
        { id: 'new_proposals', label: 'New Proposals', icon: FileText, path: '/client/proposals?status=new' },
        { id: 'shortlisted_freelancers', label: 'Shortlisted Freelancers', icon: Star, path: '/client/shortlist' },
        { id: 'interviewing', label: 'Interviewing', icon: Video, path: '/client/interviews' },
        { id: 'hired_freelancers', label: 'Hired Freelancers', icon: Users, path: '/client/contracts' },
        { id: 'rejected_proposals', label: 'Rejected Proposals', icon: FileText, path: '/client/proposals?status=rejected' },
      ],
    },
    {
      id: 'contracts_work',
      label: 'Contracts & Work',
      icon: FileSignature,
      href: '/client/contracts',
      children: [
        { id: 'active_contracts', label: 'Active Contracts', icon: FileSignature, path: '/client/contracts?status=active' },
        { id: 'milestones', label: 'Milestones', icon: ListChecks, path: '/client/contracts?section=milestones' },
        { id: 'deliverables', label: 'Deliverables', icon: ClipboardCheck, path: '/client/contracts?section=deliverables' },
        { id: 'time_tracking', label: 'Time Tracking', icon: History, path: '/client/time-tracking' },
        { id: 'contract_history', label: 'Contract History', icon: History, path: '/client/contracts?view=history' },
      ],
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      href: '/client/messages',
      children: [
        { id: 'inbox', label: 'Inbox', icon: MessageSquare, path: '/client/messages' },
        { id: 'archived_chats', label: 'Archived Chats', icon: Archive, path: '/client/messages?view=archived' },
        { id: 'unread_messages', label: 'Unread Messages', icon: MessageSquare, path: '/client/messages?view=unread' },
        { id: 'video_meetings', label: 'Video Meetings', icon: Video, path: '/client/interviews' },
      ],
    },
    {
      id: 'payments_billing',
      label: 'Payments & Billing',
      icon: CreditCard,
      href: '/client/financial-dashboard',
      children: [
        { id: 'payment_methods', label: 'Payment Methods', icon: CreditCard, path: '/client/wallet?tab=methods' },
        { id: 'escrow', label: 'Escrow', icon: Landmark, path: '/client/wallet?tab=escrow' },
        { id: 'transactions', label: 'Transactions', icon: Receipt, path: '/client/financial-dashboard?tab=transactions' },
        { id: 'invoices', label: 'Invoices', icon: FileText, path: '/client/invoices' },
        { id: 'spending_reports', label: 'Spending Reports', icon: BarChart3, path: '/client/financial-dashboard?tab=spending' },
        { id: 'withdraw_refunds', label: 'Withdraw Refunds', icon: ArrowLeftRight, path: '/client/wallet?tab=refunds' },
      ],
    },
    {
      id: 'reviews',
      label: 'Reviews & Ratings',
      icon: Scale,
      href: '/client/reviews',
      children: [
        { id: 'reviews_given', label: 'Reviews Given', icon: Scale, path: '/client/reviews?tab=given' },
        { id: 'freelancer_ratings', label: 'Freelancer Ratings', icon: Star, path: '/client/reviews?tab=ratings' },
        { id: 'feedback_history', label: 'Feedback History', icon: History, path: '/client/reviews?tab=history' },
      ],
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      href: '/client/analytics',
      children: [
        { id: 'hiring_analytics', label: 'Hiring Analytics', icon: Users, path: '/client/analytics?tab=hiring' },
        { id: 'project_analytics', label: 'Project Analytics', icon: Briefcase, path: '/client/analytics?tab=projects' },
        { id: 'budget_reports', label: 'Budget Reports', icon: CreditCard, path: '/client/financial-dashboard?tab=budgets' },
        { id: 'freelancer_performance', label: 'Freelancer Performance', icon: Star, path: '/client/analytics?tab=performance' },
      ],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: BellRing,
      href: '/client/notifications',
      children: [
        { id: 'all_notifications', label: 'All Notifications', icon: BellRing, path: '/client/notifications' },
        { id: 'proposal_alerts', label: 'Proposal Alerts', icon: FileText, path: '/client/notifications?tab=proposals' },
        { id: 'payment_alerts', label: 'Payment Alerts', icon: CreditCard, path: '/client/notifications?tab=payments' },
        { id: 'system_updates', label: 'System Updates', icon: Settings, path: '/client/notifications?tab=system' },
      ],
    },
    {
      id: 'support',
      label: 'Support Center',
      icon: HelpCircle,
      href: '/client/support',
      children: [
        { id: 'help_center', label: 'Help Center', icon: HelpCircle, path: '/client/support' },
        { id: 'disputes', label: 'Disputes', icon: Scale, path: '/client/support?tab=disputes' },
        { id: 'report_issue', label: 'Report Issue', icon: ShieldAlert, path: '/client/support?tab=report' },
        { id: 'contact_support', label: 'Contact Support', icon: MessageSquare, path: '/client/support?tab=contact' },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/client/profile',
      children: [
        { id: 'profile_settings', label: 'Profile Settings', icon: Settings, path: '/client/profile' },
        { id: 'company_profile', label: 'Company Profile', icon: Building, path: '/client/company-profile' },
        { id: 'security', label: 'Security', icon: Lock, path: '/client/security-center' },
        { id: 'two_factor', label: 'Two-Factor Authentication', icon: ShieldCheck, path: '/client/security-center?tab=2fa' },
        { id: 'notification_preferences', label: 'Notification Preferences', icon: BellRing, path: '/client/security-center?tab=notifications' },
      ],
    },
  ],
  business: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/client/dashboard' },
    {
      id: 'premium_hiring',
      label: 'Premium Hiring',
      icon: Sparkles,
      href: '/client/ai-talent-matching',
      children: [
        { id: 'ai_talent_matching', label: 'AI Talent Matching', icon: Sparkles, path: '/client/ai-talent-matching' },
        { id: 'ai_project_generator', label: 'AI Project Generator', icon: Sparkles, path: '/client/ai-project-generator' },
        { id: 'freelancer_comparison', label: 'Freelancer Comparison Tool', icon: Scale, path: '/client/freelancer-comparison' },
        { id: 'hiring_pipeline', label: 'Hiring Pipeline', icon: KanbanSquare, path: '/client/proposal-pipeline' },
      ],
    },
    {
      id: 'find_talent',
      label: 'Find Talent',
      icon: Search,
      href: '/client/talent-search',
      children: [
        { id: 'search_freelancers', label: 'Search Freelancers', icon: Search, path: '/client/talent-search' },
        { id: 'categories', label: 'Browse Categories', icon: FolderSearch, path: '/client/talent-search?view=categories' },
        { id: 'saved_freelancers', label: 'Saved Freelancers', icon: Heart, path: '/client/shortlist' },
        { id: 'recommended_freelancers', label: 'Recommended Freelancers', icon: Star, path: '/client/talent-search?view=recommended' },
        { id: 'talent_pools', label: 'Talent Pools', icon: Library, path: '/client/talent-pools' },
      ],
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: PlusCircle,
      href: '/client/post-job',
      children: [
        { id: 'post_project', label: 'Post a Project', icon: PlusCircle, path: '/client/post-job' },
        { id: 'active_projects', label: 'Active Projects', icon: Briefcase, path: '/client-services/my-jobs?status=active' },
        { id: 'draft_projects', label: 'Draft Projects', icon: Copy, path: '/client-services/my-jobs?status=draft' },
        { id: 'archived_projects', label: 'Archived Projects', icon: Archive, path: '/client-services/my-jobs?status=archived' },
        { id: 'project_templates', label: 'Project Templates', icon: Copy, path: '/client/post-job?template=true' },
      ],
    },
    {
      id: 'proposals',
      label: 'Proposals',
      icon: FileText,
      href: '/client/proposals',
      children: [
        { id: 'new_proposals', label: 'New Proposals', icon: FileText, path: '/client/proposals?status=new' },
        { id: 'shortlisted_freelancers', label: 'Shortlisted Freelancers', icon: Star, path: '/client/shortlist' },
        { id: 'interviewing', label: 'Interviewing', icon: Video, path: '/client/interviews' },
        { id: 'hired_freelancers', label: 'Hired Freelancers', icon: Users, path: '/client/contracts' },
        { id: 'rejected_proposals', label: 'Rejected Proposals', icon: FileText, path: '/client/proposals?status=rejected' },
      ],
    },
    {
      id: 'contracts_work',
      label: 'Contracts & Work',
      icon: FileSignature,
      href: '/client/contracts',
      children: [
        { id: 'active_contracts', label: 'Active Contracts', icon: FileSignature, path: '/client/contracts?status=active' },
        { id: 'milestones', label: 'Milestones', icon: ListChecks, path: '/client/contracts?section=milestones' },
        { id: 'deliverables', label: 'Deliverables', icon: ClipboardCheck, path: '/client/contracts?section=deliverables' },
        { id: 'time_tracking', label: 'Time Tracking', icon: History, path: '/client/time-tracking' },
        { id: 'contract_history', label: 'Contract History', icon: History, path: '/client/contracts?view=history' },
        { id: 'contract_generator', label: 'Contract Generator', icon: FileSignature, path: '/client/contract-generator' },
        { id: 'nda_management', label: 'NDA Management', icon: FileSignature, path: '/client/nda-management' },
        { id: 'skill_assessments', label: 'Skill Assessments', icon: Award, path: '/client/skill-assessments' },
      ],
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      href: '/client/messages',
      children: [
        { id: 'inbox', label: 'Inbox', icon: MessageSquare, path: '/client/messages' },
        { id: 'archived_chats', label: 'Archived Chats', icon: Archive, path: '/client/messages?view=archived' },
        { id: 'unread_messages', label: 'Unread Messages', icon: MessageSquare, path: '/client/messages?view=unread' },
        { id: 'video_meetings', label: 'Video Meetings', icon: Video, path: '/client/interviews' },
        { id: 'interview_scheduler', label: 'Interview Scheduler', icon: CalendarCheck, path: '/client/interview-scheduler' },
        { id: 'video_interview_room', label: 'Video Interview Room', icon: Video, path: '/client/video-interview-room' },
      ],
    },
    {
      id: 'payments_billing',
      label: 'Payments & Billing',
      icon: CreditCard,
      href: '/client/financial-dashboard',
      children: [
        { id: 'payment_methods', label: 'Payment Methods', icon: CreditCard, path: '/client/wallet?tab=methods' },
        { id: 'escrow', label: 'Escrow', icon: Landmark, path: '/client/wallet?tab=escrow' },
        { id: 'transactions', label: 'Transactions', icon: Receipt, path: '/client/financial-dashboard?tab=transactions' },
        { id: 'invoices', label: 'Invoices', icon: FileText, path: '/client/invoices' },
        { id: 'spending_reports', label: 'Spending Reports', icon: BarChart3, path: '/client/financial-dashboard?tab=spending' },
        { id: 'withdraw_refunds', label: 'Withdraw Refunds', icon: ArrowLeftRight, path: '/client/wallet?tab=refunds' },
      ],
    },
    {
      id: 'reviews',
      label: 'Reviews & Ratings',
      icon: Scale,
      href: '/client/reviews',
      children: [
        { id: 'reviews_given', label: 'Reviews Given', icon: Scale, path: '/client/reviews?tab=given' },
        { id: 'freelancer_ratings', label: 'Freelancer Ratings', icon: Star, path: '/client/reviews?tab=ratings' },
        { id: 'feedback_history', label: 'Feedback History', icon: History, path: '/client/reviews?tab=history' },
      ],
    },
    {
      id: 'team_management',
      label: 'Team Management',
      icon: Users,
      href: '/client/team',
      children: [
        { id: 'team_members', label: 'Team Members', icon: Users, path: '/client/team' },
        { id: 'roles_permissions', label: 'Roles & Permissions', icon: ShieldCheck, path: '/client/permissions' },
        { id: 'company_workspace', label: 'Company Workspace', icon: Building, path: '/client/collaboration-hub' },
        { id: 'custom_workspaces', label: 'Custom Workspaces', icon: LayoutGrid, path: '/client/custom-workspaces' },
        { id: 'activity_logs', label: 'Activity Logs', icon: History, path: '/client/activity-logs' },
      ],
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      href: '/client/analytics',
      children: [
        { id: 'hiring_analytics', label: 'Hiring Analytics', icon: Users, path: '/client/analytics?tab=hiring' },
        { id: 'project_analytics', label: 'Project Analytics', icon: Briefcase, path: '/client/analytics?tab=projects' },
        { id: 'budget_reports', label: 'Budget Reports', icon: CreditCard, path: '/client/financial-dashboard?tab=budgets' },
        { id: 'freelancer_performance', label: 'Freelancer Performance', icon: Star, path: '/client/analytics?tab=performance' },
        { id: 'enterprise_dashboard', label: 'Enterprise Dashboard', icon: Building2, path: '/client/enterprise-dashboard' },
        { id: 'audit_logs', label: 'Audit Logs', icon: History, path: '/client/audit-logs' },
        { id: 'risk_fraud_center', label: 'Risk & Fraud Center', icon: ShieldAlert, path: '/client/risk-fraud-center' },
      ],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: BellRing,
      href: '/client/notifications',
      children: [
        { id: 'all_notifications', label: 'All Notifications', icon: BellRing, path: '/client/notifications' },
        { id: 'proposal_alerts', label: 'Proposal Alerts', icon: FileText, path: '/client/notifications?tab=proposals' },
        { id: 'payment_alerts', label: 'Payment Alerts', icon: CreditCard, path: '/client/notifications?tab=payments' },
        { id: 'system_updates', label: 'System Updates', icon: Settings, path: '/client/notifications?tab=system' },
      ],
    },
    {
      id: 'support',
      label: 'Support Center',
      icon: HelpCircle,
      href: '/client/support',
      children: [
        { id: 'help_center', label: 'Help Center', icon: HelpCircle, path: '/client/support' },
        { id: 'disputes', label: 'Disputes', icon: Scale, path: '/client/support?tab=disputes' },
        { id: 'report_issue', label: 'Report Issue', icon: ShieldAlert, path: '/client/support?tab=report' },
        { id: 'contact_support', label: 'Contact Support', icon: MessageSquare, path: '/client/support?tab=contact' },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/client/profile',
      children: [
        { id: 'profile_settings', label: 'Profile Settings', icon: Settings, path: '/client/profile' },
        { id: 'company_profile', label: 'Company Profile', icon: Building, path: '/client/company-profile' },
        { id: 'security', label: 'Security', icon: Lock, path: '/client/security-center' },
        { id: 'two_factor', label: 'Two-Factor Authentication', icon: ShieldCheck, path: '/client/security-center?tab=2fa' },
        { id: 'notification_preferences', label: 'Notification Preferences', icon: BellRing, path: '/client/security-center?tab=notifications' },
        { id: 'api_keys', label: 'API Keys', icon: KeyRound, path: '/client/developer', badge: 'Enterprise' },
      ],
    },
    {
      id: 'growth',
      label: 'Growth Programs',
      icon: Gift,
      href: '/client/referral-program',
      children: [
        { id: 'referral_program', label: 'Referral Program', icon: Gift, path: '/client/referral-program' },
        { id: 'affiliate_dashboard', label: 'Affiliate Dashboard', icon: Handshake, path: '/client/affiliate-dashboard' },
      ],
    },
  ],
};
