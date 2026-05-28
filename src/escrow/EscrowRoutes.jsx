import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EscrowDashboard from './pages/EscrowDashboard';

export default function EscrowRoutes() {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface dark:bg-gray-950 min-h-screen">
      <Routes>
        <Route path="/" element={<EscrowDashboard />} />
      </Routes>
    </div>
  );
}
