import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingDown, Users, Briefcase, ChevronRight, 
  Search, ShieldCheck, Activity, BellRing, UserCheck, MessageSquare, AlertTriangle,
  PlusCircle, Calendar, DollarSign, Bot, BarChart2, PieChart, Sparkles, Send, Download
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

// --- Reusable SVG Spend Graph ---
const SpendFintechGraph = () => (
  <div className="h-48 w-full flex items-end gap-2 pt-4 relative">
    {[45, 60, 35, 80, 55, 95, 75, 110, 85, 130, 90, 140].map((val, idx) => (
      <div key={idx} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer h-full justify-end">
        <div 
          className="w-full bg-accent-purple/20 group-hover:bg-accent-purple rounded-t-lg transition-all duration-300 relative"
          style={{ height: `${(val / 150) * 100}%` }}
        >
          <div className="absolute -top-8 left-1/2 -tranzinc-x-1/2 bg-navy text-white text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow z-30 pointer-events-none">
            KES {val * 1000}
          </div>
        </div>
        <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest">M{idx + 1}</span>
      </div>
    ))}
  </div>
);

export default function DashboardOverview() {
  const [walletBalance, setWalletBalance] = useState(124500);

  const handleQuickAction = (action) => {
    if (action === 'fund') {
      toast.promise(
        new Promise(resolve => setTimeout(resolve, 1000)),
        {
          loading: 'Triggering standard M-Pesa STK push...',
          success: () => {
            setWalletBalance(prev => prev + 15000);
            return 'KES 15,000 deposited successfully! 💳';
          },
          error: 'Deposit timed out.'
        }
      );
    } else {
      toast(`Initiating workflow: ${action}`, { icon: '⚙️' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />

      {/* Top Greeting Welcome Header */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 border-b border-border pb-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-navy border border-white/10 flex items-center justify-center text-white text-xl font-black shrink-0 shadow-lg">
            AC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-purple animate-pulse" />
              <h1 className="text-3xl font-black text-text-primary tracking-tight">Welcome back, Alex Morgan</h1>
            </div>
            <p className="text-sm text-text-secondary font-medium mt-1">
              Acme Digital Solutions Ltd • Corporate Command Center
            </p>
          </div>
        </div>

        {/* Quick Action Floating Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-light-gray p-1.5 rounded-2xl border border-border shadow-inner">
          <Button onClick={() => handleQuickAction('post_job')} variant="primary" className="bg-accent-purple hover:bg-accent-purple/95 font-bold text-xs py-2 px-3.5 rounded-xl border-none">
            Post Job
          </Button>
          <Button onClick={() => handleQuickAction('hire')} variant="outline" className="font-bold text-xs py-2 px-3.5 rounded-xl bg-white border-border">
            Hire Talent
          </Button>
          <Button onClick={() => handleQuickAction('fund')} variant="outline" className="font-bold text-xs py-2 px-3.5 rounded-xl bg-white border-border">
            Fund Wallet
          </Button>
          <Button onClick={() => handleQuickAction('contract')} variant="outline" className="font-bold text-xs py-2 px-3.5 rounded-xl bg-white border-border">
            Create Contract
          </Button>
        </div>
      </div>

      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-5 border-none bg-navy text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/20 blur-[50px] rounded-full"></div>
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Wallet Balance</p>
          <h2 className="text-3xl font-black mt-1">KES {walletBalance.toLocaleString()}</h2>
          <span className="text-[9px] uppercase tracking-wider font-bold text-success mt-4 block flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Instant settlement
          </span>
        </Card>

        <Card className="p-5 border border-border bg-white shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Active Contracts</p>
          <h2 className="text-3xl font-black text-text-primary mt-1">12 Projects</h2>
          <span className="text-[9px] uppercase tracking-wider font-bold text-accent-purple mt-4 block flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> 4 In Milestones
          </span>
        </Card>

        <Card className="p-5 border border-border bg-white shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Offline Workforce</p>
          <h2 className="text-3xl font-black text-text-primary mt-1">8 Field Workers</h2>
          <span className="text-[9px] uppercase tracking-wider font-bold text-success mt-4 block flex items-center gap-1">
            <MapPinIcon className="w-3.5 h-3.5" /> Live GPS Checked-in
          </span>
        </Card>

        <Card className="p-5 border border-border bg-white shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Pending Invoices</p>
          <h2 className="text-3xl font-black text-accent-red mt-1">3 Overdue</h2>
          <span className="text-[9px] uppercase tracking-wider font-bold text-accent-red mt-4 block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> KES 85,000 Total
          </span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Spending Graph Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border border-border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div>
                <h3 className="font-black text-text-primary text-sm uppercase tracking-wider">Hiring Spend Index</h3>
                <p className="text-[10px] font-semibold text-text-secondary">Yearly spend allocation chart</p>
              </div>
              <Button onClick={() => toast.success('CSV Report dispatched.')} variant="outline" size="sm" icon={<Download size={14} />}>
                Export PDF
              </Button>
            </div>
            <SpendFintechGraph />
          </Card>

          {/* Recent Action Feed */}
          <Card className="p-6 border border-border bg-white shadow-sm">
            <h3 className="font-black text-text-primary text-sm uppercase tracking-wider border-b border-border pb-3 mb-4">
              Required Actions & Alerts
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs p-3.5 bg-light-gray/40 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success text-white rounded-xl">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">Review Milestone Submission</h4>
                    <p className="text-[9px] font-semibold text-text-secondary">Sarah J. delivered responsive CSS fix for "Forte Mobile Web"</p>
                  </div>
                </div>
                <Button variant="primary" size="sm" onClick={() => toast.success('Milestone approved!')} className="bg-success hover:bg-success/90 border-none font-bold text-[10px] py-1.5 px-3">
                  Release Payout
                </Button>
              </div>

              <div className="flex justify-between items-center text-xs p-3.5 bg-light-gray/40 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning text-white rounded-xl">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">Escrow Funding Warning</h4>
                    <p className="text-[9px] font-semibold text-text-secondary">AWS Cloud Architecture contract milestone locks lack funded balance</p>
                  </div>
                </div>
                <Button variant="primary" size="sm" onClick={() => handleQuickAction('fund')} className="bg-accent-purple hover:bg-accent-purple/90 border-none font-bold text-[10px] py-1.5 px-3">
                  Fund Escrow
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right side AI Recommendation card */}
        <div className="lg:col-span-1 space-y-6">
          
          <Card className="p-6 bg-gradient-to-br from-navy to-zinc-900 border border-white/10 text-white rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/20 blur-[50px] rounded-full"></div>
            <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5 mb-4">
              <Bot className="w-4 h-4 text-accent-purple animate-bounce" /> AI Talent Recommender
            </h4>
            <p className="text-[10px] font-semibold text-white/70 leading-relaxed mb-4">
              We parsed your recently finalized contracts and auto-selected **3 top-rated security specialists** matching your stack requirements.
            </p>
            <Button variant="primary" onClick={() => toast.success('Navigating to recommendations feed...')} className="w-full bg-accent-purple hover:bg-accent-purple/90 border-none rounded-xl text-xs font-bold py-2.5">
              Review Candidates
            </Button>
          </Card>

          {/* Quick Calendar */}
          <Card className="p-6 border border-border bg-white shadow-sm space-y-3">
            <h4 className="font-black text-text-primary text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-border pb-2">
              <Calendar className="w-4 h-4 text-accent-purple" /> Upcoming Interviews
            </h4>
            <div className="space-y-2 text-[10px] font-bold text-text-secondary">
              <div className="flex justify-between">
                <span>Technical Interview: Alex M.</span>
                <span>Today, 3:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Deployment Review: Field Site</span>
                <span>Tomorrow, 9:30 AM</span>
              </div>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}

const MapPinIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
