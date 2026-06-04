import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const freelancerLinks = [
  { label: 'Dashboard', path: '/freelancer/dashboard' },
  { label: 'My Business', path: '/freelancer/orders' },
  { label: 'My Gigs', path: '/freelancer/gigs' },
  { label: 'Analytics', path: '/freelancer/analytics' },
  { label: 'Earnings', path: '/freelancer/wallet' },
  { label: 'Buyer Requests', path: '/freelancer/requests' },
];

const clientLinks = [
  { label: 'Dashboard', path: '/client/dashboard' },
  { label: 'Manage Orders', path: '/client/orders' },
  { label: 'Post a Request', path: '/client/post-job' },
  { label: 'Manage Requests', path: '/client/proposals' },
  { label: 'Billing', path: '/client/wallet' },
  { label: 'Saved Talent', path: '/client/favorites' },
];

const DashboardSubNav = ({ role = 'FREELANCER' }) => {
  const location = useLocation();
  const links = role === 'FREELANCER' ? freelancerLinks : clientLinks;

  return (
    <div className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-sm overflow-x-auto custom-scrollbar sticky top-16 z-[90]">
      <div className="flex items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-14">
        <div className="flex space-x-1 sm:space-x-4 min-w-max">
          {links.map((link) => {
            const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-4 text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-[#2bb75c] dark:text-[#2bb75c]'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2bb75c] dark:bg-#2bb75c] rounded-t-full"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardSubNav;

