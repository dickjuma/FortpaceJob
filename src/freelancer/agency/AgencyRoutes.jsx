import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AgencyDashboard from './pages/AgencyDashboard';
import AgencyPublicProfile from './pages/AgencyPublicProfile';
import TeamManagementPage from './pages/TeamManagementPage';
import SharedProjectsPage from './pages/SharedProjectsPage';
import AgencyWorkspacePage from './pages/AgencyWorkspacePage';
import DepartmentsPage from './pages/DepartmentsPage';
import TeamPermissionsPage from './pages/TeamPermissionsPage';
import FileManagerPage from './pages/FileManagerPage';
import UploadCenterPage from './pages/UploadCenterPage';
import SharedAssetsPage from './pages/SharedAssetsPage';
import DownloadsPage from './pages/DownloadsPage';
import TeamMemberDetailsPage from './pages/TeamMemberDetailsPage';
import RoleManagementPage from './pages/RoleManagementPage';
import CreateRolePage from './pages/CreateRolePage';
import SharedFilesPage from './pages/SharedFilesPage';
import AgencyPortfolioPage from './pages/AgencyPortfolioPage';
import AgencyServicesPage from './pages/AgencyServicesPage';
import OrganizationBillingPage from './pages/OrganizationBillingPage';
import InvoicesPage from './pages/InvoicesPage';
import EnterpriseContractsPage from './pages/EnterpriseContractsPage';
import ContractApprovalWorkflowPage from './pages/ContractApprovalWorkflowPage';
import TeamAnalyticsPage from './pages/TeamAnalyticsPage';
import RecruitmentPage from './pages/RecruitmentPage';
import TalentPoolPage from './pages/TalentPoolPage';
import ProcurementPage from './pages/ProcurementPage';
import OrganizationSettingsPage from './pages/OrganizationSettingsPage';
import AgencyVerificationPage from './pages/AgencyVerificationPage';
import { useAuthStore } from '../../platform/common/authStore';
import FreelancerLayout from '../FreelancerLayout';

const AgencyProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const accountType = String(user?.accountType || user?.profile?.accountType || '').toUpperCase();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (accountType !== 'AGENCY') {
    return <Navigate to="/freelancer/dashboard" replace />;
  }

  return <>{children}</>;
};

const AgencyRoute = ({ children }) => (
  <AgencyProtectedRoute>
    <FreelancerLayout>
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-light-gray min-h-screen">
        {children}
      </div>
    </FreelancerLayout>
  </AgencyProtectedRoute>
);

export default function AgencyRoutes() {
  return (
    <Routes>
      <Route path="/public-profile" element={<AgencyPublicProfile />} />
      <Route path="/*" element={<AgencyRoute><Routes><Route path="profile" element={<AgencyPublicProfile />} /><Route path="dashboard" element={<AgencyDashboard />} /><Route path="team" element={<TeamManagementPage />} /><Route path="team/:id" element={<TeamMemberDetailsPage />} /><Route path="projects" element={<SharedProjectsPage />} /><Route path="workspace" element={<AgencyWorkspacePage />} /><Route path="departments" element={<DepartmentsPage />} /><Route path="permissions" element={<TeamPermissionsPage />} /><Route path="roles" element={<RoleManagementPage />} /><Route path="roles/new" element={<CreateRolePage />} /><Route path="roles/:id/edit" element={<CreateRolePage />} /><Route path="files" element={<FileManagerPage />} /><Route path="shared-files" element={<SharedFilesPage />} /><Route path="upload" element={<UploadCenterPage />} /><Route path="assets" element={<SharedAssetsPage />} /><Route path="downloads" element={<DownloadsPage />} /><Route path="portfolio" element={<AgencyPortfolioPage />} /><Route path="services" element={<AgencyServicesPage />} /><Route path="billing" element={<OrganizationBillingPage />} /><Route path="invoices" element={<InvoicesPage />} /><Route path="contracts" element={<EnterpriseContractsPage />} /><Route path="contracts/:id/approval" element={<ContractApprovalWorkflowPage />} /><Route path="analytics" element={<TeamAnalyticsPage />} /><Route path="recruitment" element={<RecruitmentPage />} /><Route path="talent-pool" element={<TalentPoolPage />} /><Route path="procurement" element={<ProcurementPage />} /><Route path="settings" element={<OrganizationSettingsPage />} /><Route path="verification" element={<AgencyVerificationPage />} /><Route path="/" element={<AgencyDashboard />} /></Routes></AgencyRoute>} />
    </Routes>
  );
}
