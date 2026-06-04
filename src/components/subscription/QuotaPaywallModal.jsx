import React from 'react';
import { Link } from 'react-router-dom';
import { X, Zap, ArrowRight } from 'lucide-react';

export default function QuotaPaywallModal({ open, onClose, title, message, quotaType = 'gig_recommendation' }) {
  if (!open) return null;

  const hint =
    quotaType === 'job_application'
      ? 'Upgrade to apply to more jobs this month.'
      : 'Upgrade to unlock more personalized gig and job recommendations.';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-zinc-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-zinc-700"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="w-14 h-14 rounded-2xl bg-[#2bb75c]/10 flex items-center justify-center mb-5">
          <Zap className="w-7 h-7 text-[#2bb75c]" />
        </div>
        <h2 className="text-xl font-black text-zinc-900 mb-2">{title || 'Monthly limit reached'}</h2>
        <p className="text-sm text-zinc-600 mb-2">{message}</p>
        <p className="text-xs text-zinc-500 mb-6">{hint}</p>
        <Link
          to="/pricing"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#2bb75c] hover:bg-[#1d8d38] text-white font-bold rounded-xl transition-colors"
        >
          View plans <ArrowRight className="w-4 h-4" />
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-3 py-2 text-sm font-semibold text-zinc-500 hover:text-zinc-800"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

