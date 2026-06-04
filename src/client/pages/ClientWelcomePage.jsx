import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Users, Briefcase, ChevronRight, 
  Sparkles, ShieldCheck, ArrowRight, User, Check 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ClientWelcomePage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    { id: 'individual', title: 'Individual Client', desc: 'Hiring single digital contractors or surveyors.', icon: User },
    { id: 'sme', title: 'SME Operations', desc: 'Managing small onsite crews and digital teams.', icon: Briefcase },
    { id: 'corporate', title: 'Corporate Enterprise', desc: 'Enterprise management, cost centers, and budget chains.', icon: Building2 }
  ];

  const handleContinue = () => {
    if (!selectedRole) {
      toast.error('Please select an operational role tier to continue.');
      return;
    }
    toast.success(`Role selected: ${selectedRole.toUpperCase()}. Redirecting to setup...`);
    setTimeout(() => {
      navigate('/client/setup-wizard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-950 via-[#222222] to-zinc-900 font-sans text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Decorative background vectors */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-success/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e63946]/5 blur-[120px] rounded-full"></div>

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-success flex items-center justify-center font-black text-sm">F</div>
            <span className="text-sm font-bold tracking-tight text-white/90">ForteSpace Gateway</span>
          </div>
          <span className="text-xs font-bold text-light-gray/40 uppercase tracking-widest">Select Operational Tier</span>
        </div>

        {/* Central Content */}
        <div className="py-12 space-y-8 text-center sm:text-left">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-success uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Unified Workforce Operating System
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Welcome to the <span className="bg-gradient-to-r from-success via-[#e63946] to-orange-400 bg-clip-text text-transparent">Future of Work</span>.
            </h2>
            <p className="text-sm text-light-gray/60 font-medium leading-relaxed">
              Identify your business tier to customize your AI recruiting helper, allocate cost centers, and configure Safaricom M-Pesa STK merchant channels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {roles.map(r => {
              const RoleIcon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <div 
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`p-6 rounded-3xl border cursor-pointer text-left flex flex-col justify-between h-48 transition-all ${
                    isSelected 
                      ? 'border-success bg-success/10 shadow-lg shadow-[#2bb75c]/5' 
                      : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/[0.07]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-2xl ${
                      isSelected ? 'bg-success text-white shadow' : 'bg-white/5 text-light-gray/60'
                    }`}>
                      <RoleIcon className="w-5 h-5" />
                    </div>
                    {isSelected && <div className="w-4 h-4 rounded-full bg-success border border-white flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{r.title}</h4>
                    <p className="text-[10px] text-light-gray/50 font-semibold mt-1 leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-8">
          <span className="text-[10px] font-bold text-light-gray/30 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-success" /> Safaricom & Stripe Secured
          </span>

          <Button 
            onClick={handleContinue}
            className="bg-success border-none font-bold text-xs py-3 px-8 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-[#2bb75c]/20 transition-all hover:scale-105"
          >
            Configure Selected Tier
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </div>
  );
}

