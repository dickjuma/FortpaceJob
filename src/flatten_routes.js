const fs = require('fs');

const clientRoutes = fs.readFileSync('./client/ClientRoutes.jsx', 'utf8');
const freelancerRoutes = fs.readFileSync('./freelancer/FreelancerRoutes.jsx', 'utf8');
const authRoutes = fs.readFileSync('./auth/AuthRoutes.jsx', 'utf8');

const cleanAppJsx = `import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './common/authStore';
import AppShell from './admin/components/layout/AppShell';
import DashboardPage from './admin/pages/DashboardPage';
import LoginPage from './admin/pages/LoginPage';
import AdminRoutes from './admin/AdminRoutes';

import AgencyRoutes from './agency/AgencyRoutes';
import SearchRoutes from './search/SearchRoutes';
import VerificationRoutes from './verification/VerificationRoutes';
import EscrowRoutes from './escrow/EscrowRoutes';
import LandingPage from './pages/shared/LandingPage';
import GlobalHomepage from './public/pages/GlobalHomepage';
import GlobalSearchPage from './public/pages/GlobalSearchPage';
import PublicFreelancerProfilePage from './public/pages/PublicFreelancerProfilePage';
import PublicGigPage from './public/pages/PublicGigPage';
import HelpCenterPage from './public/pages/HelpCenterPage';
import MessagingCenterPage from './common/pages/MessagingCenterPage';
import NotificationsCenterPage from './common/pages/NotificationsCenterPage';
import DisputeResolutionCenterPage from './common/pages/DisputeResolutionCenterPage';
import IdentityVerificationCenterPage from './common/pages/IdentityVerificationCenterPage';
import AccountSecurityCenterPage from './common/pages/AccountSecurityCenterPage';
import TrustScoreDashboardPage from './common/pages/TrustScoreDashboardPage';
import FeaturedServicesMarketplacePage from './public/pages/FeaturedServicesMarketplacePage';
import PromotionsCouponsCenterPage from './common/pages/PromotionsCouponsCenterPage';
import AffiliateReferralDashboardPage from './common/pages/AffiliateReferralDashboardPage';
import CommunityForumPage from './public/pages/CommunityForumPage';
import SuccessStoriesPage from './public/pages/SuccessStoriesPage';
import ClientLayout from './client/ClientLayout';
import FreelancerLayout from './freelancer/FreelancerLayout';

// INJECT_IMPORTS

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const ClientProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || user?.role !== 'CLIENT') {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

const FreelancerProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || user?.role !== 'FREELANCER') {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminRoutes />
            </AdminProtectedRoute>
          }
        />

        <Route path="/freelancer/:username" element={<PublicFreelancerProfilePage />} />
        <Route path="/agency/*" element={<AgencyRoutes />} />
        <Route path="/search" element={<GlobalSearchPage />} />
        <Route path="/search/*" element={<SearchRoutes />} />
        <Route path="/verification/*" element={<VerificationRoutes />} />
        <Route path="/escrow/*" element={<EscrowRoutes />} />

        <Route path="/gig/:slug" element={<PublicGigPage />} />
        <Route path="/help-center" element={<HelpCenterPage />} />
        <Route path="/messages" element={<MessagingCenterPage />} />
        <Route path="/notifications" element={<NotificationsCenterPage />} />
        <Route path="/disputes/:id" element={<DisputeResolutionCenterPage />} />
        
        <Route path="/signup" element={<Navigate to="/auth/register" replace />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />
        <Route path="/signin" element={<Navigate to="/auth/login" replace />} />
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        
        <Route path="/verification-center" element={<IdentityVerificationCenterPage />} />
        <Route path="/account-security" element={<AccountSecurityCenterPage />} />
        <Route path="/trust-score" element={<TrustScoreDashboardPage />} />
        <Route path="/featured-services" element={<FeaturedServicesMarketplacePage />} />
        <Route path="/promotions" element={<PromotionsCouponsCenterPage />} />
        <Route path="/affiliates" element={<AffiliateReferralDashboardPage />} />
        <Route path="/community" element={<CommunityForumPage />} />
        <Route path="/success-stories" element={<SuccessStoriesPage />} />

        <Route path="/marketplace" element={<GlobalHomepage />} />
        <Route path="/" element={<LandingPage />} />
        
        {/* INJECT_ROUTES */}

        <Route path="*" element={<div className="h-screen flex items-center justify-center font-bold">404 - Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
`;

let allImports = [];
let allRoutes = [];

function extractAndPrefix(content, prefix, isAuth) {
  const capPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1);
  const importRegex = /^import\s+({?[^}]+}?)\s+from\s+['"]([^'"]+)['"];/gm;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    let vars = match[1].trim();
    let originalPath = match[2];
    
    if (originalPath === 'react' || originalPath === 'react-router-dom' || originalPath.includes('ClientSidebar') || originalPath.includes('FreelancerSidebar') || originalPath.includes('authStore')) continue;
    
    let newPath = originalPath;
    if (newPath.startsWith('./')) {
      newPath = './' + prefix + '/' + newPath.slice(2);
    } else if (newPath.startsWith('../')) {
      newPath = './' + newPath.slice(3);
    }

    let newVars = vars;
    if (!vars.includes('{')) {
      newVars = capPrefix + vars;
      const re = new RegExp('\\\\b' + vars + '\\\\b', 'g');
      content = content.replace(re, newVars);
    }
    
    allImports.push('import ' + newVars + ' from "' + newPath + '";');
  }

  const routeRegex = /<Route\s+(index\s+)?(path=["'][^"']+["']\s+)?element=\{<([^>]+)>\}\s*\/>/g;
  while ((match = routeRegex.exec(content)) !== null) {
    let isIndex = !!match[1];
    let pathAttr = match[2] ? match[2].trim() : '';
    let comp = match[3];

    let pathStr = '';
    if (pathAttr) {
       pathStr = pathAttr.match(/["']([^"']+)["']/)[1];
    }
    
    if (pathStr === '/*' || pathStr === '*') continue;
    if (pathStr === 'login' || pathStr === 'register') continue;

    let finalPath = '';
    if (isIndex || pathStr === '') {
      finalPath = '/' + prefix;
    } else {
      finalPath = '/' + prefix + '/' + pathStr;
    }

    if (isAuth) {
      allRoutes.push('        <Route path="' + finalPath + '" element={<' + comp + ' />} />');
    } else {
      allRoutes.push('        <Route path="' + finalPath + '" element={' + '\\n' +
                     '          <' + capPrefix + 'ProtectedRoute>' + '\\n' +
                     '            <' + capPrefix + 'Layout>' + '\\n' +
                     '              <' + comp + ' />' + '\\n' +
                     '            </' + capPrefix + 'Layout>' + '\\n' +
                     '          </' + capPrefix + 'ProtectedRoute>' + '\\n' +
                     '        } />');
    }
  }
}

extractAndPrefix(clientRoutes, 'client', false);
extractAndPrefix(freelancerRoutes, 'freelancer', false);
extractAndPrefix(authRoutes, 'auth', true);

const finalAppJsx = cleanAppJsx
  .replace('// INJECT_IMPORTS', allImports.join('\\n'))
  .replace('{/* INJECT_ROUTES */}', allRoutes.join('\\n'));

fs.writeFileSync('./App.jsx', finalAppJsx);
console.log('Successfully flattened App.jsx safely!');
