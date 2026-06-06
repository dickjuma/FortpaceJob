import React from 'react';
import { Outlet } from 'react-router-dom';
import MarketplaceNavbar from '../components/shared/MarketplaceNavbar';
import MarketplaceFooter from '../components/shared/MarketplaceFooter';

const MarketplaceLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-surface text-surface-dark selection:bg-accent-light selection:text-[#4C1D95]">
      <MarketplaceNavbar />
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      <MarketplaceFooter />
    </div>
  );
};

export default MarketplaceLayout;


