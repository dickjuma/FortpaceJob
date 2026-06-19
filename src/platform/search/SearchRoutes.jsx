import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TalentDiscoveryPage from './pages/TalentDiscoveryPage';
import AIRecommendationFeed from './pages/AIRecommendationFeed';
import MatchingInsightsPage from './pages/MatchingInsightsPage';
import GigMarketplacePage from './pages/GigMarketplacePage';
import GigDetailsPage from './pages/GigDetailsPage';

export default function SearchRoutes() {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface dark:bg-gray-950 min-h-screen">
      <Routes>
        <Route path="talent" element={<TalentDiscoveryPage />} />
        <Route path="gigs" element={<GigMarketplacePage />} />
        <Route path="gigs/:id" element={<GigDetailsPage />} />
        <Route path="ai-feed" element={<AIRecommendationFeed />} />
        <Route path="insights" element={<MatchingInsightsPage />} />
        {/* Default to Talent Discovery */}
        <Route path="/" element={<TalentDiscoveryPage />} />
      </Routes>
    </div>
  );
}
