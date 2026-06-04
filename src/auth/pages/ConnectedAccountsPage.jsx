import React from 'react';
import { ArrowLeft, Link as LinkIcon, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const providers = [
  {
    provider: 'Google',
    status: 'Available when Google OAuth is configured for this environment.',
  },
  {
    provider: 'GitHub',
    status: 'Planned. Enable this provider once backend OAuth credentials are configured.',
  },
  {
    provider: 'LinkedIn',
    status: 'Planned. Enable this provider once backend OAuth credentials are configured.',
  },
  {
    provider: 'Apple',
    status: 'Planned. Enable this provider once backend OAuth credentials are configured.',
  },
];

export default function ConnectedAccountsPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <Link to="/auth/security" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Security
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Connected Accounts</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Review which sign-in providers are enabled for this environment before allowing account linking.</p>
      </div>

      <div className="space-y-4">
        {providers.map((account) => (
          <div key={account.provider} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-[#2bb75c]" />
                  {account.provider}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{account.status}</p>
              </div>

              <Button variant="secondary" size="sm" disabled icon={ShieldCheck}>
                Not linked
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

