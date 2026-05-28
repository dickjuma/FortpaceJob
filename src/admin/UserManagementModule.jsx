import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AllUsersPage from './pages/users/AllUsersPage';
import FreelancersPage from './pages/users/FreelancersPage';
import ClientsPage from './pages/users/ClientsPage';
import AdminsPage from './pages/users/AdminsPage';
import UserProfilePage from './pages/users/UserProfilePage';
import ProductionDataPage from './pages/ProductionDataPage';

// Modals
import SuspendUserModal from './components/users/modals/SuspendUserModal';

/**
 * Main routing entry point for the User Management module.
 * Mount this under /admin/users/* in the main application.
 */
export function UserManagementRoutes() {
  return (
    <>
      <Routes>
        <Route index element={<AllUsersPage />} />
        <Route path="analytics" element={<ProductionDataPage title="User Analytics" endpoint="/users" />} />
        <Route path="freelancers" element={<FreelancersPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="orgs" element={<ProductionDataPage title="Organizations" endpoint="/users?role=organization" />} />
        <Route path="admins" element={<AdminsPage />} />
        <Route path=":userId/*" element={<UserProfilePage />} />
      </Routes>

      {/* Global Modals for this Module */}
      <SuspendUserModal />
      {/* Add other modals as they are developed */}
    </>
  );
}

// Named exports for integration
export { default as useUserManagementStore } from './store/userManagementStore';
export * from './hooks/users/useUsers';
export * from './hooks/users/useAdmins';
export * from './hooks/users/useFreelancers';
export * from './hooks/users/useClients';
export * from './hooks/users/useUserActions';
