import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  Activity,
  History,
  Lock,
  ChevronRight,
  TrendingUp,
  AlertOctagon
} from 'lucide-react';
import UserRiskTable from '../../components/marketplace/UserRiskTable';
import { fetchUserRiskData } from '../../api/marketplace/marketplace.api';
import { cn } from '../../utils/cn';
import UserProfileModal from '../../components/users/UserProfileModal';
import UserRankingModal from '../../components/users/UserRankingModal';
import UserFlagModal from '../../components/users/UserFlagModal';
import Modal from '../../components/ui/Modal';
import AuditLogViewer from '../../components/audit/AuditLogViewer';

const UserRiskPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserAction = (type, user) => {
    setSelectedUser(user);
    if (type === 'profile') setIsProfileModalOpen(true);
    if (type === 'ranking') setIsRankingModalOpen(true);
    if (type === 'flag') setIsFlagModalOpen(true);
    if (type === 'logs') setIsLogsModalOpen(true);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchUserRiskData();
        setData(result);
      } catch (err) {
        console.error('Failed to load risk data', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                <ShieldAlert size={24} />
             </div>
             <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">User Risk Intelligence</h1>
          </div>
          <p className="text-zinc-500 font-medium max-w-2xl">
             Auditing trust scores and risk profiles for all platform members. Red-level profiles require immediate administrative review.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white dark:bg-surface-dark p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
           <div className="text-right">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">System Risk</p>
              <p className="text-xl font-black text-success mt-1 tracking-tight">Nominal</p>
           </div>
           <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />
           <div className="h-10 w-24 flex items-center justify-center bg-success/5 rounded-lg border border-emerald-500/10">
              <Activity size={24} className="text-success/50" />
           </div>
        </div>
      </div>

      {/* Analytics Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Red Level Users', value: '14', icon: AlertOctagon, color: 'text-red-500', bg: 'bg-red-500/10' },
           { label: 'Active Flags', value: '242', icon: History, color: 'text-amber-500', bg: 'bg-amber-500/10' },
           { label: 'Frozen Funds', value: '$8,240', icon: Lock, color: 'text-[#4C1D95]', bg: 'bg-[#4C1D95]/10' },
           { label: 'Detection Rate', value: '94.2%', icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                 <stat.icon size={22} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                 <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{stat.value}</h3>
              </div>
           </div>
         ))}
      </div>

      {/* Main Table Section */}
      <UserRiskTable data={data} isLoading={isLoading} onAction={handleUserAction} />

      {/* Case Discovery Mini-Panel (Bottom Row) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-gradient-to-br from-[#4C1D95]/20 to-zinc-900/20 p-8 rounded-3xl border border-[#4C1D95]/20/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-[#4C1D95]/5 -mr-8 -mt-8 rotate-12 transition-transform group-hover:scale-110">
               <ShieldAlert size={160} />
            </div>
            <div className="space-y-4 relative z-10">
               <h3 className="text-2xl font-black text-white tracking-tight">Automated Enforcement Rules</h3>
               <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-md">
                  Currently 14 rules are active. The AI engine is blocking 94% of identified fraud attempts before human intervention is required.
               </p>
               <button className="flex items-center gap-2 text-[#4C1D95] text-xs font-black uppercase tracking-widest hover:text-[#4C1D95] transition-colors">
                  View Rules Engine <ChevronRight size={14} />
               </button>
            </div>
            <div className="shrink-0 relative z-10">
               <div className="h-32 w-32 rounded-full border-4 border-[#4C1D95]/20/20 flex items-center justify-center p-2">
                  <div className="h-full w-full rounded-full border-4 border-[#4C1D95]/20/40 flex items-center justify-center p-2 animate-spin-slow">
                     <div className="h-full w-full rounded-full bg-[#4C1D95] flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                        94%
                     </div>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="bg-white dark:bg-surface-dark p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center text-center">
            <div className="h-16 w-16 bg-surface dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-400">
               <History size={32} />
            </div>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Audit History</h4>
            <p className="text-zinc-500 text-sm font-medium mb-6">
               Access the immutable log of all administrative risk overrides and manual score adjustments.
            </p>
            <button 
              onClick={() => window.location.href = '/admin/audit/security'}
              className="w-full py-3 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-zinc-600 dark:text-zinc-300"
            >
               View Audit Trail
            </button>
         </div>
      </div>

      {/* User Activity Logs Modal */}
      <Modal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
        title={`Activity Stream: ${selectedUser?.name}`}
        size="max"
      >
        <div className="p-1">
          <AuditLogViewer 
            userFilter={selectedUser?.id}
            isEmbedded={true}
            title=""
            description=""
          />
        </div>
      </Modal>

      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={selectedUser}
        onAction={handleUserAction}
      />

      <UserRankingModal 
        isOpen={isRankingModalOpen}
        onClose={() => setIsRankingModalOpen(false)}
        user={selectedUser}
      />

      <UserFlagModal 
        isOpen={isFlagModalOpen}
        onClose={() => setIsFlagModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default UserRiskPage;


