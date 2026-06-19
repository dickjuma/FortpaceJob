import React from 'react';
import { AlertTriangle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function SuspiciousActivityReviewPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <Link to="/auth/security" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Security
      </Link>

      <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm dark:border-amber-900/30 dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center dark:bg-amber-900/20 dark:text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Suspicious Activity Review</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Use this page when the platform flags unusual sign-in behavior on your account.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950/40">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">No unresolved alerts right now</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            If an unusual login is detected, it will appear here with location details and recommended steps. In the meantime, you can review your active sessions or reset your password if anything feels off.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button variant="primary" icon={ShieldCheck} onClick={() => window.location.assign('/auth/sessions')}>
            Review active sessions
          </Button>
          <Button variant="secondary" onClick={() => window.location.assign('/auth/forgot-password')}>
            Reset password
          </Button>
        </div>
      </div>
    </div>
  );
}
