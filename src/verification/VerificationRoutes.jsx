import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VerificationCenterPage from './pages/VerificationCenterPage';
import IdentityVerificationFlow from './pages/IdentityVerificationFlow';
import KYCManagementPage from './pages/KYCManagementPage';

export default function VerificationRoutes() {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface dark:bg-gray-950 min-h-screen">
      <Routes>
        <Route path="/" element={<VerificationCenterPage />} />
        <Route path="/identity" element={<IdentityVerificationFlow />} />
        <Route path="/kyc" element={<KYCManagementPage />} />
      </Routes>
    </div>
  );
}
