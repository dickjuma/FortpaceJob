import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
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

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const IntegrationRequired = ({ title, note }) => (
  <ProductionDataPage title={title} integrationNote={note} />
);

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

const marketplaceGigActions = [
  {
    label: "Approve",
    endpoint: (row) => `/marketplace/gigs/${row.id || row._id}/approve`,
    successMessage: "Gig approved.",
    confirmMessage: "Approve this gig listing?",
  },
  {
    label: "Remove",
    endpoint: (row) => `/marketplace/gigs/${row.id || row._id}/remove`,
    variant: "danger",
    requireReason: true,
    successMessage: "Gig removed.",
    confirmMessage: "Remove this gig listing from the marketplace?",
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
        
        <Route element={<AdminLayout />}>
          {/* Dashboard */}
          <Route index element={<Dashboard />} />
          <Route
            path="activity"
            element={<ProductionDataPage title="Live Activity" endpoint="/fraud/anomalies" />}
          />
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
          <Route
            path="marketplace/gigs"
            element={<ProductionDataPage title="Gig Management" endpoint="/marketplace/gigs" actions={marketplaceGigActions} />}
          />
          <Route
            path="marketplace/proposals"
            element={<ProductionDataPage title="Proposal Review" endpoint="/marketplace/proposals" />}
          />
          <Route
            path="marketplace/contracts"
            element={
              <IntegrationRequired
                title="Contract Management"
                note="Marketplace contract administration needs a dedicated backend contract endpoint. Dispute handling is available under Admin > Disputes."
              />
            }
          />
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
          <Route
            path="marketplace/rankings"
            element={
              <IntegrationRequired
                title="Marketplace Rankings"
                note="Ranking controls need a dedicated backend endpoint before admins can safely reorder or override marketplace visibility."
              />
            }
          />
          <Route
            path="marketplace/reviews"
            element={<ProductionDataPage title="Flagged Reviews" endpoint="/marketplace/content/flagged" actions={flaggedContentActions} />}
          />
          <Route
            path="marketplace/quality"
            element={<ProductionDataPage title="Marketplace Quality" endpoint="/marketplace/content/flagged" actions={flaggedContentActions} />}
          />
          <Route
            path="marketplace/proposal-moderation"
            element={<ProductionDataPage title="Proposal Moderation" endpoint="/marketplace/proposals" />}
          />
          <Route
            path="marketplace/fraud-center"
            element={<ProductionDataPage title="Marketplace Fraud Center" endpoint="/fraud/reports" actions={fraudCaseActions} />}
          />
          <Route
            path="marketplace/proposal-audit"
            element={
              <IntegrationRequired
                title="Proposal Audit Logs"
                note="Proposal audit history is not exposed by the current admin_rbc module. This page is ready for integration once that endpoint is mounted."
              />
            }
          />
          
          {/* Legacy/Specific Marketplace Pages */}
          <Route path="marketplace/user-risk" element={<UserRiskPage />} />
          <Route
            path="marketplace/moderation"
            element={<ProductionDataPage title="Moderation Queue" endpoint="/marketplace/content/flagged" actions={flaggedContentActions} />}
          />
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
            element={
              <IntegrationRequired
                title="Chat Intelligence"
                note="Admin chat oversight needs the chat moderation backend mounted under the admin API before it can be production-enabled."
              />
            }
          />

          {/* Financial Control */}
          <Route path="finance">
            <Route index element={<FinancialHubPage />} />
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
              element={
                <IntegrationRequired
                  title="Deposits"
                  note="Deposit reconciliation requires a confirmed financial deposits endpoint. Mock deposit rows are disabled for production."
                />
              }
            />
            <Route
              path="refunds"
              element={
                <IntegrationRequired
                  title="Refunds"
                  note="Refund listing and action endpoints are not exposed in the current admin financial API."
                />
              }
            />
            <Route path="fees" element={<FeeStructurePage />} />
            <Route
              path="fee-collection"
              element={
                <IntegrationRequired
                  title="Fee Collection"
                  note="Fee collection reporting needs a dedicated backend endpoint before this page can display live production totals."
                />
              }
            />
            <Route
              path="subscriptions"
              element={
                <IntegrationRequired
                  title="Subscriptions"
                  note="Subscription billing administration is not part of the current admin_rbc financial routes."
                />
              }
            />
            <Route
              path="reconciliation"
              element={
                <IntegrationRequired
                  title="Reconciliation"
                  note="Reconciliation queues need a real financial reconciliation endpoint. The frontend will not show generated rows in production."
                />
              }
            />
            <Route
              path="payouts"
              element={
                <IntegrationRequired
                  title="Payout Reports"
                  note="Payout reports require a confirmed reporting endpoint. Pending withdrawals are available under the withdrawals route."
                />
              }
            />
            <Route path="tax" element={<TaxCompliancePage />} />
            <Route
              path="wallets"
              element={
                <IntegrationRequired
                  title="Wallet Controls"
                  note="Wallet freeze/unfreeze actions exist, but the backend does not expose a wallet listing endpoint yet. Add the wallet index route to enable this admin page."
                />
              }
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
            element={<ProductionDataPage title="Resolved Disputes" endpoint="/disputes?status=RESOLVED" />}
          />

          {/* Fraud & Security */}
          <Route path="fraud/alerts" element={<ProductionDataPage title="Security Alerts" endpoint="/fraud/reports" actions={fraudCaseActions} />} />
          <Route path="fraud/risky" element={<ProductionDataPage title="Risky Users" endpoint="/fraud/flagged-accounts" actions={fraudCaseActions} />} />
          <Route
            path="fraud/blacklist"
            element={
              <IntegrationRequired
                title="Blacklist"
                note="Blacklist management needs a dedicated fraud/security endpoint before production actions can be enabled."
              />
            }
          />
          <Route
            path="fraud/rules"
            element={
              <IntegrationRequired
                title="Fraud Rules Engine"
                note="Rules engine CRUD endpoints are not exposed in the current admin fraud module. Mock rules are disabled."
              />
            }
          />
          <Route path="fraud/ips" element={<ProductionDataPage title="IP Monitoring" endpoint="/fraud/anomalies" />} />

          {/* Chat */}
          <Route
            path="chat/list"
            element={
              <IntegrationRequired
                title="Chat Conversations"
                note="Chat conversation review needs the production chat-admin endpoint connected to this admin API client."
              />
            }
          />
          <Route
            path="chat/reports"
            element={
              <IntegrationRequired
                title="Reported Messages"
                note="Reported chat messages need a real moderation endpoint before admins can review them safely."
              />
            }
          />
          <Route
            path="chat/automod"
            element={
              <IntegrationRequired
                title="Auto Moderation Logs"
                note="Auto-moderation logs need a production audit/moderation endpoint. Mock logs are disabled."
              />
            }
          />

          {/* Analytics */}
          <Route path="analytics" element={<ProductionDataPage title="Platform Analytics" endpoint="/users" />} />
          <Route path="analytics/revenue" element={<ProductionDataPage title="Revenue Analytics" endpoint="/financial/reports/revenue" />} />
          <Route path="analytics/growth" element={<ProductionDataPage title="Growth Analytics" endpoint="/users" />} />
          <Route path="analytics/fraud" element={<ProductionDataPage title="Fraud Analytics" endpoint="/fraud/reports" actions={fraudCaseActions} />} />

          {/* Audit & Settings */}
          <Route
            path="audit"
            element={
              <IntegrationRequired
                title="Audit Logs"
                note="Audit logs need a confirmed immutable audit endpoint mounted under the admin API before production viewing is enabled."
              />
            }
          />
          <Route
            path="audit/:moduleName"
            element={
              <IntegrationRequired
                title="Module Audit Logs"
                note="Module-level audit history is backend-dependent and is intentionally blocked from displaying generated logs."
              />
            }
          />
          <Route
            path="config/general"
            element={<IntegrationRequired title="General Settings" note="Settings mutation endpoints are required before admin configuration can be production-enabled." />}
          />
          <Route
            path="config/security"
            element={<IntegrationRequired title="Security Settings" note="Security configuration requires backend policy endpoints and audit logging before edits are enabled." />}
          />
          <Route
            path="config/gateways"
            element={<IntegrationRequired title="Payment Gateways" note="Payment gateway configuration should only be enabled after secure backend secret management endpoints exist." />}
          />
          <Route
            path="config/roles"
            element={<IntegrationRequired title="Admin Roles" note="Role management needs backend RBAC endpoints before production changes are allowed." />}
          />
          <Route
            path="config/flags"
            element={<IntegrationRequired title="Feature Flags" note="Feature flag controls require a production feature-management endpoint." />}
          />

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
};

export default AdminRoutes;

