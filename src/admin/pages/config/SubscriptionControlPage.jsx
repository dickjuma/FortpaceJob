import React, { useEffect, useState } from 'react';
import { CreditCard, Loader2, ToggleLeft, ToggleRight, Users, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { subscriptionAdminAPI } from '../../../common/services/subscriptionApi';

export default function SubscriptionControlPage() {
  const [loading, setLoading] = useState(true);
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);
  const [members, setMembers] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [settings, list] = await Promise.all([
        subscriptionAdminAPI.getSettings(),
        subscriptionAdminAPI.listMembers(),
      ]);
      setPaymentsEnabled(Boolean(settings?.subscriptionPaymentsEnabled));
      setMembers(Array.isArray(list) ? list : []);
    } catch (e) {
      toast.error(e.message || 'Failed to load subscription settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const togglePayments = async () => {
    setSaving(true);
    try {
      const next = !paymentsEnabled;
      await subscriptionAdminAPI.updateSettings(next);
      setPaymentsEnabled(next);
      toast.success(next ? 'Subscription payments enabled' : 'Subscription payments disabled');
    } catch (e) {
      toast.error(e.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const activatePlan = async (userId, planId) => {
    try {
      await subscriptionAdminAPI.activateUser(userId, planId);
      toast.success(`Activated ${planId} for ${userId}`);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#4C1D95]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
          <CreditCard className="text-[#4C1D95]" /> Subscription control
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Enable paid plan checkout (M-Pesa / wallet). When off, only Basic (KES 0) is available on the pricing page.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-bold text-zinc-900">Accept subscription payments</p>
          <p className="text-xs text-zinc-500 mt-1">
            SME (KES 1,000) and Corporate (KES 5,000) — activates after M-Pesa callback or manual approval below.
          </p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={togglePayments}
          className="flex items-center gap-2 text-[#4C1D95] font-bold"
        >
          {paymentsEnabled ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-zinc-400" />}
          {paymentsEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-zinc-400" />
          <h2 className="font-bold">Members ({members.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left">
              <tr>
                <th className="p-3 font-bold">User</th>
                <th className="p-3 font-bold">Plan</th>
                <th className="p-3 font-bold">Status</th>
                <th className="p-3 font-bold">Rec. left</th>
                <th className="p-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.userId} className="border-t border-zinc-100">
                  <td className="p-3 font-mono text-xs">{m.userId}</td>
                  <td className="p-3">{m.plan?.name || m.planId}</td>
                  <td className="p-3">{m.status}</td>
                  <td className="p-3">
                    {m.remaining?.gigRecommendations == null ? '∞' : m.remaining.gigRecommendations}
                  </td>
                  <td className="p-3 flex gap-1">
                    {['sme', 'corporate'].map((pid) => (
                      <button
                        key={pid}
                        type="button"
                        onClick={() => activatePlan(m.userId, pid)}
                        className="px-2 py-1 text-xs font-bold rounded-lg bg-zinc-100 hover:bg-[#4C1D95]/10 text-zinc-700"
                      >
                        → {pid}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#4C1D95]/5 border border-[#4C1D95]/20 rounded-xl p-4 text-sm text-zinc-700 flex gap-2">
        <Zap className="w-5 h-5 text-[#4C1D95] shrink-0" />
        <p>
          Higher tiers get more monthly gig recommendations and stronger ranking in Find Talent matching.
          Corporate subscribers are favoured in the recommendation engine.
        </p>
      </div>
    </div>
  );
}


