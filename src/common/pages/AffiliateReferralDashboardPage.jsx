import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Copy, Link as LinkIcon, DollarSign, Users, MousePointerClick, 
  ArrowUpRight, ArrowDownRight, CreditCard, CheckCircle, BarChart3
} from 'lucide-react';

const mockStats = {
  totalEarnings: 12450.00,
  pendingPayout: 850.50,
  clicks: 12453,
  conversions: 342,
  clickTrend: 12.5,
  conversionTrend: 4.2
};

const mockReferrals = [
  { id: 1, user: 'Sarah Jenkins', date: '2026-05-20', plan: 'Pro Annual', commission: 120.00, status: 'Paid' },
  { id: 2, user: 'Mike Ross', date: '2026-05-18', plan: 'Basic Monthly', commission: 15.00, status: 'Pending' },
  { id: 3, user: 'TechFlow Inc', date: '2026-05-15', plan: 'Enterprise', commission: 450.00, status: 'Paid' },
  { id: 4, user: 'Elena Rodriguez', date: '2026-05-12', plan: 'Pro Monthly', commission: 30.00, status: 'Paid' },
  { id: 5, user: 'David Kim', date: '2026-05-10', plan: 'Basic Annual', commission: 150.00, status: 'Pending' },
];

export default function AffiliateReferralDashboardPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://forte.com/ref/johndoe';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Affiliate Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your referrals, commissions, and payouts.</p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors">
          <CreditCard className="w-4 h-4 mr-2" />
          Request Payout
        </button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</h3>
            <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600 dark:text-brand-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">${mockStats.totalEarnings.toLocaleString()}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Payout</h3>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">${mockStats.pendingPayout.toLocaleString()}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clicks</h3>
            <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600 dark:text-brand-400">
              <MousePointerClick className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{mockStats.clicks.toLocaleString()}</div>
          <div className="flex items-center text-sm text-green-600 dark:text-green-400">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>{mockStats.clickTrend}% vs last month</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Conversions</h3>
            <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600 dark:text-brand-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{mockStats.conversions.toLocaleString()}</div>
          <div className="flex items-center text-sm text-green-600 dark:text-green-400">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>{mockStats.conversionTrend}% vs last month</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Referral Link Generator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Referral Link</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Share this link with your network to earn up to 20% recurring commission for their first year.
          </p>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              readOnly
              value={referralLink}
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-surface dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                onClick={handleCopy}
                className="p-2 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                title="Copy link"
              >
                {copied ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Custom Link Generator</h3>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Campaign ID (optional)</label>
              <input type="text" placeholder="e.g. twitter-promo" className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white" />
            </div>
            <button className="w-full py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg text-sm transition-colors">
              Generate Link
            </button>
          </div>
        </motion.div>

        {/* Commission Chart Placeholder */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Earnings Overview</h2>
            <select className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-300 focus:outline-none">
              <option>Last 30 Days</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="flex-1 min-h-[250px] flex items-end justify-between gap-2 pb-6">
            {/* Mock Bar Chart */}
            {[40, 25, 60, 30, 80, 45, 90, 65, 100, 75, 110, 85].map((height, i) => (
              <div key={i} className="w-full relative group">
                <div 
                  className="bg-brand-100 dark:bg-brand-900/30 hover:bg-brand-500 dark:hover:bg-brand-600 rounded-t-sm transition-all duration-300 w-full"
                  style={{ height: `${height}%` }}
                ></div>
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -tranzinc-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 transition-opacity">
                  ${(height * 4.5).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2 mt-auto border-t border-gray-100 dark:border-gray-800 pt-4">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </motion.div>
      </div>

      {/* Recent Referrals Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Referrals</h2>
          <button className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface dark:bg-gray-800/50">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date Signed Up</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {mockReferrals.map((ref) => (
                <tr key={ref.id} className="hover:bg-surface dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{ref.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{ref.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{ref.plan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">${ref.commission.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ref.status === 'Paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {ref.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
