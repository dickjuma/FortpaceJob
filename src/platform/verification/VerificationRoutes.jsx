import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VerificationCenterPage from './pages/VerificationCenterPage';
import IdentityVerificationFlow from './pages/IdentityVerificationFlow';
import KYCManagementPage from './pages/KYCManagementPage';
import BusinessVerificationFlow from './pages/BusinessVerificationFlow';

export default function VerificationRoutes() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Routes>
        <Route path="/" element={<VerificationCenterPage />} />
        <Route path="/identity" element={<IdentityVerificationFlow />} />
        <Route path="/kyc" element={<KYCManagementPage />} />
        <Route path="/business" element={<BusinessVerificationFlow />} />
      </Routes>
    </div>
  );
}
