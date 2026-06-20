import {
  LayoutDashboard, Users, Briefcase, DollarSign, Shield,
  MessageSquare, Flag, AlertTriangle, CreditCard, Scale,
  Activity, Settings, FileText, UserX, Eye, Lock,
  TrendingUp, Wallet, Clock, Star
} from 'lucide-react';

export const ROLE_CONFIG = {
  super_admin: {
    label: 'Super Admin',
    color: '#6366f1',
    bgColor: 'bg-[#4C1D95]/10 text-[#4C1D95] dark:bg-[#4C1D95]/30 dark:text-[#4C1D95]',
    description: 'Full system access',
    widgets: [
      { id: 'total_users', title: 'Total Users', dataKey: 'totalUsers', icon: Users, iconBg: 'bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30', iconColor: 'text-[#4C1D95] dark:text-[#4C1D95]', format: 'number', size: 'md', showSparkline: true, showTrend: true },
      { id: 'active_jobs', title: 'Active Jobs', dataKey: 'activeJobs', icon: Briefcase, iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-success dark:text-success', format: 'number', size: 'md', showSparkline: true, showTrend: true },
      { id: 'total_revenue', title: 'Total Revenue', dataKey: 'totalRevenue', icon: TrendingUp, iconBg: 'bg-violet-100 dark:bg-violet-900/30', iconColor: 'text-violet-600 dark:text-violet-400', format: 'currency', size: 'md', showSparkline: true, showTrend: true },
      { id: 'escrow_balance', title: 'Escrow Balance', dataKey: 'escrowBalance', icon: Wallet, iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400', format: 'currency', size: 'md', showSparkline: false, showTrend: true },
      { id: 'fraud_alerts', title: 'Fraud Alerts', dataKey: 'fraudAlerts', icon: Shield, iconBg: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400', format: 'number', size: 'sm', showSparkline: false, showTrend: false, criticalThreshold: 10, warningThreshold: 5 },
      { id: 'active_disputes', title: 'Active Disputes', dataKey: 'activeDisputes', icon: Scale, iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400', format: 'number', size: 'sm', showSparkline: false, showTrend: false, warningThreshold: 20 },
      { id: 'online_freelancers', title: 'Online Freelancers', dataKey: 'onlineFreelancers', icon: Activity, iconBg: 'bg-teal-100 dark:bg-teal-900/30', iconColor: 'text-teal-600 dark:text-teal-400', format: 'number', size: 'sm', showSparkline: true, showTrend: false },
      { id: 'system_health', title: 'System Health', dataKey: 'systemHealth', icon: Activity, iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400', format: 'percentage', size: 'sm', showSparkline: false, showTrend: false, warningThreshold: 95 },
    ],
    sections: [
      { id: 'revenue_chart', type: 'chart', component: 'RevenueChart', title: 'Revenue Overview', span: 'two-thirds', lazy: false },
      { id: 'system_health', type: 'panel', component: 'SystemHealth', title: 'System Health', span: 'third', lazy: false },
      { id: 'user_growth', type: 'chart', component: 'UserGrowthChart', title: 'User Growth', span: 'half', lazy: true },
      { id: 'activity_chart', type: 'chart', component: 'ActivityChart', title: 'Platform Activity', span: 'half', lazy: true },
      { id: 'activity_feed', type: 'feed', component: 'ActivityFeed', title: 'Live Activity', span: 'third', lazy: false },
      { id: 'alerts_panel', type: 'panel', component: 'AlertsPanel', title: 'System Alerts', span: 'third', lazy: false },
      { id: 'users_table', type: 'table', component: 'UsersTable', title: 'Recent Users', span: 'two-thirds', lazy: true },
    ],
    modules: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
      {
        id: 'users',
        label: 'Users & Identity',
        icon: Users,
        href: '/admin/users',
        badge: 'New',
        children: [
          { id: 'all_users', label: 'All Users', path: '/admin/users' },
          { id: 'user_analytics', label: 'Analytics', path: '/admin/users/analytics' },
          { id: 'freelancers', label: 'Freelancers', path: '/admin/users/freelancers' },
          { id: 'clients', label: 'Clients', path: '/admin/users/clients' },
          { id: 'organizations', label: 'Organizations', path: '/admin/users/orgs' },
          { id: 'admins', label: 'Admins', path: '/admin/users/admins' },
          { id: 'user_audit', label: 'User Audit', path: '/admin/audit/security' },
        ]
      },
      {
        id: 'marketplace',
        label: 'Marketplace',
        icon: Briefcase,
        href: '/admin/marketplace',
        children: [
          { id: 'overview', label: 'Overview', path: '/admin/marketplace' },
          { id: 'jobs', label: 'Jobs', path: '/admin/marketplace/jobs' },
          { id: 'gigs', label: 'Gigs', path: '/admin/marketplace/gigs' },
          { id: 'proposals', label: 'Proposals', path: '/admin/marketplace/proposals' },
          { id: 'contracts', label: 'Contracts', path: '/admin/marketplace/contracts' },
          { id: 'rankings', label: 'Rankings', path: '/admin/marketplace/rankings' },
          { id: 'reviews', label: 'Reviews', path: '/admin/marketplace/reviews' },
          { id: 'categories', label: 'Categories', path: '/admin/marketplace/categories' },
          { id: 'moderation', label: 'Moderation', path: '/admin/marketplace/moderation' },
          { id: 'proposal_audit', label: 'Proposal Audit', path: '/admin/marketplace/proposal-audit' },
          { id: 'fraud_center', label: 'Fraud Center', path: '/admin/marketplace/fraud-center' },
          { id: 'payments', label: 'Escrow Oversight', path: '/admin/marketplace/payments' },
          { id: 'quality', label: 'Quality Control', path: '/admin/marketplace/quality' },
          { id: 'marketplace_audit', label: 'Activity Logs', path: '/admin/audit/marketplace' },
        ]
      },
      {
        id: 'finance',
        label: 'Financial Control',
        icon: DollarSign,
        href: '/admin/finance',
        children: [
          { id: 'finance_overview', label: 'Overview', path: '/admin/finance' },
          { id: 'transactions', label: 'Ledger', path: '/admin/finance/transactions' },
          { id: 'deposits', label: 'Deposits', path: '/admin/finance/deposits' },
          { id: 'escrow', label: 'Escrow Accounts', path: '/admin/finance/escrow' },
          { id: 'withdrawals', label: 'Withdrawals', path: '/admin/finance/withdrawals' },
          { id: 'refunds', label: 'Refunds', path: '/admin/finance/refunds' },
          { id: 'fees', label: 'Fee Config', path: '/admin/finance/fees' },
          { id: 'fee_collection', label: 'Fees Collected', path: '/admin/finance/fee-collection' },
          { id: 'subscriptions', label: 'Subscriptions', path: '/admin/finance/subscriptions' },
          { id: 'reconciliation', label: 'Reconciliation', path: '/admin/finance/reconciliation' },
          { id: 'payouts', label: 'Payout Reports', path: '/admin/finance/payouts' },
          { id: 'tax', label: 'Tax Compliance', path: '/admin/finance/tax' },
          { id: 'finance_audit', label: 'Financial Audit', path: '/admin/audit/finance' },
        ]
      },
      {
        id: 'disputes',
        label: 'Dispute Resolution',
        icon: Scale,
        href: '/admin/disputes',
        children: [
          { id: 'disputes_hub', label: 'Open Disputes', path: '/admin/disputes' },
          { id: 'disputes_review', label: 'In Review', path: '/admin/disputes/review' },
          { id: 'disputes_resolved', label: 'Resolved', path: '/admin/disputes/resolved' },
          { id: 'disputes_audit', label: 'Dispute Logs', path: '/admin/audit/disputes' },
        ]
      },
      {
        id: 'fraud',
        label: 'Fraud & Security',
        icon: Shield,
        href: '/admin/fraud/alerts',
        children: [
          { id: 'user_risk', label: 'User Risk Table', path: '/admin/marketplace/user-risk' },
          { id: 'fraud_alerts', label: 'Security Alerts', path: '/admin/fraud/alerts' },
          { id: 'risky_users', label: 'Risky Users', path: '/admin/fraud/risky' },
          { id: 'blacklist', label: 'Blacklist Manager', path: '/admin/fraud/blacklist' },
          { id: 'fraud_rules', label: 'Rules Engine', path: '/admin/fraud/rules' },
          { id: 'ips', label: 'IP Monitoring', path: '/admin/fraud/ips' },
        ]
      },
      {
        id: 'chat',
        label: 'Chat/Monitoring',
        icon: MessageSquare,
        href: '/admin/chat/list',
        children: [
          { id: 'chat_list', label: 'Conversations', path: '/admin/chat/list' },
          { id: 'chat_reports', label: 'Reported Messages', path: '/admin/chat/reports' },
          { id: 'chat_automod', label: 'Auto-Mod Logs', path: '/admin/chat/automod' },
          { id: 'messages', label: 'Messages', path: '/admin/messages' },
          { id: 'interviews', label: 'Interview Queue', path: '/admin/interviews' },
          { id: 'video_calls', label: 'Video Calls', path: '/admin/video-calls' },
        ]
      },
      {
        id: 'analytics',
        label: 'Platform Analytics',
        icon: TrendingUp,
        href: '/admin/analytics',
        children: [
          { id: 'analytics_hub', label: 'Overview', path: '/admin/analytics' },
          { id: 'analytics_revenue', label: 'Revenue Insights', path: '/admin/analytics/revenue' },
          { id: 'analytics_growth', label: 'Growth Metrics', path: '/admin/analytics/growth' },
          { id: 'analytics_fraud', label: 'Fraud Trends', path: '/admin/analytics/fraud' },
        ]
      },
      {
        id: 'system_config',
        label: 'System Config / Audit',
        icon: Settings,
        href: '/admin/config/general',
        children: [
          { id: 'config_general', label: 'General', path: '/admin/config/general' },
          { id: 'config_security', label: 'Security', path: '/admin/config/security' },
{ id: 'config_gateways', label: 'Gateways', path: '/admin/config/payment-gateways' },
           { id: 'config_roles', label: 'Permissions', path: '/admin/config/roles' },
           { id: 'config_flags', label: 'Feature Flags', path: '/admin/config/feature-flags' },
           { id: 'config_trusted_companies', label: 'Trusted Companies', path: '/admin/config/companies' },
           { id: 'config_submissions', label: 'Form Submissions', path: '/admin/config/submissions' },
          { id: 'audit_logs', label: 'Audit Logs', path: '/admin/audit' },
          { id: 'audit_security', label: 'Security Logs', path: '/admin/audit/security' },
          { id: 'audit_finance', label: 'Financial Logs', path: '/admin/audit/finance' },
          { id: 'audit_marketplace', label: 'Marketplace Logs', path: '/admin/audit/marketplace' },
          { id: 'audit_disputes', label: 'Dispute Logs', path: '/admin/audit/disputes' },
        ]
      }
    ],
    quickActions: [
      { id: 'ban_user', label: 'Ban User', icon: UserX, action: 'BAN_USER', variant: 'danger', permission: 'users:ban' },
      { id: 'freeze_wallet', label: 'Freeze Wallet', icon: Lock, action: 'FREEZE_WALLET', variant: 'warning', permission: 'wallet:freeze' },
      { id: 'view_logs', label: 'System Logs', icon: FileText, action: 'VIEW_LOGS', variant: 'secondary', permission: 'logs:view' },
      { id: 'impersonate', label: 'Impersonate', icon: Eye, action: 'IMPERSONATE', variant: 'secondary', permission: 'users:impersonate' },
    ],
    alertTypes: ['fraud', 'dispute', 'system', 'payment', 'security'],
  },

  finance_admin: {
    label: 'Finance Admin',
    color: '#10b981',
    bgColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-success',
    description: 'Financial operations',
    widgets: [
      { id: 'total_revenue', title: 'Total Revenue', dataKey: 'totalRevenue', icon: TrendingUp, iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-success dark:text-success', format: 'currency', size: 'lg', showSparkline: true, showTrend: true },
      { id: 'escrow_balance', title: 'Escrow Balance', dataKey: 'escrowBalance', icon: Wallet, iconBg: 'bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30', iconColor: 'text-[#4C1D95] dark:text-[#4C1D95]', format: 'currency', size: 'lg', showSparkline: true, showTrend: true },
      { id: 'pending_withdrawals', title: 'Pending Withdrawals', dataKey: 'pendingWithdrawals', icon: Clock, iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400', format: 'number', size: 'md', showSparkline: false, showTrend: false, warningThreshold: 50 },
      { id: 'failed_transactions', title: 'Failed Transactions', dataKey: 'failedTransactions', icon: AlertTriangle, iconBg: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400', format: 'number', size: 'md', showSparkline: false, showTrend: false, criticalThreshold: 20, warningThreshold: 10 },
    ],
    sections: [
      { id: 'revenue_chart', type: 'chart', component: 'RevenueChart', title: 'Revenue Breakdown', span: 'full', lazy: false },
      { id: 'transactions_table', type: 'table', component: 'TransactionsTable', title: 'Recent Transactions', span: 'two-thirds', lazy: false },
      { id: 'alerts_panel', type: 'panel', component: 'AlertsPanel', title: 'Financial Alerts', span: 'third', lazy: false },
    ],
    modules: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
      {
        id: 'finance',
        label: 'Financial Control',
        icon: DollarSign,
        href: '/admin/finance',
        children: [
          { id: 'finance_overview', label: 'Overview', path: '/admin/finance' },
          { id: 'transactions', label: 'Ledger', path: '/admin/finance/transactions' },
          { id: 'deposits', label: 'Deposits', path: '/admin/finance/deposits' },
          { id: 'escrow', label: 'Escrow Accounts', path: '/admin/finance/escrow' },
          { id: 'withdrawals', label: 'Withdrawals', path: '/admin/finance/withdrawals' },
          { id: 'refunds', label: 'Refunds', path: '/admin/finance/refunds' },
          { id: 'fees', label: 'Fee Config', path: '/admin/finance/fees' },
          { id: 'fee_collection', label: 'Fees Collected', path: '/admin/finance/fee-collection' },
          { id: 'subscriptions', label: 'Subscriptions', path: '/admin/finance/subscriptions' },
          { id: 'reconciliation', label: 'Reconciliation', path: '/admin/finance/reconciliation' },
          { id: 'payouts', label: 'Payout Reports', path: '/admin/finance/payouts' },
          { id: 'tax', label: 'Tax Compliance', path: '/admin/finance/tax' },
          { id: 'finance_audit', label: 'Financial Audit', path: '/admin/audit/finance' },
        ]
      },
      {
        id: 'analytics',
        label: 'Platform Analytics',
        icon: TrendingUp,
        href: '/admin/analytics/revenue',
        children: [
          { id: 'analytics_revenue', label: 'Revenue Insights', path: '/admin/analytics/revenue' },
          { id: 'analytics_growth', label: 'Growth Metrics', path: '/admin/analytics/growth' },
        ]
      }
    ],
    quickActions: [
      { id: 'approve_withdrawal', label: 'Approve Withdrawal', icon: CreditCard, action: 'APPROVE_WITHDRAWAL', variant: 'primary', permission: 'withdrawals:approve' },
      { id: 'freeze_wallet', label: 'Freeze Wallet', icon: Lock, action: 'FREEZE_WALLET', variant: 'warning', permission: 'wallet:freeze' },
      { id: 'export_report', label: 'Export Report', icon: FileText, action: 'EXPORT_REPORT', variant: 'secondary', permission: 'reports:export' },
    ],
    alertTypes: ['payment', 'system'],
  },

  customer_care: {
    label: 'Customer Care',
    color: '#3b82f6',
    bgColor: 'bg-[#4C1D95]/10 text-[#4C1D95] dark:bg-[#4C1D95]/30 dark:text-[#4C1D95]',
    description: 'User support operations',
    widgets: [
      { id: 'open_tickets', title: 'Open Tickets', dataKey: 'openTickets', icon: MessageSquare, iconBg: 'bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30', iconColor: 'text-[#4C1D95] dark:text-[#4C1D95]', format: 'number', size: 'lg', showSparkline: true, showTrend: true, warningThreshold: 30 },
      { id: 'active_disputes', title: 'Active Disputes', dataKey: 'activeDisputes', icon: Scale, iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400', format: 'number', size: 'md', showSparkline: false, showTrend: false },
      { id: 'pending_responses', title: 'Pending Responses', dataKey: 'pendingResponses', icon: Clock, iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400', format: 'number', size: 'md', showSparkline: false, showTrend: false, criticalThreshold: 20 },
    ],
    sections: [
      { id: 'disputes_table', type: 'table', component: 'DisputesTable', title: 'Active Disputes', span: 'two-thirds', lazy: false },
      { id: 'activity_feed', type: 'feed', component: 'ActivityFeed', title: 'Recent Activity', span: 'third', lazy: false },
    ],
    modules: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
      {
        id: 'users',
        label: 'Users & Identity',
        icon: Users,
        href: '/admin/users',
        children: [
          { id: 'all_users', label: 'All Users', path: '/admin/users' },
          { id: 'user_analytics', label: 'Analytics', path: '/admin/users/analytics' },
          { id: 'freelancers', label: 'Freelancers', path: '/admin/users/freelancers' },
          { id: 'clients', label: 'Clients', path: '/admin/users/clients' },
        ]
      },
      {
        id: 'disputes',
        label: 'Dispute Resolution',
        icon: Scale,
        href: '/admin/disputes',
        children: [
          { id: 'disputes_hub', label: 'Disputes Hub', path: '/admin/disputes' },
          { id: 'disputes_review', label: 'In Review', path: '/admin/disputes/review' },
          { id: 'disputes_resolved', label: 'Resolved', path: '/admin/disputes/resolved' },
        ]
      },
      {
        id: 'chat',
        label: 'Chat/Monitoring',
        icon: MessageSquare,
        href: '/admin/chat/list',
        children: [
          { id: 'chat_list', label: 'Oversight', path: '/admin/chat/list' },
          { id: 'chat_reports', label: 'Reported', path: '/admin/chat/reports' },
        ]
      }
    ],
    quickActions: [
      { id: 'assign_ticket', label: 'Assign Ticket', icon: MessageSquare, action: 'ASSIGN_TICKET', variant: 'primary', permission: 'tickets:assign' },
      { id: 'escalate', label: 'Escalate Issue', icon: AlertTriangle, action: 'ESCALATE', variant: 'warning', permission: 'tickets:escalate' },
    ],
    alertTypes: ['dispute', 'system'],
  },

  moderation_admin: {
    label: 'Moderation Admin',
    color: '#f59e0b',
    bgColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    description: 'Content moderation',
    widgets: [
      { id: 'flagged_jobs', title: 'Flagged Jobs', dataKey: 'flaggedJobs', icon: Flag, iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400', format: 'number', size: 'lg', showSparkline: false, showTrend: false, criticalThreshold: 20, warningThreshold: 10 },
      { id: 'reported_users', title: 'Reported Users', dataKey: 'reportedUsers', icon: UserX, iconBg: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400', format: 'number', size: 'md', showSparkline: false, showTrend: false, warningThreshold: 15 },
      { id: 'pending_reviews', title: 'Pending Reviews', dataKey: 'pendingReviews', icon: Star, iconBg: 'bg-violet-100 dark:bg-violet-900/30', iconColor: 'text-violet-600 dark:text-violet-400', format: 'number', size: 'md', showSparkline: false, showTrend: false },
    ],
    sections: [
      { id: 'flagged_content', type: 'table', component: 'FlaggedContentTable', title: 'Flagged Content Queue', span: 'full', lazy: false },
      { id: 'activity_feed', type: 'feed', component: 'ActivityFeed', title: 'Moderation Log', span: 'third', lazy: false },
    ],
    modules: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
      {
        id: 'marketplace',
        label: 'Marketplace',
        icon: Briefcase,
        href: '/admin/marketplace',
        children: [
          { id: 'overview', label: 'Overview', path: '/admin/marketplace' },
          { id: 'jobs', label: 'Jobs', path: '/admin/marketplace/jobs' },
          { id: 'gigs', label: 'Gigs', path: '/admin/marketplace/gigs' },
          { id: 'proposals', label: 'Proposals', path: '/admin/marketplace/proposals' },
          { id: 'contracts', label: 'Contracts', path: '/admin/marketplace/contracts' },
          { id: 'rankings', label: 'Rankings', path: '/admin/marketplace/rankings' },
          { id: 'reviews', label: 'Reviews', path: '/admin/marketplace/reviews' },
          { id: 'quality', label: 'Quality Control', path: '/admin/marketplace/quality' },
          { id: 'marketplace_audit', label: 'Activity Logs', path: '/admin/audit/marketplace' },
        ]
      },
      {
        id: 'chat',
        label: 'Chat Intelligence',
        icon: MessageSquare,
        href: '/admin/chat/automod',
        children: [
          { id: 'chat_automod', label: 'Auto-Mod Logs', path: '/admin/chat/automod' },
        ]
      }
    ],
    quickActions: [
      { id: 'approve_content', label: 'Approve Content', icon: Eye, action: 'APPROVE_CONTENT', variant: 'primary', permission: 'content:approve' },
      { id: 'remove_content', label: 'Remove Content', icon: Flag, action: 'REMOVE_CONTENT', variant: 'danger', permission: 'content:remove' },
      { id: 'warn_user', label: 'Warn User', icon: AlertTriangle, action: 'WARN_USER', variant: 'warning', permission: 'users:warn' },
    ],
    alertTypes: ['system'],
  },

  fraud_security_admin: {
    label: 'Fraud & Security',
    color: '#ef4444',
    bgColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    description: 'Security operations',
    widgets: [
      { id: 'fraud_alerts', title: 'Fraud Alerts', dataKey: 'fraudAlerts', icon: Shield, iconBg: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400', format: 'number', size: 'lg', showSparkline: true, showTrend: true, criticalThreshold: 10, warningThreshold: 5 },
      { id: 'risky_users', title: 'Risky Users', dataKey: 'riskyUsers', icon: UserX, iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400', format: 'number', size: 'md', showSparkline: false, showTrend: false, warningThreshold: 20 },
      { id: 'suspicious_transactions', title: 'Suspicious Transactions', dataKey: 'suspiciousTransactions', icon: AlertTriangle, iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400', format: 'number', size: 'md', showSparkline: false, showTrend: false, warningThreshold: 15 },
    ],
    sections: [
      { id: 'fraud_chart', type: 'chart', component: 'FraudChart', title: 'Fraud Trend', span: 'two-thirds', lazy: false },
      { id: 'alerts_panel', type: 'panel', component: 'AlertsPanel', title: 'Active Alerts', span: 'third', lazy: false },
      { id: 'users_table', type: 'table', component: 'UsersTable', title: 'High Risk Users', span: 'full', lazy: true },
    ],
    modules: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
      {
        id: 'fraud',
        label: 'Fraud & Security',
        icon: Shield,
        href: '/admin/fraud/alerts',
        children: [
          { id: 'user_risk', label: 'User Risk Table', path: '/admin/marketplace/user-risk' },
          { id: 'fraud_alerts', label: 'Security Alerts', path: '/admin/fraud/alerts' },
          { id: 'risky_users', label: 'Risky Users', path: '/admin/fraud/risky' },
          { id: 'blacklist', label: 'Blacklist Manager', path: '/admin/fraud/blacklist' },
          { id: 'fraud_rules', label: 'Rules Engine', path: '/admin/fraud/rules' },
          { id: 'ips', label: 'IP Monitoring', path: '/admin/fraud/ips' },
        ]
      },
      {
        id: 'analytics',
        label: 'Platform Analytics',
        icon: TrendingUp,
        href: '/admin/analytics/fraud',
        children: [
          { id: 'analytics_fraud', label: 'Fraud Trends', path: '/admin/analytics/fraud' },
        ]
      },
      {
        id: 'settings',
        label: 'System Config',
        icon: Settings,
        href: '/admin/config/security',
        children: [
          { id: 'config_security', label: 'Security', path: '/admin/config/security' },
          { id: 'audit_logs', label: 'Audit Logs', path: '/admin/audit' },
        ]
      }
    ],
    quickActions: [
      { id: 'ban_user', label: 'Ban User', icon: UserX, action: 'BAN_USER', variant: 'danger', permission: 'users:ban' },
      { id: 'freeze_wallet', label: 'Freeze Wallet', icon: Lock, action: 'FREEZE_WALLET', variant: 'warning', permission: 'wallet:freeze' },
      { id: 'flag_account', label: 'Flag Account', icon: Flag, action: 'FLAG_ACCOUNT', variant: 'warning', permission: 'users:flag' },
    ],
    alertTypes: ['fraud', 'security', 'payment'],
  },

  chat_support_admin: {
    label: 'Chat Support',
    color: '#8b5cf6',
    bgColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    description: 'Chat moderation',
    widgets: [
      { id: 'active_conversations', title: 'Active Conversations', dataKey: 'activeConversations', icon: MessageSquare, iconBg: 'bg-violet-100 dark:bg-violet-900/30', iconColor: 'text-violet-600 dark:text-violet-400', format: 'number', size: 'lg', showSparkline: true, showTrend: false },
      { id: 'reported_messages', title: 'Reported Messages', dataKey: 'reportedMessages', icon: Flag, iconBg: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400', format: 'number', size: 'md', showSparkline: false, showTrend: false, warningThreshold: 10 },
    ],
    sections: [
      { id: 'activity_feed', type: 'feed', component: 'ActivityFeed', title: 'Chat Activity', span: 'two-thirds', lazy: false },
      { id: 'alerts_panel', type: 'panel', component: 'AlertsPanel', title: 'Reported Messages', span: 'third', lazy: false },
    ],
    modules: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
      {
        id: 'chat',
        label: 'Chat Intelligence',
        icon: MessageSquare,
        href: '/admin/chat/list',
        children: [
          { id: 'chat_list', label: 'Oversight', path: '/admin/chat/list' },
          { id: 'chat_reports', label: 'Reported', path: '/admin/chat/reports' },
          { id: 'chat_automod', label: 'Auto-Mod Logs', path: '/admin/chat/automod' },
        ]
      }
    ],
    quickActions: [
      { id: 'mute_user', label: 'Mute User', icon: UserX, action: 'MUTE_USER', variant: 'warning', permission: 'chat:mute' },
      { id: 'delete_message', label: 'Delete Message', icon: Flag, action: 'DELETE_MESSAGE', variant: 'danger', permission: 'chat:delete' },
    ],
    alertTypes: ['system'],
  },
};


