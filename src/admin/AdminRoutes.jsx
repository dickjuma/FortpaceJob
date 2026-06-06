import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminLayout from "./layouts/AdminLayout";
import AdminAuthGuard from "./components/AdminAuthGuard";
import DashboardPage from "./pages/DashboardPage";
import { 
  FinancialHubPage, 
  FeeStructurePage, 
  TaxCompliancePage
} from "../modules/financial-control";
import DisputeResolution from "./pages/DisputeResolution";
import { UserManagementRoutes } from "./UserManagementModule";
import UserRiskPage from "./pages/marketplace/UserRiskPage";
import MarketplaceDashboardPage from "./pages/marketplace/MarketplaceDashboardPage";
import ProductionDataPage from "./pages/ProductionDataPage";
import AuditLogsPage from "./pages/audit/AuditLogsPage";
import ModuleAuditPage from "./pages/audit/ModuleAuditPage";
import GeneralSettingsPage from "./pages/config/GeneralSettingsPage";
import FormSubmissionsPage from "./pages/config/FormSubmissionsPage";
import SecuritySettingsPage from "./pages/config/SecuritySettingsPage";
import PaymentGatewaysPage from "./pages/config/PaymentGatewaysPage";
import SubscriptionControlPage from "./pages/config/SubscriptionControlPage";
import AdminRolesPage from "./pages/config/AdminRolesPage";
import FeatureFlagsPage from "./pages/config/FeatureFlagsPage";
import TrustedCompaniesAdminPage from "./pages/config/TrustedCompaniesAdminPage";
import ResolvedDisputesPage from "./pages/disputes/ResolvedDisputesPage";
import ChatAutomodPage from "./pages/chat/ChatAutomodPage";
import SecurityAuditPage from "./pages/audit/SecurityAuditPage";
import DisputeAuditPage from "./pages/audit/DisputeAuditPage";
import MarketplaceAuditPage from "./pages/audit/MarketplaceAuditPage";
import GigsManagementPage from "./pages/marketplace/GigsManagementPage";
import ProposalsReviewPage from "./pages/marketplace/ProposalsReviewPage";
import ModerationDashboard from "./pages/marketplace/ModerationDashboard";
import MarketplaceContractsPage from "./pages/marketplace/ContractsPage";
import MarketplaceReviewsPage from "./pages/marketplace/ReviewsPage";
import FraudDetectionCenter from "./pages/FraudDetectionCenter";
import PlatformAnalyticsPage from "./pages/PlatformAnalyticsPage";
import FinancialControl from "./pages/FinancialControl";
import AuditSecurityMonitoringPage from "./pages/AuditSecurityMonitoringPage";
import ProposalAuditLogsPage from "./pages/ProposalAuditLogsPage";
import ProposalModerationDashboard from "./pages/ProposalModerationDashboard";
import SystemAnalyticsDashboard from "./pages/SystemAnalyticsDashboard";
import QualityPage from "./pages/marketplace/QualityPage";
import AlgorithmControlPanel from "./pages/ranking/AlgorithmControlPanel";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// ─── Marketplace Action Configs ────────────────────────────────────────────────
const marketplaceJobActions = [
  {
    label: "Approve",
    endpoint: (row) => `/marketplace/jobs/${row.id || row._id}/approve`,
    successMessage: "Job approved.",
    confirmMessage: "Approve this marketplace job?",
  },
  {
    label: "Reject",
    endpoint: (row) => `/marketplace/jobs/${row.id || row._id}/reject`,
    variant: "danger",
    requireReason: true,
    successMessage: "Job rejected.",
    confirmMessage: "Reject this marketplace job?",
  },
];

const marketplaceCategoryActions = [
  {
    label: "Delete",
    endpoint: (row) => `/marketplace/categories/${row.id || row._id}`,
    method: "delete",
    variant: "danger",
    successMessage: "Category deleted.",
    confirmMessage: "Delete this marketplace category?",
  },
];

const addMarketplaceCategoryAction = {
  label: "Add Category",
  endpoint: "/marketplace/categories",
  method: "post",
  fields: [
    { name: "name", label: "Category name", prompt: "Enter the new marketplace category name", required: true },
  ],
  successMessage: "Category added.",
};

const flaggedContentActions = [
  {
    label: "Resolve",
    endpoint: (row) => `/marketplace/content/${row.id || row._id || row.contentId}/resolve`,
    method: "patch",
    requireReason: true,
    body: (_row, reason) => ({ resolution: "RESOLVED", reason }),
    successMessage: "Flagged content resolved.",
    confirmMessage: "Resolve this flagged content item?",
  },
  {
    label: "Dismiss",
    endpoint: (row) => `/marketplace/content/${row.id || row._id || row.contentId}/resolve`,
    method: "patch",
    variant: "warning",
    requireReason: true,
    body: (_row, reason) => ({ resolution: "DISMISSED", reason }),
    successMessage: "Flagged content dismissed.",
    confirmMessage: "Dismiss this flagged content report?",
  },
];

const fraudCaseActions = [
  {
    label: "Restrict",
    endpoint: (row) => `/fraud/cases/${row.id || row._id || row.caseId}/restrict`,
    variant: "warning",
    requireReason: true,
    body: (_row, reason) => ({ reason, restrictions: ["MARKETPLACE_ACTIONS", "WITHDRAWALS"] }),
    successMessage: "Fraud case restricted.",
  },
  {
    label: "Escalate",
    endpoint: (row) => `/fraud/cases/${row.id || row._id || row.caseId}/escalate`,
    variant: "warning",
    requireReason: true,
    successMessage: "Fraud case escalated.",
  },
  {
    label: "Resolve",
    endpoint: (row) => `/fraud/cases/${row.id || row._id || row.caseId}/resolve`,
    requireReason: true,
    body: (_row, reason) => ({ resolution: "RESOLVED", reason }),
    successMessage: "Fraud case resolved.",
  },
];

const blacklistActions = [
  {
    label: "Remove",
    endpoint: (row) => `/fraud/blacklist/${row.id || row._id}`,
    method: "delete",
    variant: "danger",
    successMessage: "Removed from blacklist.",
    confirmMessage: "Remove this entry from the blacklist?",
  },
];

const addToBlacklistAction = {
  label: "Add to Blacklist",
  endpoint: "/fraud/blacklist",
  method: "post",
  fields: [
    { name: "userId", label: "User ID", prompt: "Enter the user ID to blacklist", required: true },
    { name: "reason", label: "Reason", prompt: "Enter the reason for blacklisting", required: true },
  ],
  successMessage: "User added to blacklist.",
};

const fraudRuleActions = [
  {
    label: "Toggle",
    endpoint: (row) => `/fraud/rules/${row.id || row._id}/toggle`,
    method: "patch",
    successMessage: "Fraud rule toggled.",
    confirmMessage: "Toggle this fraud rule?",
  },
];

const addFraudRuleAction = {
  label: "Add Rule",
  endpoint: "/fraud/rules",
  method: "post",
  fields: [
    { name: "name", label: "Rule Name", prompt: "Enter rule name", required: true },
    { name: "condition", label: "Condition", prompt: "Enter rule condition (e.g. riskScore > 80)", required: true },
    { name: "action", label: "Action", prompt: "Enter action (e.g. FLAG, RESTRICT, BLOCK)", required: true },
  ],
  successMessage: "Fraud rule created.",
};

const withdrawalActions = [
  {
    label: "Approve",
    endpoint: (row) => `/financial/withdrawals/${row.id || row._id || row.wdId}/approve`,
    method: "post",
    successMessage: "Withdrawal approved.",
    confirmMessage: "Approve this withdrawal? MFA may be required by the backend.",
  },
  {
    label: "Reject",
    endpoint: (row) => `/financial/withdrawals/${row.id || row._id || row.wdId}/reject`,
    method: "post",
    variant: "danger",
    requireReason: true,
    successMessage: "Withdrawal rejected.",
    confirmMessage: "Reject this withdrawal?",
  },
];

const refundActions = [
  {
    label: "Process",
    endpoint: (row) => `/financial/refunds/${row.id || row._id}/process`,
    method: "post",
    requireReason: true,
    body: (_row, reason) => ({ reason }),
    successMessage: "Refund processed.",
    confirmMessage: "Process this refund?",
  },
];

const subscriptionActions = [
  {
    label: "Cancel",
    endpoint: (row) => `/financial/subscriptions/${row.id || row._id}/cancel`,
    method: "post",
    variant: "danger",
    requireReason: true,
    successMessage: "Subscription cancelled.",
    confirmMessage: "Cancel this subscription?",
  },
];

const walletActions = [
  {
    label: "Freeze",
    endpoint: (row) => `/financial/wallets/${row.id || row._id}/freeze`,
    method: "post",
    variant: "danger",
    successMessage: "Wallet frozen.",
    confirmMessage: "Freeze this wallet?",
  },
  {
    label: "Unfreeze",
    endpoint: (row) => `/financial/wallets/${row.id || row._id}/unfreeze`,
    method: "post",
    variant: "warning",
    successMessage: "Wallet unfrozen.",
    confirmMessage: "Unfreeze this wallet?",
  },
];

const chatMessageActions = [
  {
    label: "Remove",
    endpoint: (row) => `/chat/reports/${row.id || row._id}/resolve`,
    method: "patch",
    variant: "danger",
    requireReason: true,
    body: (_row, reason) => ({ action: "REMOVE", reason }),
    successMessage: "Message removed.",
    confirmMessage: "Remove this reported message?",
  },
  {
    label: "Dismiss",
    endpoint: (row) => `/chat/reports/${row.id || row._id}/resolve`,
    method: "patch",
    variant: "warning",
    requireReason: true,
    body: (_row, reason) => ({ action: "DISMISS", reason }),
    successMessage: "Report dismissed.",
    confirmMessage: "Dismiss this report?",
  },
];

const disputeActions = [
  {
    label: "Escalate",
    endpoint: (row) => `/disputes/${row.id || row._id || row.disputeId}/escalate`,
    method: "post",
    variant: "warning",
    requireReason: true,
    successMessage: "Dispute escalated.",
  },
  {
    label: "Assign Outcome",
    endpoint: (row) => `/disputes/${row.id || row._id || row.disputeId}/outcome`,
    method: "post",
    requireReason: true,
    body: (_row, reason) => ({ outcome: "ADMIN_RESOLUTION", reason }),
    successMessage: "Dispute outcome assigned.",
    confirmMessage: "Assign an admin resolution outcome to this dispute?",
  },
];

const AdminRoutes = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="login" element={<Navigate to="/admin/login" replace />} />

        <Route element={<AdminAuthGuard />}>
        <Route element={<AdminLayout />}>
          {/* Dashboard */}
          <Route index element={<DashboardPage />} />
          <Route path="activity" element={<SystemAnalyticsDashboard />} />
          <Route
            path="alerts"
            element={<ProductionDataPage title="Alerts Center" endpoint="/fraud/reports" actions={fraudCaseActions} />}
          />

          {/* User Management Module - MOUNTED HERE */}
          <Route path="users/*" element={<UserManagementRoutes />} />

          {/* Marketplace Management System */}
          <Route path="marketplace" element={<MarketplaceDashboardPage />} />
          <Route
            path="marketplace/jobs"
            element={<ProductionDataPage title="Project Review Queue" endpoint="/marketplace/jobs" actions={marketplaceJobActions} />}
          />
          <Route path="marketplace/gigs" element={<GigsManagementPage />} />
          <Route path="marketplace/proposals" element={<ProposalsReviewPage />} />
          <Route path="marketplace/contracts" element={<MarketplaceContractsPage />} />
          <Route
            path="marketplace/reports"
            element={<ProductionDataPage title="Reported Marketplace Content" endpoint="/marketplace/content/flagged" actions={flaggedContentActions} />}
          />
          <Route
            path="marketplace/categories"
            element={
              <ProductionDataPage
                title="Marketplace Categories"
                endpoint="/marketplace/categories"
                actions={marketplaceCategoryActions}
                primaryAction={addMarketplaceCategoryAction}
              />
            }
          />
          <Route path="marketplace/rankings" element={<AlgorithmControlPanel />} />
          <Route path="marketplace/reviews" element={<MarketplaceReviewsPage />} />
          <Route path="marketplace/quality" element={<QualityPage />} />
          <Route path="marketplace/proposal-moderation" element={<ProposalModerationDashboard />} />
          <Route path="marketplace/fraud-center" element={<FraudDetectionCenter />} />
          <Route path="marketplace/proposal-audit" element={<ProposalAuditLogsPage />} />
          
          {/* Legacy/Specific Marketplace Pages */}
          <Route path="marketplace/user-risk" element={<UserRiskPage />} />
          <Route path="marketplace/moderation" element={<ModerationDashboard />} />
          <Route
            path="marketplace/fraud"
            element={<ProductionDataPage title="Fraud Analytics" endpoint="/fraud/reports" actions={fraudCaseActions} />}
          />
          <Route
            path="marketplace/payments"
            element={<ProductionDataPage title="Escrow Oversight" endpoint="/financial/reports/escrow-summary" />}
          />
          <Route
            path="marketplace/chat"
            element={<ProductionDataPage title="Chat Intelligence" endpoint="/chat/conversations" />}
          />

          {/* Financial Control */}
          <Route path="finance">
            <Route index element={<FinancialHubPage />} />
            <Route path="control" element={<FinancialControl />} />
            <Route
              path="transactions"
              element={<ProductionDataPage title="Ledger Transactions" endpoint="/financial/transactions" />}
            />
            <Route
              path="escrow"
              element={<ProductionDataPage title="Escrow Summary" endpoint="/financial/reports/escrow-summary" />}
            />
            <Route
              path="withdrawals"
              element={<ProductionDataPage title="Pending Withdrawals" endpoint="/financial/withdrawals/pending" actions={withdrawalActions} />}
            />
            <Route
              path="deposits"
              element={<ProductionDataPage title="Deposits" endpoint="/financial/deposits" />}
            />
            <Route
              path="refunds"
              element={<ProductionDataPage title="Refunds" endpoint="/financial/refunds" actions={refundActions} />}
            />
            <Route path="fees" element={<FeeStructurePage />} />
            <Route
              path="fee-collection"
              element={<ProductionDataPage title="Fee Collection Report" endpoint="/financial/fee-collection" />}
            />
            <Route
              path="subscriptions"
              element={<ProductionDataPage title="Subscriptions" endpoint="/financial/subscriptions" actions={subscriptionActions} />}
            />
            <Route
              path="reconciliation"
              element={<ProductionDataPage title="Reconciliation History" endpoint="/financial/reconciliation/history" />}
            />
            <Route
              path="payouts"
              element={<ProductionDataPage title="Payout Reports" endpoint="/financial/payouts" />}
            />
            <Route path="tax" element={<TaxCompliancePage />} />
            <Route
              path="wallets"
              element={<ProductionDataPage title="Wallet Controls" endpoint="/financial/wallets" actions={walletActions} />}
            />
          </Route>

          {/* Disputes */}
          <Route path="disputes" element={<DisputeResolution />} />
          <Route
            path="disputes/review"
            element={<ProductionDataPage title="Disputes In Review" endpoint="/disputes?status=IN_REVIEW" actions={disputeActions} />}
          />
          <Route
            path="disputes/resolved"
            element={<ResolvedDisputesPage />}
          />

          {/* Fraud & Security */}
          <Route path="fraud/alerts" element={<ProductionDataPage title="Security Alerts" endpoint="/fraud/reports" actions={fraudCaseActions} />} />
          <Route path="fraud/risky" element={<ProductionDataPage title="Risky Users" endpoint="/fraud/flagged-accounts" actions={fraudCaseActions} />} />
          <Route
            path="fraud/blacklist"
            element={
              <ProductionDataPage
                title="Blacklist Management"
                endpoint="/fraud/blacklist"
                actions={blacklistActions}
                primaryAction={addToBlacklistAction}
              />
            }
          />
          <Route
            path="fraud/rules"
            element={
              <ProductionDataPage
                title="Fraud Rules Engine"
                endpoint="/fraud/rules"
                actions={fraudRuleActions}
                primaryAction={addFraudRuleAction}
              />
            }
          />
          <Route path="fraud/ips" element={<ProductionDataPage title="IP Monitoring" endpoint="/fraud/anomalies" />} />

          {/* Chat */}
          <Route
            path="chat/list"
            element={<ProductionDataPage title="Chat Conversations" endpoint="/chat/conversations" />}
          />
          <Route
            path="chat/reports"
            element={<ProductionDataPage title="Reported Messages" endpoint="/chat/reports" actions={chatMessageActions} />}
          />
          <Route
            path="chat/automod"
            element={<ChatAutomodPage />}
          />
          <Route
            path="messages"
            element={<ProductionDataPage title="Message Oversight" endpoint="/chat/conversations" />}
          />
          <Route
            path="interviews"
            element={<ProductionDataPage title="Interview Oversight" endpoint="/hiring/interviews" />}
          />
          <Route
            path="video-calls"
            element={<ProductionDataPage title="Video Call Oversight" endpoint="/hiring/interviews" />}
          />

          {/* Analytics */}
          <Route path="analytics" element={<PlatformAnalyticsPage />} />
          <Route path="analytics/system" element={<SystemAnalyticsDashboard />} />
          <Route path="analytics/revenue" element={<ProductionDataPage title="Revenue Analytics" endpoint="/financial/reports/revenue" />} />
          <Route path="analytics/growth" element={<ProductionDataPage title="Growth Analytics" endpoint="/users" />} />
          <Route path="analytics/fraud" element={<ProductionDataPage title="Fraud Analytics" endpoint="/fraud/reports" actions={fraudCaseActions} />} />

          {/* Audit & Settings */}
          <Route path="audit" element={<AuditLogsPage />} />
          <Route path="audit/monitoring" element={<AuditSecurityMonitoringPage />} />
          <Route path="audit/security" element={<SecurityAuditPage />} />
          <Route path="audit/disputes" element={<DisputeAuditPage />} />
          <Route path="audit/marketplace" element={<MarketplaceAuditPage />} />
          <Route path="audit/:moduleName" element={<ModuleAuditPage />} />
          <Route
            path="config/general"
            element={<GeneralSettingsPage />}
          />
          <Route
            path="config/submissions"
            element={<FormSubmissionsPage />}
          />
          <Route
            path="config/security"
            element={<SecuritySettingsPage />}
          />
          <Route
            path="config/gateways"
            element={<PaymentGatewaysPage />}
          />
          <Route
            path="config/subscriptions"
            element={<SubscriptionControlPage />}
          />
          <Route
            path="config/roles"
            element={<AdminRolesPage />}
          />
          <Route
            path="config/flags"
            element={<FeatureFlagsPage />}
          />
          <Route
            path="config/trusted-companies"
            element={<TrustedCompaniesAdminPage />}
          />

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
        </Route>
      </Routes>
    </QueryClientProvider>
  );
};

export default AdminRoutes;
