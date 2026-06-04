import React from 'react';
import { Link } from 'react-router-dom';
import { getPublicProfileUrl } from '../../../utils/publicProfileLinks';
import { 
  Briefcase, 
  Target, 
  Wifi, 
  MapPin, 
  UserCheck, 
  TrendingUp, 
  ShieldAlert, 
  Flag,
  Edit2,
  CheckCircle2,
  ExternalLink
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
      <button className="text-[10px] font-black uppercase tracking-widest text-[#2bb75c] hover:text-[#2bb75c] transition-colors">
        {action}
      </button>
    )}
  </div>
);

/**
 * Detailed Overview panel for Freelancer profiles.
 */
const FreelancerProfilePanel = ({ user, activeTab }) => {
  if (activeTab !== 'overview') return null;

  const skills = Array.isArray(user.skills) ? user.skills : [];
  const categories = Array.isArray(user.categories) ? user.categories : [];
  const publicUrl = getPublicProfileUrl(user);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {publicUrl && (
        <div className="lg:col-span-3">
          <Link
            to={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#2bb75c] hover:underline"
          >
            <ExternalLink size={14} /> View public freelancer profile
          </Link>
        </div>
      )}
      {/* Left Column: Bio & Skills */}
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <SectionHeader title="Professional Bio" icon={Edit2} action="Edit Bio" />
          <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            {user.bio || "No professional bio provided."}
          </p>
        </Card>

        <Card>
          <SectionHeader title="Skills & Categories" icon={Target} />
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-3 py-1.5 bg-surface dark:bg-zinc-800 border-none">
                {skill}
              </Badge>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-50 dark:border-zinc-800/50">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Primary Categories</h4>
             <div className="flex gap-4">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center gap-3 p-3 rounded-2xl bg-[#2bb75c]/5/50 dark:bg-[#2bb75c]/10 border border-[#2bb75c]/20/50 dark:border-[#2bb75c]/20/50 flex-1">
                    <div className="h-10 w-10 bg-[#2bb75c] text-white rounded-xl flex items-center justify-center">
                      <Briefcase size={20} />
                    </div>
                    <span className="font-black text-zinc-900 dark:text-white text-sm">{cat}</span>
                  </div>
                ))}
             </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <SectionHeader title="Working Preferences" icon={Wifi} />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500">Service Type</span>
                <Badge variant="info" className="capitalize">{user.freelancerType}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500">Hourly Rate</span>
                <span className="text-sm font-black text-zinc-900 dark:text-white">{formatCurrency(user.hourlyRate)}/hr</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500">Availability</span>
                <span className="flex items-center gap-1.5 text-xs font-black text-success">
                  <div className="h-1.5 w-1.5 rounded-full bg-success" />
                  Immediate Start
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <SectionHeader title="Certifications" icon={CheckCircle2} />
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-zinc-50 dark:border-zinc-800 group hover:border-[#2bb75c]/20 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 group-hover:text-[#2bb75c]">
                      <AwardIcon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-zinc-900 dark:text-white">Adobe Certified Expert</p>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Verified 2024</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-zinc-300 group-hover:text-[#2bb75c]" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Right Column: Performance & Risk */}
      <div className="space-y-8">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <TrendingUp size={120} />
          </div>
          <SectionHeader title="Performance Index" icon={TrendingUp} />
          <div className="h-[200px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{ value: user.successRate }, { value: 100 - user.successRate }]}
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={450}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f1f5f9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -tranzinc-x-1/2 -tranzinc-y-1/2 text-center mt-4">
              <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{user.successRate}%</span>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Success</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface dark:bg-zinc-800/50 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Reviews</p>
              <p className="text-xl font-black text-zinc-900 dark:text-white">{user.totalReviews}</p>
            </div>
            <div className="p-4 bg-surface dark:bg-zinc-800/50 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Response</p>
              <p className="text-xl font-black text-zinc-900 dark:text-white">{user.responseTime}h</p>
            </div>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Financial Health" icon={TrendingUp} />
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-500">Available Balance</span>
              <span className="text-lg font-black text-success">{formatCurrency(user.availableBalance)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-500">Escrow Hold</span>
              <span className="text-lg font-black text-amber-500">{formatCurrency(user.escrowBalance)}</span>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-500">Profile Completion</span>
              <span className="text-xs font-black text-zinc-900 dark:text-white">{user.profileCompletion}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
               <div className="h-full bg-[#2bb75c] rounded-full" style={{ width: `${user.profileCompletion}%` }} />
            </div>
          </div>
        </Card>

        <Card className="bg-rose-50/20 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30">
          <SectionHeader title="Risk Assessment" icon={ShieldAlert} />
          <RiskScoreMeter score={user.riskScore} className="mb-6" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                <Flag size={14} className="text-rose-500" />
                System Flags
              </div>
              <span className="text-sm font-black text-rose-600">{user.flagCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                <ShieldAlert size={14} className="text-amber-500" />
                Active Disputes
              </div>
              <span className="text-sm font-black text-amber-600">{user.disputeCount}</span>
            </div>
          </div>
          <button className="w-full mt-6 h-12 rounded-2xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all active:scale-95">
             Flag Account for Review
          </button>
        </Card>
      </div>
    </div>
  );
};

const AwardIcon = ({ size, className }) => <CheckCircle2 size={size} className={className} />;

export default FreelancerProfilePanel;

