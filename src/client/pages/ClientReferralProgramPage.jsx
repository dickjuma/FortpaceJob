import React from 'react';
import toast from 'react-hot-toast';
import { Gift, Users, TrendingUp, Copy, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { useReferralSummary } from '../services/clientHooks';

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#4C1D95] to-[#22C55E] text-white">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-2xl font-black text-gray-900">{value}</p>
      <p className="text-sm font-bold text-gray-700">{label}</p>
      <p className="mt-1 text-xs font-medium text-gray-500">{sub}</p>
    </div>
  );
}

export default function ClientReferralProgramPage() {
  const { data, isLoading, error, refetch } = useReferralSummary();
  const referrals = Array.isArray(data?.referrals) ? data.referrals : [];
  const referralCode = data?.referralCode || '';
  const referralLink = data?.referralLink || '';
  const conversions = data?.conversions || referrals.length || 0;
  const clicks = data?.clicks || 0;
  const rewards = data?.totalEarnings || data?.pendingPayout || 0;

  const copyReferralLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied');
  };

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#4C1D95] to-[#22C55E] p-6 text-white sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                  <Gift className="h-4 w-4" />
                  Client Workspace
                </div>
                <h1 className="text-2xl font-black tracking-tight sm:text-4xl">Referral Program</h1>
                <p className="mt-3 max-w-2xl text-sm font-medium text-white/85 sm:text-base">
                  Invite businesses and freelancers to ForteSpace and track referral rewards from live account activity.
                </p>
              </div>
              <div className="hidden rounded-2xl bg-white/15 p-3 backdrop-blur sm:flex">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-b border-gray-200 p-6 sm:grid-cols-3 sm:p-8">
            <StatCard icon={Users} label="Conversions" value={conversions} sub="Activated referrals" />
            <StatCard icon={TrendingUp} label="Clicks" value={clicks} sub="Referral traffic" />
            <StatCard icon={Gift} label="Rewards" value={`KES ${Number(rewards || 0).toLocaleString()}`} sub="Tracked commission" />
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-black text-gray-900">Your Referral Link</h2>
                    <p className="mt-1 text-sm text-gray-500">Share this link with teams, freelancers, or partners.</p>
                  </div>
                  <button
                    onClick={copyReferralLink}
                    disabled={!referralLink}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#4C1D95] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                </div>
                {referralLink ? (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700">
                    <LinkIcon className="h-4 w-4 text-[#4C1D95]" />
                    <span className="truncate">{referralLink}</span>
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
                    Referral link will appear after your profile summary is available.
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />)}
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                  <AlertCircle className="mb-3 h-10 w-10" />
                  <p className="font-bold">Failed to load referral summary.</p>
                  <button onClick={() => refetch()} className="mt-3 rounded-lg bg-[#4C1D95] px-4 py-2 text-sm font-bold text-white">Retry</button>
                </div>
              ) : referrals.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
                  <Gift className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <h2 className="text-lg font-black text-gray-900">No referrals yet</h2>
                  <p className="mt-2 text-sm text-gray-500">Share your link to start tracking activated accounts.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                    <thead className="bg-gray-50 text-left text-xs font-black uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-5 py-4">Referral</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Commission</th>
                        <th className="px-5 py-4 text-right">Code</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {referrals.map((item, index) => (
                        <tr key={item.id || index} className="hover:bg-gray-50">
                          <td className="px-5 py-4 font-bold text-gray-900">{item.name || item.email || item.username || 'Referral'}</td>
                          <td className="px-5 py-4">
                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-black text-green-700">{item.status || 'Converted'}</span>
                          </td>
                          <td className="px-5 py-4 font-bold text-[#4C1D95]">KES {Number(item.commission || 0).toLocaleString()}</td>
                          <td className="px-5 py-4 text-right text-gray-500">{item.code || referralCode || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="text-sm font-black text-gray-900">Program Snapshot</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Referral code</span>
                    <span className="font-black text-gray-900">{referralCode || 'Pending'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Pending payout</span>
                    <span className="font-black text-gray-900">KES {Number(data?.pendingPayout || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Total earnings</span>
                    <span className="font-black text-gray-900">KES {Number(data?.totalEarnings || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-[#4C1D95] p-5 text-white">
                <h2 className="text-sm font-black">Referral Tip</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Use your referral link in proposals, onboarding messages, and partner outreach to track every activated account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
