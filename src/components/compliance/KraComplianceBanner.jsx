import React, { useState } from 'react';
import { AlertTriangle, Shield, Upload, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { masterWalletAPI } from '../../common/services/masterWalletApi';
import toast from 'react-hot-toast';

export default function KraComplianceBanner({ compact = false }) {
  const qc = useQueryClient();
  const { data: compliance, isLoading } = useQuery({
    queryKey: ['master-wallet', 'compliance'],
    queryFn: () => masterWalletAPI.getCompliance(),
    staleTime: 60_000,
  });

  const [kraPin, setKraPin] = useState('');

  const updateKra = useMutation({
    mutationFn: () => masterWalletAPI.updateKraPin(kraPin.trim()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['master-wallet'] });
      qc.invalidateQueries({ queryKey: ['freelancer', 'wallet'] });
      toast.success('KRA PIN saved');
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading || !compliance) return null;

  const warnings = compliance.warnings || [];
  const taxLocked = compliance.taxLocked || compliance.complianceStatus === 'TAX_LOCKED';
  const progress = compliance.kraProgressPercent ?? 0;

  if (!taxLocked && warnings.length === 0 && compliance.kraPinVerified) return null;

  return (
    <div
      className={`rounded-2xl border p-4 md:p-5 ${
        taxLocked
          ? 'bg-red-50 border-red-200'
          : progress >= 80
            ? 'bg-amber-50 border-amber-200'
            : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {taxLocked ? (
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
        ) : (
          <Shield className="w-6 h-6 text-amber-600 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-zinc-900 text-sm md:text-base">
            {taxLocked ? 'Withdrawals locked — KRA compliance required' : 'KRA compliance'}
          </h3>
          <p className="text-xs md:text-sm text-zinc-600 mt-1">
            {taxLocked
              ? `Cumulative earnings have reached KES ${(compliance.kraThreshold || 50000).toLocaleString()}. Verify your KRA PIN to unlock payouts.`
              : `Earnings progress: ${progress}% toward KES ${(compliance.kraThreshold || 50000).toLocaleString()} threshold.`}
          </p>

          {!compact && (
            <div className="mt-3 h-2 bg-white/80 rounded-full overflow-hidden border border-zinc-200">
              <div
                className={`h-full transition-all ${taxLocked ? 'bg-red-500' : 'bg-[#4C1D95]'}`}
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          )}

          {!compliance.kraPinVerified && (
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={kraPin}
                onChange={(e) => setKraPin(e.target.value.toUpperCase())}
                placeholder="KRA PIN e.g. A123456789Z"
                className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-lg bg-white"
              />
              <button
                type="button"
                disabled={updateKra.isPending || kraPin.length < 5}
                onClick={() => updateKra.mutate()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#4C1D95] text-white text-sm font-bold rounded-lg disabled:opacity-50"
              >
                {updateKra.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Verify PIN
              </button>
            </div>
          )}

          {taxLocked && (
            <p className="text-xs text-red-700 mt-2 font-medium">
              Withdraw button is disabled until KRA PIN is verified. Enforcement is applied server-side.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


