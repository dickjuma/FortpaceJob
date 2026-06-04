import React, { useEffect, useState } from 'react';
import { Zap, Target, UserPlus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getToken, API_BASE_URL } from '../../common/services/api';

export default function AIRecommendationFeed() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/search/recommendations?limit=8`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const body = await res.json().catch(() => ({}));
        const data = body?.data ?? body;
        const freelancers = (data?.freelancers || data?.talents || []).map((f) => ({
          id: f.id || f.userId,
          name: f.name || 'Professional',
          role: f.title || f.roleName || 'Freelancer',
          matchScore: f.matchScore || 85,
          reason: 'Matched by skills, category, and subscription tier boost.',
          availability: 'Available',
          rate: f.hourlyRate ? `KES ${f.hourlyRate}/hr` : 'View profile',
        }));
        setMatches(freelancers);
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-gradient-to-r from-[#2bb75c] to-[#1d8d38] rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h1 className="text-2xl font-bold">AI Talent Matchmaker</h1>
            </div>
            <p className="text-white/90 text-lg leading-relaxed">
              Ranked freelancers from your profile, skills, and plan-based matching boosts.
            </p>
          </div>
          <Link
            to="/find-talent"
            className="flex-shrink-0 px-6 py-3 bg-white text-[#2bb75c] font-bold rounded-xl shadow-lg hover:bg-zinc-100 transition-colors flex items-center"
          >
            Browse talent <Target className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#2bb75c]" />
        </div>
      ) : matches.length === 0 ? (
        <p className="text-center text-zinc-500 py-12">Complete your profile to unlock personalized matches.</p>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Recommendations</h2>
          {matches.map((match, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              key={match.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-[#2bb75c]/20 shadow-sm overflow-hidden flex flex-col md:flex-row relative"
            >
              <div className="md:w-48 bg-[#2bb75c]/5 p-6 flex flex-col items-center justify-center border-r border-[#2bb75c]/20">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{match.matchScore}%</span>
                <span className="text-sm font-bold text-[#2bb75c] uppercase tracking-wide">Match</span>
              </div>
              <div className="p-6 flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{match.name}</h3>
                <p className="text-[#2bb75c] font-medium">{match.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{match.reason}</p>
                <div className="mt-4 flex gap-3">
                  <Link
                    to={`/freelancer/${match.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#2bb75c] text-white text-sm font-bold rounded-lg"
                  >
                    <UserPlus className="w-4 h-4" /> View profile
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

