import { AdminRole, RoleConfig } from './types/role';

export const ROLE_CONFIGS: Record<AdminRole, RoleConfig> = {
  SUPER_ADMIN: {
    widgets: ['total_users', 'active_jobs', 'revenue', 'escrow_balance', 'fraud_alerts', 'active_disputes'],
    sections: ['analytics_charts', 'live_activity', 'system_alerts']
  },
  FINANCE_ADMIN: {
    widgets: ['revenue', 'escrow_balance', 'pending_withdrawals', 'failed_transactions'],
    sections: ['transactions_table', 'withdrawals_queue', 'financial_alerts']
  },
  CUSTOMER_CARE: {
    widgets: ['open_tickets', 'active_disputes', 'pending_responses'],
    sections: ['support_tickets', 'user_complaints', 'quick_reply']
  },
  MODERATION_ADMIN: {
    widgets: ['flagged_jobs', 'reported_users', 'pending_reviews'],
    sections: ['moderation_queue', 'content_review']
  },
  FRAUD_SECURITY_ADMIN: {
    widgets: ['fraud_alerts', 'risky_users', 'suspicious_transactions'],
    sections: ['fraud_alerts_feed', 'tracking_panel']
  },
  SUPPORT_CHAT_ADMIN: {
    widgets: ['active_conversations', 'reported_messages'],
    sections: ['chat_threads', 'chat_moderation']
  }
};
