import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Plus, Search, MoreVertical, Filter, TrendingUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManagedTeams = () => {
  const { data: teamsData } = useQuery({
    queryKey: ['client', 'managedTeams'],
    queryFn: async () => {
      return [
        { abbr: 'FE', name: 'Frontend Engineering', desc: 'Core web app development squad', members: 4, extra: 2, budget: '', bgClass: 'bg-[#4C1D95]/10', textClass: 'text-[#4C1D95]' },
        { abbr: 'UX', name: 'Design & Research', desc: 'User experience and prototyping', members: 3, extra: 0, budget: '', bgClass: 'bg-[#4C1D95]/10', textClass: 'text-[#4C1D95]' },
        { abbr: 'QA', name: 'Quality Assurance', desc: 'Manual and automated testing', members: 2, extra: 0, budget: '', bgClass: 'bg-emerald-100', textClass: 'text-success' }
      ];
    }
  });
  const teams = teamsData || [];
  return (
    <>
      <div className="bg-surface min-h-screen py-10">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">Managed Teams</h1>
              <p className="text-zinc-600">Organize your external workforce by department, project, or squad.</p>
            </div>
            <button className="flex items-center gap-2 bg-[#4C1D95] hover:bg-[#22C55E] text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors">
              <Plus className="w-5 h-5" /> Create New Team
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mb-8">
            <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search teams or members..." 
                  className="w-full pl-10 pr-4 py-2 bg-surface border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-[#4C1D95]/20 focus:bg-white"
                />
              </div>
              <button className="flex items-center gap-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 px-4 py-2 rounded-lg hover:bg-surface transition-colors w-full sm:w-auto">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              
              {teams.map((team, idx) => (
                <div key={idx} className="border border-zinc-200 rounded-xl p-5 hover:border-[#4C1D95]/50 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl ${team.bgClass} ${team.textClass}`}>
                      {team.abbr}
                    </div>
                    <button className="text-zinc-400 hover:text-zinc-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="font-bold text-zinc-900 text-lg mb-1 group-hover:text-[#4C1D95] transition-colors">{team.name}</h3>
                  <p className="text-sm text-zinc-500 mb-6">{team.desc}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                    <div className="flex -space-x-2">
                      {[...Array(team.members)].map((_, i) => (
                        <img key={i} src={`https://ui-avatars.com/api/?name=Member+${i}&background=random`} className="w-8 h-8 rounded-full border-2 border-white" alt="avatar" />
                      ))}
                      {team.extra > 0 && <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500">+{team.extra}</div>}
                    </div>
                    <div className="text-sm font-medium text-zinc-700">
                      {team.budget} <span className="text-xs text-zinc-400 font-normal">/wk</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-[#4C1D95]/5 text-[#4C1D95] rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">Spend Optimization</h4>
                <p className="text-sm text-zinc-600 mb-3">Frontend Engineering team is approaching their weekly budget limit.</p>
                <button className="text-sm font-bold text-[#4C1D95] hover:text-[#4C1D95]">View Budget Report</button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-success rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">Compliance Alert</h4>
                <p className="text-sm text-zinc-600 mb-3">All 11 team members have active NDAs and are fully compliant.</p>
                <button className="text-sm font-bold text-success hover:text-emerald-700">View Compliance Log</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ManagedTeams;



