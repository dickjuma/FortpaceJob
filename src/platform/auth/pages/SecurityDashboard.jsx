import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Key, Smartphone, Link as LinkIcon, History, AlertTriangle } from 'lucide-react';

export default function SecurityDashboard() {
  const cards = [
    {
      title: "Active Sessions",
      description: "Manage devices and browsers currently signed in to your account.",
      icon: Smartphone,
      link: "/auth/sessions",
      color: "text-[#4C1D95]",
      bg: "bg-[#4C1D95]/5 dark:bg-[#4C1D95]/20"
    },
    {
      title: "Connected Accounts",
      description: "Manage Google and other third-party login providers.",
      icon: LinkIcon,
      link: "/auth/connected-accounts",
      color: "text-[#4C1D95]",
      bg: "bg-[#4C1D95]/5 dark:bg-[#4C1D95]/20"
    },
    {
      title: "Password & 2FA",
      description: "Update your password and manage two-factor authentication.",
      icon: Key,
      link: "/account-security",
      color: "text-[#4C1D95]",
      bg: "bg-[#4C1D95]/5 dark:bg-[#4C1D95]/20"
    },
    {
      title: "Suspicious Activity",
      description: "Review automated alerts and unusual login attempts.",
      icon: AlertTriangle,
      link: "/auth/suspicious-activity",
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-900/20"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-white dark:text-gray-900" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security & Privacy</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account security, sessions, and connected apps.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, idx) => (
          <Link key={idx} to={card.link} className="block group">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 h-full">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${card.bg}`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#4C1D95] transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


