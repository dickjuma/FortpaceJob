import React from 'react';
import { Link } from 'react-router-dom';
import { getPublicProfileUrl } from '../../../utils/publicProfileLinks';
import { 
  Building2, 
  Wallet, 
  History, 
  ShieldAlert, 
  Target,
  ExternalLink,
  CreditCard,
  Briefcase,
  TrendingUp,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import Card from '../../../components/ui/Card';
import RiskScoreMeter from '../shared/RiskScoreMeter';
import Badge from '../../../components/ui/Badge';
import { formatCurrency } from '../../../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const SectionHeader = ({ title, icon: Icon, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-surface dark:bg-zinc-800 text-zinc-400">
        <Icon size={16} />
      </div>
      <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">{title}</h3>
    </div>
    {action && (
      <button className="text-[10px] font-black uppercase tracking-widest text-[#14a800] hover:text-[#14a800] transition-colors">
        {action}
      </button>
    )}
  </div>
);

/**
 * Detailed Overview panel for Client profiles.
 */
const ClientProfilePanel = ({ user, activeTab }) => {
  if (activeTab !== 'overview') return null;

  const publicUrl = getPublicProfileUrl(user);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {publicUrl && (
        <div className="lg:col-span-3">
          <Link
            to={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#14a800] hover:underline"
          >
            <ExternalLink size={14} /> View public client profile
          </Link>
        </div>
      )}
      {/* Left Column: Organization & Preferences */}
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <SectionHeader title="Organization Profile" icon={Building2} action="Manage Business" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Entity Name</p>
                <p className="text-lg font-black text-zinc-900 dark:text-white">{user.companyName || user.fullName}</p>
                <p className="text-xs font-bold text-[#14a800] capitalize">{user.clientType} Account</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Industry Vertical</p>
                <p className="text-sm font-black text-zinc-900 dark:text-white">{user.industry}</p>
              </div>
            </div>
            <div className="space-y-4">
               <div className="p-4 rounded-2xl bg-surface dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3 mb-2">
                     <MapPin size={14} className="text-zinc-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Business Address</span>
                  </div>
                  <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                     Corporate Towers, Office 402<br/>
                     {user.city}, Kenya
                  </p>
               </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <SectionHeader title="Hiring Preferences" icon={Target} />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-500">Talent Preference</span>
                <Badge variant="secondary" className="capitalize">{user.preferredFreelancerType}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-500">Avg Project Value</span>
                <span className="text-sm font-black text-zinc-900 dark:text-white">{formatCurrency(user.avgProjectValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-500">Payment Status</span>
                <span className="flex items-center gap-1.5 text-xs font-black text-success">
                  <CheckCircle2 size={14} />
                  Verified Business
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <SectionHeader title="Financial Limits" icon={CreditCard} />
            <div className="space-y-5">
               <div>
                  <div className="flex justify-between mb-2">
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Credit Utilization</span>
                     <span className="text-[10px] font-black text-zinc-900 dark:text-white">KES 240k / {formatCurrency(user.creditLimit)}</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                     <div className="h-full bg-[#14a800] w-[45%] rounded-full" />
                  </div>
               </div>
               <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-zinc-500">Payment Verification</span>
                  <Badge variant="success">Verified</Badge>
               </div>
            </div>
          </Card>
        </div>

        <Card>
           <SectionHeader title="Active Operations" icon={Briefcase} />
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: 'Jobs Posted', value: user.totalJobsPosted, color: 'text-[#14a800]' },
                { label: 'Active Jobs', value: user.activeJobs, color: 'text-[#14a800]' },
                { label: 'Contracts', value: user.activeContracts, color: 'text-success' },
                { label: 'Completed', value: user.completedContracts, color: 'text-zinc-400' }
              ].map(stat => (
                <div key={stat.label} className="text-center sm:text-left">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
                  <p className={cn("text-2xl font-black tracking-tight", stat.color)}>{stat.value}</p>
                </div>
              ))}
           </div>
        </Card>
      </div>

      {/* Right Column: Analytics & Risk */}
      <div className="space-y-8">
        <Card className="relative overflow-hidden">
           <SectionHeader title="Hiring Performance" icon={TrendingUp} />
           <div className="h-[200px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{ value: user.hireRate }, { value: 100 - user.hireRate }]}
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={450}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#f1f5f9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -tranzinc-x-1/2 -tranzinc-y-1/2 text-center mt-4">
              <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{user.hireRate}%</span>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Hire Rate</p>
            </div>
          </div>
          <div className="space-y-3">
             <div className="flex justify-between text-xs font-bold">
                <span className="text-zinc-500">Total Capital Spent</span>
                <span className="text-zinc-900 dark:text-white">{formatCurrency(user.totalSpend)}</span>
             </div>
             <div className="h-px bg-surface dark:bg-zinc-800" />
             <div className="flex justify-between text-xs font-bold">
                <span className="text-zinc-500">Dispute Frequency</span>
                <span className="text-rose-500">Very Low</span>
             </div>
          </div>
        </Card>

        <Card className="bg-rose-50/20 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30">
          <SectionHeader title="Platform Risk" icon={ShieldAlert} />
          <RiskScoreMeter score={user.riskScore} className="mb-6" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                <History size={14} className="text-amber-500" />
                Payment Failures
              </div>
              <span className="text-sm font-black text-amber-600">0</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                <ShieldAlert size={14} className="text-rose-500" />
                Dispute Ratio
              </div>
              <span className="text-sm font-black text-rose-600">{((user.disputeCount / (user.completedContracts || 1)) * 100).toFixed(1)}%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-8">
             <button className="h-11 rounded-xl bg-surface-dark text-white text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">
                Audit Logs
             </button>
             <button className="h-11 rounded-xl bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all">
                Freeze Wallet
             </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ClientProfilePanel;
