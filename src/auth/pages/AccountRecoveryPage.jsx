import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Mail, KeyRound } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/ui/Button';

export default function AccountRecoveryPage() {
  return (
    <AuthLayout
      title="Account Recovery"
      subtitle="Use these verified steps if you lost access to your authenticator or recovery codes."
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-[#14a800]/10 dark:bg-[#14a800]/30 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-[#14a800] dark:text-[#14a800]" />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#14a800]" />
            Step 1
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Try your saved recovery codes first. They are the fastest and safest way to regain access without delaying your account.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#14a800]" />
            Step 2
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            If recovery codes are unavailable, contact support from your registered account email so the team can manually verify ownership.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-300">
          For security, recovery requests should include your account email, approximate last sign-in date, and any recent billing or profile activity you can confirm.
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={() => window.open('mailto:support@forte.space?subject=Account%20Recovery')}
        >
          Contact Support
        </Button>
      </div>

      <div className="mt-8 text-center">
        <Link to="/auth/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to log in
        </Link>
      </div>
    </AuthLayout>
  );
}
