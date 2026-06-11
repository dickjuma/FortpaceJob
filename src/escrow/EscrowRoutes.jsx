import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EscrowDashboard from './pages/EscrowDashboard';
import EscrowHistory from './pages/EscrowHistory';
import EscrowDeposit from './pages/EscrowDeposit';

export default function EscrowRoutes() {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface dark:bg-gray-950 min-h-screen">
      <Routes>
        <Route path="/" element={<EscrowDashboard />} />
        <Route path="/history" element={<EscrowHistory />} />
        <Route path="/deposit" element={<EscrowDeposit />} />
      </Routes>
    </div>
  );
}
