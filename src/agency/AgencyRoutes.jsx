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
import { useAuthStore } from '../common/authStore';

const AgencyProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export default function AgencyRoutes() {
  return (
    <Routes>
      <Route path="/public-profile" element={<AgencyPublicProfile />} />
      <Route
        path="/*"
        element={
          <AgencyProtectedRoute>
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface dark:bg-gray-950 min-h-screen">
              <Routes>
                <Route path="profile" element={<AgencyPublicProfile />} />
                <Route path="team" element={<TeamManagementPage />} />
                <Route path="projects" element={<SharedProjectsPage />} />
                <Route path="workspace" element={<AgencyWorkspacePage />} />
                <Route path="departments" element={<DepartmentsPage />} />
                <Route path="permissions" element={<TeamPermissionsPage />} />
                <Route path="files" element={<FileManagerPage />} />
                <Route path="upload" element={<UploadCenterPage />} />
                <Route path="assets" element={<SharedAssetsPage />} />
                <Route path="downloads" element={<DownloadsPage />} />
                <Route path="/" element={<AgencyDashboard />} />
              </Routes>
            </div>
          </AgencyProtectedRoute>
        }
      />
    </Routes>
  );
}
