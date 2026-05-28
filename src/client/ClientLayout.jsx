import React from 'react';
import ClientSidebar from './components/ClientSidebar';
import ClientHeader from './components/ClientHeader';

export default function ClientLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <ClientSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Global Header */}
        <ClientHeader />
        
        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-gray-50 relative">
          {/* Subtle global gradient background */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-vivid-lavender/5 via-gray-50 to-gray-50"></div>
          
          <div className="relative z-10 w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
