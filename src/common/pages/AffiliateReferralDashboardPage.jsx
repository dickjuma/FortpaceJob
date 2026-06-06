import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Link as LinkIcon, DollarSign, Users, MousePointerClick, Loader2 } from 'lucide-react';
import { profileAPI } from '../services/api';

export default function AffiliateReferralDashboardPage() {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    referralLink: '',
    totalEarnings: 0,
    pendingPayout: 0,
    clicks: 0,
    conversions: 0,
    referrals: [],
  });

  useEffect(() => {
    profileAPI
      .getReferralSummary()
      .then((data) => setSummary({ ...summary, ...data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    if (!summary.referralLink) return;
    navigator.clipboard.writeText(summary.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#4C1D95]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900 mb-2">Affiliate & Referrals</h1>
        <p className="text-zinc-600 font-medium">Track referral performance from your Fort Space account.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <DollarSign className="w-8 h-8 text-success mb-3" />
          <div className="text-2xl font-black">KES {Number(summary.totalEarnings || 0).toLocaleString()}</div>
          <div className="text-sm text-zinc-500 font-medium">Total earnings</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <DollarSign className="w-8 h-8 text-amber-500 mb-3" />
          <div className="text-2xl font-black">KES {Number(summary.pendingPayout || 0).toLocaleString()}</div>
          <div className="text-sm text-zinc-500 font-medium">Pending payout</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <MousePointerClick className="w-8 h-8 text-[#4C1D95] mb-3" />
          <div className="text-2xl font-black">{summary.clicks || 0}</div>
          <div className="text-sm text-zinc-500 font-medium">Clicks</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <Users className="w-8 h-8 text-[#4C1D95] mb-3" />
          <div className="text-2xl font-black">{summary.conversions || 0}</div>
          <div className="text-sm text-zinc-500 font-medium">Conversions</div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-6 mb-8">
        <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Your referral link</label>
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-surface border border-zinc-200 rounded-xl font-mono text-sm truncate">
            <LinkIcon className="w-4 h-4 text-zinc-400 shrink-0" />
            {summary.referralLink || 'Link will appear after profile setup'}
          </div>
          <button type="button" onClick={handleCopy} disabled={!summary.referralLink} className="px-6 py-3 bg-[#4C1D95] text-white font-bold rounded-xl disabled:opacity-50 flex items-center gap-2">
            <Copy className="w-4 h-4" /> {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-100 font-bold text-zinc-900">Referral history</div>
        {summary.referrals?.length ? (
          <div className="divide-y divide-zinc-100">
            {summary.referrals.map((ref) => (
              <div key={ref.id || ref.user} className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-bold text-zinc-900">{ref.user || ref.name}</div>
                  <div className="text-sm text-zinc-500">{ref.plan} • {ref.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-success">KES {Number(ref.commission || 0).toLocaleString()}</div>
                  <div className="text-xs font-bold text-zinc-400 uppercase">{ref.status}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-zinc-500 font-medium">No referrals recorded yet. Share your link to get started.</div>
        )}
      </div>
    </div>
  );
}


