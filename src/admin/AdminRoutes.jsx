import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminLayout from "./layouts/AdminLayout";
import AdminAuthGuard from "./components/AdminAuthGuard";
import DashboardPage from "./pages/DashboardPage";
import FinancialHubPage from "./finance/pages/FinancialHubPage";
import LedgerPage from "./finance/pages/LedgerPage";
import WithdrawalsPage from "./finance/pages/WithdrawalsPage";
import RefundsPage from "./finance/pages/RefundsPage";
import SubscriptionsPage from "./finance/pages/SubscriptionsPage";
import FeeStructurePage from "./finance/pages/FeeStructurePage";
import FeeCollectionPage from "./finance/pages/FeeCollectionPage";
import ReconciliationPage from "./finance/pages/ReconciliationPage";
import PayoutReportsPage from "./finance/pages/PayoutReportsPage";
import DepositsPage from "./finance/pages/DepositsPage";
import TaxCompliancePage from "./finance/pages/TaxCompliancePage";
import EscrowManagementPage from "./finance/pages/EscrowManagementPage";
import DisputeResolution from "./pages/DisputeResolution";
import { UserManagementRoutes } from "./UserManagementModule";
import UserRiskPage from "./pages/marketplace/UserRiskPage";
import MarketplaceDashboardPage from "./pages/marketplace/MarketplaceDashboardPage";
import ProductionDataPage from "./pages/ProductionDataPage";
import AuditLogsPage from "./pages/audit/AuditLogsPage";
import GeneralSettingsPage from "./pages/config/GeneralSettingsPage";
import FormSubmissionsPage from "./pages/config/FormSubmissionsPage";
import SecuritySettingsPage from "./pages/config/SecuritySettingsPage";
import PaymentGatewaysPage from "./pages/config/PaymentGatewaysPage";
import AdminRolesPage from "./pages/config/AdminRolesPage";
import FeatureFlagsPage from "./pages/config/FeatureFlagsPage";
import TrustedCompaniesAdminPage from "./pages/config/TrustedCompaniesAdminPage";
import ResolvedDisputesPage from "./pages/disputes/ResolvedDisputesPage";
import ChatAutomodPage from "./pages/chat/ChatAutomodPage";
import SecurityAuditPage from "./pages/audit/SecurityAuditPage";
import DisputeAuditPage from "./pages/audit/DisputeAuditPage";
import MarketplaceAuditPage from "./pages/audit/MarketplaceAuditPage";
import ModuleAuditPage from "./pages/audit/ModuleAuditPage";
import GigsManagementPage from "./pages/marketplace/GigsManagementPage";
import MarketplaceContractsPage from "./pages/marketplace/ContractsPage";
import FraudDetectionCenter from "./pages/FraudDetectionCenter";
import SystemAnalyticsDashboard from "./pages/SystemAnalyticsDashboard";
import DisputeEvidencePage from "./pages/disputes/DisputeEvidencePage";
import FraudCaseManagementPage from "./pages/fraud/FraudCaseManagementPage";
import FlaggedContentPage from "./pages/marketplace/FlaggedContentPage";
import UserSessionsPage from "./pages/users/UserSessionsPage";
import UserActivityPage from "./pages/users/UserActivityPage";
import WalletManagementPage from "./pages/financial/WalletManagementPage";
import UserAnalyticsPage from "./pages/users/UserAnalyticsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const marketplaceJobActions = [
  {
    label: "Feature",
    endpoint: (row) => `/marketplace/jobs`,
    method: "post",
    successMessage: "Job featured.",
    confirmMessage: "Feature this job?",
  }
];

const marketplaceCategoryActions = [
  {
    label: "Delete",
    endpoint: (row) => `/marketplace/categories/${row.id || row._id}`,
    method: "patch",
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

const blacklistActions = [
  {
    label: "Remove",
    endpoint: (row) => `/fraud/blacklist`,
    method: "post",
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
    endpoint: (row) => `/fraud/rules`,
    method: "post",
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

const userActions = [
  {
    label: "Suspend",
    endpoint: (row) => `/users/${row.id || row._id}/suspend`,
    method: "patch",
    variant: "danger",
    successMessage: "User suspended.",
    confirmMessage: "Suspend this user?",
  },
  {
    label: "Restore",
    endpoint: (row) => `/users/${row.id || row._id}/restore`,
    method: "patch",
    variant: "warning",
    successMessage: "User restored.",
    confirmMessage: "Restore this user?",
  },
  {
    label: "Verify",
    endpoint: (row) => `/users/${row.id || row._id}/verify`,
    method: "patch",
    successMessage: "User verified.",
    confirmMessage: "Manually verify this user?",
  },
  {
    label: "Delete",
    endpoint: (row) => `/users/${row.id || row._id}`,
    method: "delete",
    variant: "danger",
    successMessage: "User deleted.",
    confirmMessage: "Delete this user forever?",
  }
];

const createAdminAction = {
  label: "Create Admin",
  endpoint: "/auth/admins",
  method: "post",
  fields: [
    { name: "email", label: "Email", prompt: "Enter admin email", required: true },
    { name: "fullName", label: "Name", prompt: "Enter full name", required: true },
    { name: "role", label: "Role", prompt: "Enter role (ADMIN, SUPER_ADMIN)", required: true },
  ],
  successMessage: "Admin invitation sent successfully.",
};

const AdminRoutes = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="login" element={<Navigate to="/admin/login" replace />} />

        <Route element={<AdminAuthGuard />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="activity" element={<SystemAnalyticsDashboard />} />

          <Route path="users/*">
            <Route index element={<UserManagementRoutes />} />
            <Route path="list" element={<ProductionDataPage title="All Users" endpoint="/users" actions={userActions} role="super_admin" />} />
            <Route path="analytics" element={<UserAnalyticsPage />} />
            <Route path="freelancers" element={<ProductionDataPage title="Freelancers" endpoint="/users?role=freelancer" columns={[{ key: "type", label: "Type" }]} />} />
            <Route path="clients" element={<ProductionDataPage title="Clients" endpoint="/users?role=client" columns={[{ key: "type", label: "Type" }]} />} />
            <Route path="admins" element={<ProductionDataPage title="Admins" endpoint="/users?role=admin" actions={userActions} primaryAction={createAdminAction} role="super_admin" />} />
            <Route path=":userId/profile" element={<UserRiskPage />} />
            <Route path=":userId/sessions" element={<UserSessionsPage />} />
            <Route path=":userId/activity" element={<UserActivityPage />} />
            <Route path=":userId/wallet" element={<WalletManagementPage />} />
          </Route>

          <Route path="marketplace" element={<MarketplaceDashboardPage />} />
          <Route path="marketplace/jobs" element={<ProductionDataPage title="Marketplace Jobs" endpoint="/marketplace/jobs" actions={marketplaceJobActions} />} />
          <Route path="marketplace/gigs" element={<GigsManagementPage />} />
          <Route path="marketplace/proposals" element={<ProductionDataPage title="Marketplace Proposals" endpoint="/marketplace/proposals" />} />
          <Route path="marketplace/contracts" element={<MarketplaceContractsPage />} />
          <Route path="marketplace/reports" element={<FlaggedContentPage />} />
          <Route path="marketplace/categories" element={<ProductionDataPage title="Marketplace Categories" endpoint="/marketplace/categories" actions={marketplaceCategoryActions} primaryAction={addMarketplaceCategoryAction} />} />
          <Route path="marketplace/rankings" element={<ProductionDataPage title="Top Ranked Profiles" endpoint="/marketplace/rankings" />} />

          <Route path="finance">
            <Route index element={<FinancialHubPage />} />
            <Route path="transactions" element={<LedgerPage />} />
            <Route path="escrow" element={<EscrowManagementPage />} />
            <Route path="escrow/:escrowId" element={<EscrowManagementPage />} />
            <Route path="withdrawals" element={<WithdrawalsPage />} />
            <Route path="refunds" element={<RefundsPage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="wallets" element={<ProductionDataPage title="Wallets" endpoint="/financial/wallets" />} />
            <Route path="wallets/:walletId" element={<WalletManagementPage />} />
            <Route path="fees" element={<FeeStructurePage />} />
            <Route path="fee-collection" element={<FeeCollectionPage />} />
            <Route path="reconciliation" element={<ReconciliationPage />} />
            <Route path="payouts" element={<PayoutReportsPage />} />
            <Route path="deposits" element={<DepositsPage />} />
            <Route path="tax-compliance" element={<TaxCompliancePage />} />
            <Route path="tax" element={<TaxCompliancePage />} />
          </Route>

          <Route path="disputes" element={<DisputeResolution />} />
          <Route path="disputes/review" element={<ProductionDataPage title="Active Disputes" endpoint="/disputes" />} />
          <Route path="disputes/resolved" element={<ResolvedDisputesPage />} />
          <Route path="disputes/:disputeId/evidence" element={<DisputeEvidencePage />} />

          <Route path="fraud/alerts" element={<ProductionDataPage title="Fraud Reports" endpoint="/fraud/reports" />} />
          <Route path="fraud/blacklist" element={<ProductionDataPage title="Blacklist Management" endpoint="/fraud/blacklist" actions={blacklistActions} primaryAction={addToBlacklistAction} />} />
          <Route path="fraud/rules" element={<ProductionDataPage title="Fraud Rules Engine" endpoint="/fraud/rules" actions={fraudRuleActions} primaryAction={addFraudRuleAction} />} />
          <Route path="fraud/ips" element={<ProductionDataPage title="Anomalies" endpoint="/fraud/anomalies" />} />
          <Route path="fraud/cases/:caseId" element={<FraudCaseManagementPage />} />

          <Route path="chat/list" element={<ProductionDataPage title="Chat Conversations" endpoint="/chat/conversations" />} />
          <Route path="chat/automod" element={<ChatAutomodPage />} />
          <Route path="content/faqs" element={<ProductionDataPage title="FAQs" endpoint="/faqs" />} />
          <Route path="content/favorites" element={<ProductionDataPage title="Platform Favorites" endpoint="/favorites" />} />
          <Route path="content/articles" element={<ProductionDataPage title="Articles" endpoint="/articles" />} />

          <Route path="audit" element={<AuditLogsPage />} />
          <Route path="audit/security" element={<SecurityAuditPage />} />
          <Route path="audit/disputes" element={<DisputeAuditPage />} />
          <Route path="audit/marketplace" element={<MarketplaceAuditPage />} />
          <Route path="audit/finance" element={<ModuleAuditPage module="FINANCE" title="Financial Audit" />} />

          <Route path="config/roles" element={<AdminRolesPage />} />
          <Route path="config/feature-flags" element={<FeatureFlagsPage />} />
          <Route path="config/payment-gateways" element={<PaymentGatewaysPage />} />
          <Route path="config/security" element={<SecuritySettingsPage />} />
          <Route path="config/general" element={<GeneralSettingsPage />} />
          <Route path="config/submissions" element={<FormSubmissionsPage />} />
          <Route path="config/companies" element={<TrustedCompaniesAdminPage />} />

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
        </Route>
      </Routes>
    </QueryClientProvider>
  );
};

export default AdminRoutes;