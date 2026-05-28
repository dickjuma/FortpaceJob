import { useQuery } from '@tanstack/react-query';
import { AdminRole } from '../types/role';

// Mock API function
const fetchDashboardData = async (role: AdminRole) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data tailored to the role (or global pool)
  return {
    total_users: { value: "12,842", trend: 12.5 },
    active_jobs: { value: "842", trend: -2.1 },
    revenue: { value: "$284,500", trend: 28.4 },
    escrow_balance: { value: "$1,248,592", trend: 5.2 },
    fraud_alerts: { value: "14", trend: 40 },
    active_disputes: { value: "6", trend: -15 },
    pending_withdrawals: { value: "$12,840", trend: 8.4 },
    failed_transactions: { value: "3", trend: -50 },
    open_tickets: { value: "24", trend: 12 },
    pending_responses: { value: "8", trend: -5 },
    flagged_jobs: { value: "12", trend: 20 },
    reported_users: { value: "5", trend: 0 },
    pending_reviews: { value: "18", trend: 15 },
    risky_users: { value: "42", trend: 10 },
    suspicious_transactions: { value: "7", trend: 14 },
    active_conversations: { value: "1,204", trend: 5 },
    reported_messages: { value: "32", trend: 8 }
  };
};

export const useDashboardData = (role: AdminRole) => {
  return useQuery({
    queryKey: ['dashboard_data', role],
    queryFn: () => fetchDashboardData(role),
    staleTime: 60 * 1000, // 60 seconds
  });
};
