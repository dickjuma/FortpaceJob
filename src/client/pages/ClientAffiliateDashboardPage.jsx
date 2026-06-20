import React from 'react';
import toast from 'react-hot-toast';
import { Handshake, TrendingUp, Users, DollarSign, Copy, AlertCircle, BarChart3 } from 'lucide-react';
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

export default function ClientAffiliateDashboardPage() {
  const { data, isLoading, error, refetch } = useReferralSummary();
  const referrals = Array.isArray(data?.referrals) ? data.referrals : [];
  const referralLink = data?.referralLink || '';
  const conversions = data?.conversions || referrals.length || 0;
  const clicks = data?.clicks || 0;
  const pending = data?.pendingPayout || 0;
  const total = data?.totalEarnings || pending || 0;

  const copyAffiliateLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    toast.success('Affiliate link copied');
  };

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#4C1D95] to-[#22C55E] p-6 text-white sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                  <Handshake className="h-4 w-4" />
                  Client Workspace
                </div>
                <h1 className="text-2xl font-black tracking-tight sm:text-4xl">Affiliate Dashboard</h1>
                <p className="mt-3 max-w-2xl text-sm font-medium text-white/85 sm:text-base">
                  Track affiliate link performance, campaign conversions, commissions, and payout status.
                </p>
              </div>
              <div className="hidden rounded-2xl bg-white/15 p-3 backdrop-blur sm:flex">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-b border-gray-200 p-6 sm:grid-cols-4 sm:p-8">
            <StatCard icon={TrendingUp} label="Clicks" value={clicks} sub="Affiliate traffic" />
            <StatCard icon={Users} label="Conversions" value={conversions} sub="Qualified signups" />
            <StatCard icon={DollarSign} label="Commission" value={`KES ${Number(total || 0).toLocaleString()}`} sub="Tracked revenue" />
            <StatCard icon={Handshake} label="Pending Payout" value={`KES ${Number(pending || 0).toLocaleString()}`} sub="Awaiting settlement" />
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-black text-gray-900">Affiliate Campaign Link</h2>
                    <p className="mt-1 text-sm text-gray-500">Use this link for campaigns, partner pages, and outreach.</p>
                  </div>
                  <button
                    onClick={copyAffiliateLink}
                    disabled={!referralLink}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#4C1D95] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                </div>
                {referralLink ? (
                  <div className="mt-4 rounded-xl bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700">
                    {referralLink}
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
                    Affiliate link will appear after your referral profile is available.
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
                  <p className="font-bold">Failed to load affiliate dashboard.</p>
                  <button onClick={() => refetch()} className="mt-3 rounded-lg bg-[#4C1D95] px-4 py-2 text-sm font-bold text-white">Retry</button>
                </div>
              ) : referrals.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
                  <Handshake className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <h2 className="text-lg font-black text-gray-900">No affiliate conversions yet</h2>
                  <p className="mt-2 text-sm text-gray-500">Share your campaign link to begin tracking qualified referrals.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                    <thead className="bg-gray-50 text-left text-xs font-black uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-5 py-4">Campaign Referral</th>
                        <th className="px-5 py-4">Conversion</th>
                        <th className="px-5 py-4">Commission</th>
                        <th className="px-5 py-4 text-right">Payout</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {referrals.map((item, index) => (
                        <tr key={item.id || index} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <p className="font-bold text-gray-900">{item.name || item.email || item.username || 'Referral'}</p>
                            <p className="text-xs text-gray-500">{item.code || data?.referralCode || 'Campaign'}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-black text-green-700">{item.status || 'Converted'}</span>
                          </td>
                          <td className="px-5 py-4 font-black text-[#4C1D95]">KES {Number(item.commission || 0).toLocaleString()}</td>
                          <td className="px-5 py-4 text-right text-sm font-medium text-gray-700">{item.payoutStatus || 'Pending'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="text-sm font-black text-gray-900">Campaign Summary</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Click-throughs</span>
                    <span className="font-black text-gray-900">{clicks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Conversion rate</span>
                    <span className="font-black text-gray-900">{clicks ? `${Math.round((conversions / clicks) * 100)}%` : '0%'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Total commission</span>
                    <span className="font-black text-gray-900">KES {Number(total || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-[#4C1D95] p-5 text-white">
                <h2 className="text-sm font-black">Affiliate Focus</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Promote ForteSpace to teams, agencies, and freelancers who need verified hiring and delivery workflows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
