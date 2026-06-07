import React, { useState } from 'react';
import ClientSidebar from './components/ClientSidebar';
import ClientHeader from './components/ClientHeader';
import { SocketProvider } from '../common/context/SocketContext';
import { getToken } from '../common/services/api';

export default function ClientLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SocketProvider token={getToken()}>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <ClientSidebar isMobileOpen={isSidebarOpen} setIsMobileOpen={setIsSidebarOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Global Header */}
          <ClientHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

          {/* Page Content Viewport */}
          <main className="flex-1 overflow-y-auto bg-gray-50 relative">
            {/* Subtle global gradient background */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-success/5 via-gray-50 to-gray-50"></div>

            <div className="relative z-10 w-full h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SocketProvider>
  );
}
