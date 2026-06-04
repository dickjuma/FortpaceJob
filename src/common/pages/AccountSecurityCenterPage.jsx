import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Key, Smartphone, Mail, Clock, Laptop, AlertTriangle, 
  CheckCircle, XCircle, LogOut, Eye, EyeOff, ShieldAlert, Fingerprint
} from 'lucide-react';

const activeSessions = [
  { id: 1, device: 'MacBook Pro 16"', browser: 'Chrome', location: 'San Francisco, CA', time: 'Active now', current: true, icon: Laptop },
  { id: 2, device: 'iPhone 13 Pro', browser: 'Safari', location: 'San Francisco, CA', time: '2 hours ago', current: false, icon: Smartphone },
];

const loginHistory = [
  { id: 1, date: 'Oct 24, 2023 10:45 AM', location: 'San Francisco, CA', ip: '192.168.1.1', status: 'Success' },
  { id: 2, date: 'Oct 23, 2023 08:30 PM', location: 'San Jose, CA', ip: '192.168.1.45', status: 'Success' },
  { id: 3, date: 'Oct 21, 2023 02:15 AM', location: 'Moscow, RU', ip: '45.22.11.99', status: 'Failed' },
];

export default function AccountSecurityCenterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFaAppEnabled, setTwoFaAppEnabled] = useState(true);
  const [twoFaSmsEnabled, setTwoFaSmsEnabled] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onPasswordChange = (data) => {
    console.log(data);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans bg-surface dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="h-8 w-8 text-[#2bb75c]" />
          Account Security
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Manage your security preferences and review active sessions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Password Management */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-gray-500" /> Change Password
              </h2>
              <p className="text-sm text-gray-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit(onPasswordChange)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      {...register("currentPassword", { required: true })}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2bb75c] outline-none" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <input 
                    type="password" 
                    {...register("newPassword", { required: true, minLength: 8 })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2bb75c] outline-none" 
                  />
                  {/* Password Strength Meter Mock */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex gap-1">
                      <div className="h-full w-1/3 bg-red-500 rounded-l-full"></div>
                      <div className="h-full w-1/3 bg-yellow-500"></div>
                      <div className="h-full w-1/3 bg-green-500 rounded-r-full"></div>
                    </div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Strong</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    {...register("confirmPassword", { required: true })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2bb75c] outline-none" 
                  />
                </div>
                <div className="pt-2">
                  <button type="submit" className="px-6 py-2 bg-[#2bb75c] hover:bg-[#1d8d38] text-white rounded-lg text-sm font-medium transition-colors">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Two-Factor Authentication */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-gray-500" /> Two-Factor Authentication (2FA)
              </h2>
              <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account.</p>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#2bb75c]/5 dark:bg-[#2bb75c]/30 rounded-lg">
                    <Smartphone className="w-6 h-6 text-[#2bb75c]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Authenticator App</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Use an app like Google Authenticator or Authy to generate codes.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setTwoFaAppEnabled(!twoFaAppEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFaAppEnabled ? 'bg-[#2bb75c]' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFaAppEnabled ? 'tranzinc-x-6' : 'tranzinc-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Mail className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">SMS Authentication</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Receive a text message with an authentication code.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setTwoFaSmsEnabled(!twoFaSmsEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFaSmsEnabled ? 'bg-[#2bb75c]' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFaSmsEnabled ? 'tranzinc-x-6' : 'tranzinc-x-1'}`} />
                </button>
              </div>

            </div>
          </motion.div>

          {/* Active Sessions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-gray-500" /> Active Sessions
                </h2>
                <p className="text-sm text-gray-500 mt-1">Devices that are currently logged into your account.</p>
              </div>
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">Log out all other devices</button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {activeSessions.map((session) => {
                const Icon = session.icon;
                return (
                  <div key={session.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                        <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{session.device}</h3>
                          {session.current && (
                            <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                              Current Session
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{session.browser} • {session.location}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{session.time}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Log out device">
                        <LogOut className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Security Score */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Security Score</h3>
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-200 dark:text-gray-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#2bb75c]" strokeWidth="3" strokeDasharray="80, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">80</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">/ 100</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Looking good, but can be better!</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Enable SMS 2FA to achieve a perfect security score.</p>
          </motion.div>

          {/* Suspicious Activity Alert */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-500 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">Suspicious Login Attempt</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">We blocked a login attempt from Moscow, RU on Oct 21. If this wasn't you, your account is safe, but you may want to change your password.</p>
                <button className="mt-3 px-4 py-1.5 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700 text-yellow-800 dark:text-yellow-300 rounded-lg text-xs font-medium transition-colors">
                  Review Activity
                </button>
              </div>
            </div>
          </motion.div>

          {/* Login History Mini */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" /> Recent Logins
              </h3>
              <button className="text-xs text-[#2bb75c] hover:text-[#2bb75c] font-medium">View all</button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {loginHistory.map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{log.location}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{log.date} • {log.ip}</p>
                  </div>
                  {log.status === 'Success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Account Recovery Options */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recovery Options</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Recovery Email</p>
                  <p className="text-xs text-gray-500">al**@example.com</p>
                </div>
                <button className="text-sm text-[#2bb75c] font-medium">Edit</button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Recovery Phone</p>
                  <p className="text-xs text-gray-500">Not set</p>
                </div>
                <button className="text-sm text-[#2bb75c] font-medium">Add</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

