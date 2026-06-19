// src/pages/freelancer/FreelancerReferralPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift, Users, DollarSign, Share2, Copy,
  CheckCircle2, Trophy, ArrowRight, Mail,
  Twitter, Linkedin, MessageCircle, Check
} from 'lucide-react';
import { useGetReferrals } from '../services/freelancerHooks';

const fallbackLeaderboard = [
  { rank: 1, name: 'Alex Rivera', invites: 42, earnings: 4200, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
  { rank: 2, name: 'Sarah Mitchell', invites: 38, earnings: 3800, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
  { rank: 3, name: 'You', invites: 12, earnings: 1200, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', isYou: true },
  { rank: 4, name: 'David Kim', invites: 8, earnings: 800, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
];

const fallbackHistory = [
  { id: 1, user: 'john.doe@example.com', status: 'Completed', reward: 100, date: 'May 18, 2026' },
  { id: 2, user: 'jane.smith@design.io', status: 'Pending', reward: 100, date: 'May 20, 2026' },
];

export default function FreelancerReferralPage() {
  const { data: response, isLoading } = useGetReferrals();
  const apiData = response?.data || response;
  
  const LEADERBOARD = apiData?.leaderboard || fallbackLeaderboard;
  const HISTORY = apiData?.history || fallbackHistory;
  
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);
  const referralLink = 'https://forte.com/ref/freelancer123';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setShowSuccess({ message: 'Referral link copied to clipboard' });
    setTimeout(() => {
      setCopied(false);
      setShowSuccess(null);
    }, 2000);
  };

  const handleShare = (platform) => {
    setShowSuccess({ message: `Share via ${platform} would open here` });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const totalEarned = 1200;
  const invitesSent = 45;
  const pendingEarnings = 300;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-surface-soft pb-16"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-900 to-brand-800 pt-16 pb-32 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Gift className="w-8 h-8 text-accent-light" />
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">Invite friends, earn KES 100</h1>
          <p className="text-white/80 text-lg md:text-xl font-body max-w-2xl mx-auto">
            Get KES 100 for every freelancer or client who signs up with your link and completes their first transaction.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-20 relative z-20">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Referral Section */}
          <div className="lg:col-span-2 space-y-6">

            {/* Referral Link Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-border"
            >
              <h2 className="font-display font-semibold text-xl text-brand-900 mb-5">Your referral link</h2>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 bg-surface-soft border border-border rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm font-mono text-ink-primary truncate mr-3">{referralLink}</span>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 flex items-center gap-2 text-accent DEFAULT hover:text-accent-dark font-body text-sm bg-accent-light px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'LinkedIn', icon: Linkedin, color: 'bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20' },
                  { name: 'Twitter', icon: Twitter, color: 'bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20' },
                  { name: 'WhatsApp', icon: MessageCircle, color: 'bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20' },
                  { name: 'Email', icon: Mail, color: 'bg-surface-muted text-ink-secondary hover:bg-surface-soft' }
                ].map(platform => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={platform.name}
                      onClick={() => handleShare(platform.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl ${platform.color} transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900`}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-xs font-body font-medium">{platform.name}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Reward History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-border"
            >
              <h2 className="font-display font-semibold text-xl text-brand-900 mb-5">Recent referrals</h2>

              <div className="space-y-3">
                {HISTORY.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 border border-border rounded-xl hover:bg-surface-soft transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-surface-muted rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-ink-tertiary" />
                      </div>
                      <div>
                        <p className="font-body font-medium text-sm text-ink-primary">{item.user}</p>
                        <p className="text-xs font-body text-ink-tertiary">{item.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold text-accent DEFAULT">KES {item.reward}</p>
                      <span className={`text-xs font-body font-medium px-2 py-0.5 rounded-full ${
                        item.status === 'Completed'
                          ? 'bg-accent-light text-accent-dark'
                          : 'bg-warn-light text-warn'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="w-full mt-5 py-2.5 border border-border text-ink-primary font-body font-medium rounded-xl hover:bg-surface-soft transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900">
                View all history
              </button>
            </motion.div>
          </div>

          {/* Right Column: Stats & Leaderboard */}
          <div className="space-y-6">

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-border"
            >
              <h3 className="font-body font-semibold text-ink-primary mb-5 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent DEFAULT" /> Your earnings
              </h3>

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                    Total earned
                  </p>
                  <h4 className="font-mono font-bold text-3xl text-ink-primary">KES {totalEarned.toLocaleString()}</h4>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                      Invites sent
                    </p>
                    <p className="font-mono font-semibold text-xl text-ink-primary">{invitesSent}</p>
                  </div>
                  <div>
                    <p className="text-xs font-body font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                      Pending
                    </p>
                    <p className="font-mono font-semibold text-xl text-warn">KES {pendingEarnings}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Leaderboard Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-accent DEFAULT to-accent-dark rounded-2xl p-0.5 shadow-lg"
            >
              <div className="bg-white rounded-2xl p-5 h-full">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-body font-semibold text-ink-primary flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-accent DEFAULT" /> Leaderboard
                  </h3>
                  <span className="text-xs font-body font-medium bg-accent-light text-accent-dark px-2 py-0.5 rounded-full">
                    This month
                  </span>
                </div>

                <div className="space-y-3">
                  {LEADERBOARD.map((user, idx) => (
                    <motion.div
                      key={user.rank}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                        user.isYou
                          ? 'bg-accent-light border border-accent DEFAULT'
                          : 'hover:bg-surface-soft'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-mono font-bold w-5 text-center ${
                          user.rank === 1 ? 'text-accent DEFAULT' :
                          user.rank === 2 ? 'text-ink-secondary' :
                          user.rank === 3 ? 'text-accent-dark' : 'text-ink-tertiary'
                        }`}>
                          #{user.rank}
                        </span>
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                          width={32}
                          height={32}
                        />
                        <div>
                          <p className="text-sm font-body font-semibold text-ink-primary leading-tight">
                            {user.name}
                            {user.isYou && (
                              <span className="text-xs font-body font-medium bg-accent DEFAULT text-white px-1.5 rounded ml-1">YOU</span>
                            )}
                          </p>
                          <p className="text-xs font-body text-ink-tertiary">{user.invites} invites</p>
                        </div>
                      </div>
                      <span className="text-sm font-mono font-semibold text-ink-primary">KES {user.earnings.toLocaleString()}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
