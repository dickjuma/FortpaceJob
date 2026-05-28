import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, Users, DollarSign, Share2, Copy, 
  CheckCircle2, Trophy, ArrowRight, Mail,
  Twitter, Linkedin, MessageCircle
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const LEADERBOARD = [
  { rank: 1, name: 'Alex Rivera', invites: 42, earnings: 4200, avatar: 'https://i.pravatar.cc/150?u=a1' },
  { rank: 2, name: 'Sarah Mitchell', invites: 38, earnings: 3800, avatar: 'https://i.pravatar.cc/150?u=s1' },
  { rank: 3, name: 'You', invites: 12, earnings: 1200, avatar: 'https://i.pravatar.cc/150?u=you', isYou: true },
  { rank: 4, name: 'David Kim', invites: 8, earnings: 800, avatar: 'https://i.pravatar.cc/150?u=d2' },
];

const HISTORY = [
  { id: 1, user: 'john.doe@example.com', status: 'Completed', reward: '+$100', date: 'May 18, 2026' },
  { id: 2, user: 'jane.smith@design.io', status: 'Pending', reward: '+$100', date: 'May 20, 2026' },
];

export default function FreelancerReferralPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://forte.com/ref/freelancer123';

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-brand-600 dark:bg-brand-900 pt-16 pb-32 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl">
            <Gift className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Invite Friends, Earn $100</h1>
          <p className="text-brand-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Get $100 for every freelancer or client who signs up with your link and completes their first $500 in transactions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-20 relative z-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Referral Card */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-xl border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Your Referral Link</h2>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1 bg-surface dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300 font-mono truncate mr-4">{referralLink}</span>
                  <button 
                    onClick={handleCopy}
                    className="shrink-0 flex items-center gap-2 text-brand-600 hover:text-brand-700 font-bold text-sm bg-brand-50 dark:bg-brand-500/10 px-4 py-2 rounded-lg transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 transition-colors">
                  <Linkedin className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold">LinkedIn</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors">
                  <Twitter className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold">Twitter</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors">
                  <MessageCircle className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold">WhatsApp</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  <Mail className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold">Email</span>
                </button>
              </div>
            </div>

            {/* Reward History */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Recent Referrals</h2>
              
              <div className="space-y-4">
                {HISTORY.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:bg-surface dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white text-sm">{item.user}</p>
                        <p className="text-xs font-medium text-zinc-500">{item.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-success">{item.reward}</p>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block",
                        item.status === 'Completed' ? "bg-emerald-100 text-emerald-700 dark:bg-success/20 dark:text-success" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                      )}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-3 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-bold rounded-xl hover:bg-surface dark:hover:bg-zinc-800 transition-colors">
                View All History
              </button>
            </div>

          </div>

          {/* Right Column: Stats & Leaderboard */}
          <div className="space-y-8">
            
            {/* Stats */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-success" /> Your Earnings
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Earned</p>
                  <h4 className="text-4xl font-black text-zinc-900 dark:text-white">$1,200</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Invites Sent</p>
                    <p className="text-xl font-black text-zinc-900 dark:text-white">45</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Pending</p>
                    <p className="text-xl font-black text-amber-500">$300</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-1 shadow-lg">
              <div className="bg-white dark:bg-surface-dark rounded-[22px] p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" /> Leaderboard
                  </h3>
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 px-2 py-1 rounded-md">This Month</span>
                </div>

                <div className="space-y-4">
                  {LEADERBOARD.map(user => (
                    <div key={user.rank} className={cn(
                      "flex items-center justify-between p-3 rounded-xl transition-colors",
                      user.isYou ? "bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20" : "hover:bg-surface dark:hover:bg-zinc-800/50"
                    )}>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-sm font-black w-5 text-center",
                          user.rank === 1 ? "text-amber-500" : user.rank === 2 ? "text-zinc-400" : user.rank === 3 ? "text-amber-700" : "text-zinc-300"
                        )}>#{user.rank}</span>
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">
                            {user.name} {user.isYou && <span className="text-[10px] bg-amber-500 text-white px-1.5 rounded ml-1">YOU</span>}
                          </p>
                          <p className="text-xs font-medium text-zinc-500 leading-tight">{user.invites} invites</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-zinc-900 dark:text-white">${user.earnings}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
