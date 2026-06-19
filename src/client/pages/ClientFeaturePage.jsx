import React from 'react';
import {
  Sparkles,
  FileSignature,
  Award,
  ShieldAlert,
  BellRing,
  Gift,
  Handshake,
  Video,
  ScrollText,
  ArrowRight,
  CheckCircle2,
  Users,
  BarChart3,
} from 'lucide-react';

const FEATURE_CONFIG = {
  'Video Interview Room': {
    icon: Video,
    description: 'Run structured video interviews, review notes, and move candidates through your hiring workflow.',
    cards: [
      { title: 'Active Rooms', value: '0', label: 'Live interview sessions' },
      { title: 'Scheduled Today', value: '0', label: 'Upcoming candidate calls' },
      { title: 'Interview Notes', value: '0', label: 'Saved evaluation notes' },
    ],
  },
  'NDA Management': {
    icon: FileSignature,
    description: 'Create, send, track, and store NDAs before sharing confidential project details.',
    cards: [
      { title: 'Pending Signatures', value: '0', label: 'Waiting for freelancer approval' },
      { title: 'Active NDAs', value: '0', label: 'Signed and enforceable agreements' },
      { title: 'Expired NDAs', value: '0', label: 'Requires renewal review' },
    ],
  },
  'Skill Assessments': {
    icon: Award,
    description: 'Invite candidates to skill tests and compare verified assessment results before hiring.',
    cards: [
      { title: 'Assessments Sent', value: '0', label: 'Pending candidate completion' },
      { title: 'Completed', value: '0', label: 'Ready for review' },
      { title: 'Average Score', value: '0%', label: 'Across completed tests' },
    ],
  },
  'Audit Logs': {
    icon: ScrollText,
    description: 'Review workspace actions, hiring decisions, payment events, and compliance history.',
    cards: [
      { title: 'Recent Events', value: '0', label: 'Last 30 days' },
      { title: 'Policy Changes', value: '0', label: 'Tracked configuration updates' },
      { title: 'Security Events', value: '0', label: 'Requires review' },
    ],
  },
  'Risk & Fraud Center': {
    icon: ShieldAlert,
    description: 'Monitor account risk, suspicious activity, payment anomalies, and dispute signals.',
    cards: [
      { title: 'Risk Alerts', value: '0', label: 'Active warnings' },
      { title: 'Flagged Users', value: '0', label: 'Needs review' },
      { title: 'Fraud Score', value: 'Low', label: 'Current workspace risk' },
    ],
  },
  'Notifications Center': {
    icon: BellRing,
    description: 'Manage proposal, payment, contract, interview, and system notifications in one place.',
    cards: [
      { title: 'Unread', value: '0', label: 'Pending notifications' },
      { title: 'Proposal Alerts', value: '0', label: 'New candidate activity' },
      { title: 'Payment Alerts', value: '0', label: 'Billing and escrow updates' },
    ],
  },
  'Referral Program': {
    icon: Gift,
    description: 'Invite businesses and freelancers to ForteSpace and track referral rewards.',
    cards: [
      { title: 'Referrals Sent', value: '0', label: 'Invitations shared' },
      { title: 'Conversions', value: '0', label: 'Activated accounts' },
      { title: 'Rewards', value: 'KES 0', label: 'Available rewards' },
    ],
  },
  'Affiliate Dashboard': {
    icon: Handshake,
    description: 'Track affiliate links, campaign performance, commissions, and payout status.',
    cards: [
      { title: 'Clicks', value: '0', label: 'Campaign traffic' },
      { title: 'Conversions', value: '0', label: 'Qualified signups' },
      { title: 'Commission', value: 'KES 0', label: 'Pending payout' },
    ],
  },
  'Activity Logs': {
    icon: ScrollText,
    description: 'Track workspace activity, member actions, project updates, and administrative events.',
    cards: [
      { title: 'Events', value: '0', label: 'Recent workspace activity' },
      { title: 'Members Active', value: '0', label: 'Active team members' },
      { title: 'Projects Updated', value: '0', label: 'Tracked project changes' },
    ],
  },
};

function FeatureCard({ title, value, label }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-gray-900">{title}</p>
      <p className="mt-3 text-3xl font-black text-[#4C1D95]">{value}</p>
      <p className="mt-1 text-xs font-medium text-gray-500">{label}</p>
    </div>
  );
}

export default function ClientFeaturePage({
  title = 'Feature Workspace',
  description,
  cards = [],
}) {
  const config = FEATURE_CONFIG[title] || {
    icon: Sparkles,
    description: description || 'This workspace is ready for your next workflow.',
    cards: cards.length ? cards : [
      { title: 'Items', value: '0', label: 'Ready to connect to live data' },
      { title: 'Pending Actions', value: '0', label: 'No outstanding tasks' },
      { title: 'Completion', value: '0%', label: 'Workflow readiness' },
    ],
  };

  const Icon = config.icon;
  const featureCards = cards.length ? cards : config.cards;

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#4C1D95] to-[#22C55E] p-6 text-white sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                  <Icon className="h-4 w-4" />
                  Client Workspace
                </div>
                <h1 className="text-2xl font-black tracking-tight sm:text-4xl">{title}</h1>
                <p className="mt-3 max-w-2xl text-sm font-medium text-white/85 sm:text-base">
                  {config.description}
                </p>
              </div>
              <div className="hidden rounded-2xl bg-white/15 p-3 backdrop-blur sm:flex">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
            {featureCards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>

          <div className="border-t border-gray-200 p-6 sm:p-8">
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h2 className="text-sm font-black text-gray-900">Workflow Summary</h2>
                <p className="mt-2 text-sm font-medium text-gray-500">
                  Connect this module to live API data when the backend service is ready. The layout is designed to support real-time metrics, actions, audit trails, and team collaboration.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Live metrics', 'Team access', 'Audit ready', 'Mobile responsive'].map((item) => (
                    <span key={item} className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="text-sm font-black text-gray-900">Next Actions</h2>
                <div className="mt-4 space-y-3">
                  <button className="flex w-full items-center justify-between rounded-xl bg-[#4C1D95] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#4C1D95]/90">
                    Configure Module
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50">
                    Invite Team
                    <Users className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
