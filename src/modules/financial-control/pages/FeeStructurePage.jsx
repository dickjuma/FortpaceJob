import React, { useEffect, useState } from 'react';
import {
  Settings, Percent, DollarSign, AlertCircle, Save, Loader2, Plus, ToggleLeft, ToggleRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchFeeRules,
  fetchFeeSettings,
  updateFeeSettings,
  createFeeRule,
  toggleFeeRule,
} from '../../../admin/api/financial.api';
import { useQueryClient } from '@tanstack/react-query';
import { FORTE_VAULT_SPEC } from '../config/forteVaultSpec';

export default function FeeStructurePage() {
  const qc = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    platformCommissionPercent: 10,
    highVolumeCommissionPercent: 10,
    highVolumeThresholdKes: 1000000,
    escrowFeePercent: 2.5,
    withdrawalMpesaFixedKes: 50,
    withdrawalBankFixedKes: 150,
  });
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({
    name: '',
    appliesTo: 'ESCROW_RELEASE',
    type: 'PERCENTAGE',
    value: 0.05,
  });

  const load = async () => {
    setLoading(true);
    try {
      const [feeSettings, feeRules] = await Promise.all([
        fetchFeeSettings().catch(() => null),
        fetchFeeRules().catch(() => []),
      ]);
      if (feeSettings) setSettings((s) => ({ ...s, ...feeSettings }));
      setRules(Array.isArray(feeRules) ? feeRules : []);
    } catch (err) {
      toast.error(err.message || 'Failed to load fee configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateFeeSettings(settings);
      qc.invalidateQueries({ queryKey: ['financial', 'fees'] });
      toast.success('Fee settings saved. New transactions will use these rates.');
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddRule = async () => {
    if (!newRule.name.trim()) {
      toast.error('Rule name is required');
      return;
    }
    try {
      await createFeeRule(newRule);
      setNewRule({ name: '', appliesTo: 'ESCROW_RELEASE', type: 'PERCENTAGE', value: 0.05 });
      await load();
      toast.success('Fee rule added');
    } catch (err) {
      toast.error(err.message || 'Failed to add rule');
    }
  };

  const handleToggleRule = async (ruleId) => {
    try {
      await toggleFeeRule(ruleId);
      await load();
    } catch (err) {
      toast.error(err.message || 'Failed to toggle rule');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#14a800]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#14a800]/10 text-[#14a800] rounded-xl">
              <Settings size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              Fee &amp; escrow cuts
            </h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Control platform commission and per-transaction cuts applied when escrow is funded or released.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-4 py-2 bg-[#14a800] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#118a00] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save global settings
        </button>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800">
        <AlertCircle size={20} className="shrink-0 mt-0.5" />
        <div className="text-xs font-medium space-y-1">
          <p>
            Forte Vault v1 — escrow-only transit (not a bank). Purpose-bound deposits only. Default{' '}
            {FORTE_VAULT_SPEC.defaults.platformCommissionPercent}% project fee /{' '}
            {FORTE_VAULT_SPEC.defaults.providerPayoutPercent}% provider payout.
          </p>
          <p>
            Withdrawals: min KES {FORTE_VAULT_SPEC.withdrawal.minKes}, max KES{' '}
            {FORTE_VAULT_SPEC.withdrawal.maxDailyKes}/day, {FORTE_VAULT_SPEC.withdrawal.safetyHoldHours}h safety hold
            after release. M-Pesa B2C fees passed through.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <Percent size={18} className="text-[#14a800]" /> Platform commission
          </h2>
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Base commission (%)</span>
              <input
                type="number"
                step="0.1"
                value={settings.platformCommissionPercent}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, platformCommissionPercent: Number(e.target.value) }))
                }
                className="mt-2 w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                High-volume tier (%)
              </span>
              <input
                type="number"
                step="0.1"
                value={settings.highVolumeCommissionPercent}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, highVolumeCommissionPercent: Number(e.target.value) }))
                }
                className="mt-2 w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                High-volume threshold (KES)
              </span>
              <input
                type="number"
                value={settings.highVolumeThresholdKes}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, highVolumeThresholdKes: Number(e.target.value) }))
                }
                className="mt-2 w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Escrow fee (%)</span>
              <input
                type="number"
                step="0.1"
                value={settings.escrowFeePercent}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, escrowFeePercent: Number(e.target.value) }))
                }
                className="mt-2 w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold"
              />
            </label>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <DollarSign size={18} className="text-emerald-600" /> Withdrawal fees
          </h2>
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">M-PESA fixed (KES)</span>
              <input
                type="number"
                value={settings.withdrawalMpesaFixedKes}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, withdrawalMpesaFixedKes: Number(e.target.value) }))
                }
                className="mt-2 w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Bank transfer (KES)</span>
              <input
                type="number"
                value={settings.withdrawalBankFixedKes}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, withdrawalBankFixedKes: Number(e.target.value) }))
                }
                className="mt-2 w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Additional fee rules</h2>
        <div className="space-y-3 mb-6">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-zinc-50"
            >
              <div>
                <p className="font-bold text-sm">{rule.name}</p>
                <p className="text-xs text-zinc-500">
                  {rule.appliesTo} · {rule.type === 'PERCENTAGE' ? `${(rule.value * 100).toFixed(2)}%` : `KES ${rule.value}`}
                </p>
              </div>
              <button type="button" onClick={() => handleToggleRule(rule.id)} className="text-[#14a800]">
                {rule.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-zinc-400" />}
              </button>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-4 gap-3 items-end border-t border-zinc-100 pt-6">
          <input
            placeholder="Rule name"
            value={newRule.name}
            onChange={(e) => setNewRule((r) => ({ ...r, name: e.target.value }))}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <select
            value={newRule.appliesTo}
            onChange={(e) => setNewRule((r) => ({ ...r, appliesTo: e.target.value }))}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="ESCROW_RELEASE">Escrow release</option>
            <option value="ESCROW_FUND">Escrow fund</option>
            <option value="WITHDRAWAL">Withdrawal</option>
            <option value="TRANSACTION">All transactions</option>
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Value (0.05 = 5%)"
            value={newRule.value}
            onChange={(e) => setNewRule((r) => ({ ...r, value: Number(e.target.value) }))}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <button
            type="button"
            onClick={handleAddRule}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-bold"
          >
            <Plus size={16} /> Add cut
          </button>
        </div>
      </div>
    </div>
  );
}
