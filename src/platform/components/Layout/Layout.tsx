// @ts-nocheck
import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';



export const Layout = ({ children }: any) => {
  return (
    <div className="flex h-screen overflow-hidden bg-light-gray font-sans text-text-primary">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <TopNav />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-7xl mx-auto w-full animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
