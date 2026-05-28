import React from 'react';
import { ShieldAlert, Fingerprint, Activity, Users, AlertOctagon, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const fraudData = [
  { name: 'Mon', attempts: 12, blocked: 10 },
  { name: 'Tue', attempts: 19, blocked: 18 },
  { name: 'Wed', attempts: 15, blocked: 15 },
  { name: 'Thu', attempts: 45, blocked: 42 },
  { name: 'Fri', attempts: 22, blocked: 20 },
  { name: 'Sat', attempts: 8, blocked: 8 },
  { name: 'Sun', attempts: 10, blocked: 9 },
];

export default function FraudDetectionCenter() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-8">
        <Link to="/admin/moderation" className="text-sm font-medium text-brand-600 hover:text-brand-500 mb-4 inline-flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Moderation
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Fingerprint className="w-8 h-8 mr-3 text-red-600" /> Fraud Detection & Intelligence
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time AI monitoring for duplicate accounts, mass bidding, and escrow circumvention.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl flex items-center justify-center mr-4">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Threat Level</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">ELEVATED</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl flex items-center justify-center mr-4">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Blocked Bids (7d)</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">122</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 text-brand-600 rounded-xl flex items-center justify-center mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Suspended Accounts</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">14</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Threat Mitigation Velocity</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fraudData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                <Line type="monotone" dataKey="attempts" name="Total Detected" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="blocked" name="Auto Blocked" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Fraud Vector Types</h2>
          <div className="space-y-4">
            {[
              { type: 'Mass AI Bidding Script', count: 45, color: 'bg-red-500' },
              { type: 'Off-Platform Escrow Dodge', count: 32, color: 'bg-orange-500' },
              { type: 'Plagiarized Portfolio', count: 28, color: 'bg-yellow-500' },
              { type: 'Account IP Spoofing', count: 17, color: 'bg-brand-500' },
            ].map(vector => (
              <div key={vector.type}>
                <div className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  <span>{vector.type}</span>
                  <span>{vector.count} incidents</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div className={`${vector.color} h-2 rounded-full`} style={{ width: `${(vector.count / 45) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl">
            <h4 className="text-sm font-bold text-red-800 dark:text-red-400 mb-1 flex items-center">
              <ShieldAlert className="w-4 h-4 mr-1" /> Active Countermeasure
            </h4>
            <p className="text-xs text-red-700 dark:text-red-500">
              The AI heuristic engine is currently shadow-banning proposals that match the pattern of "Mass AI Bidding Script". Review the moderation queue to confirm blocks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
