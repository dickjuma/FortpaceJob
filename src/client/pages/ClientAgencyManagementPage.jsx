import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Briefcase, 
  ShieldCheck, 
  Wallet, 
  ArrowRightLeft,
  ChevronDown,
  Building2,
  Settings,
  MoreVertical,
  Search,
  Plus
} from 'lucide-react';



export default function ClientAgencyManagementPage() {
    const { data: agenciesData } = useQuery({
    queryKey: ['client', 'agencies'],
    queryFn: async () => {
      return [
        { id: 'AG-1001', name: 'Apex Digital Solutions', type: 'Software Development', rating: 4.9, activeWorkers: 12, escrow: 45000, status: 'Active' },
        { id: 'AG-1002', name: 'Horizon Field Ops', type: 'Site Surveying', rating: 4.7, activeWorkers: 34, escrow: 125000, status: 'Active' },
        { id: 'AG-1003', name: 'Global Marketing Hub', type: 'Marketing', rating: 4.5, activeWorkers: 8, escrow: 12000, status: 'Pending Review' }
      ];
    }
  });
  const agencies = agenciesData || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#4C1D95]" />
              Agency & Sub-contractor Management
            </h1>
            <p className="text-zinc-400 mt-2 text-sm">
              Manage external agencies, dispatch sub-contractors, and handle multi-party escrow splits.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg hover:bg-zinc-800 text-sm font-medium transition-colors">
              <Settings className="w-4 h-4" />
              Agency Policies
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#4C1D95] hover:bg-[#4C1D95] text-white rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              Onboard Agency
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-400 text-sm">Active Agencies</span>
              <Building2 className="w-5 h-5 text-[#4C1D95]" />
            </div>
            <div className="text-2xl font-bold text-white">14</div>
            <div className="text-xs text-emerald-400 mt-2">+2 this month</div>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-400 text-sm">Sub-contractors</span>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">245</div>
            <div className="text-xs text-zinc-500 mt-2">Deployed across 8 sites</div>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-400 text-sm">Agency Escrow Hold</span>
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">$452,000</div>
            <div className="text-xs text-zinc-500 mt-2">Fully secured</div>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-400 text-sm">Compliance Rate</span>
              <ShieldCheck className="w-5 h-5 text-#4C1D95]" />
            </div>
            <div className="text-2xl font-bold text-white">98.5%</div>
            <div className="text-xs text-orange-400 mt-2">3 MSAs pending renewal</div>
          </div>
        </div>

        {/* Agency Directory List */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl backdrop-blur-md overflow-hidden">
          <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/80">
            <h2 className="font-semibold text-white">Agency Roster</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -tranzinc-y-1/2" />
              <input 
                type="text" 
                placeholder="Search agencies..." 
                className="bg-zinc-950 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#4C1D95] text-zinc-200"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950/50 text-zinc-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Agency ID & Name</th>
                  <th className="p-4 font-medium">Domain</th>
                  <th className="p-4 font-medium">Active Headcount</th>
                  <th className="p-4 font-medium">Escrow Allocated</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-sm">
                {agencies.map((agency) => (
                  <tr key={agency.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{agency.name}</div>
                      <div className="text-xs text-zinc-500">{agency.id}</div>
                    </td>
                    <td className="p-4 text-zinc-300">{agency.type}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-zinc-400" />
                        <span>{agency.activeWorkers} workers</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-emerald-400">
                      ${agency.escrow.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        agency.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                        'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {agency.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-zinc-400 hover:text-white transition-colors p-2">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dispatch & Splits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 backdrop-blur-md">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              Sub-contractor Dispatch Rules
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              Configure automatic dispatch routing for new bulk jobs to preferred agencies based on SLA and geographic proximity.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-white">Nairobi Region - Site Surveying</div>
                  <div className="text-xs text-zinc-500 mt-1">Route to: Horizon Field Ops</div>
                </div>
                <div className="h-4 w-8 bg-[#4C1D95] rounded-full relative cursor-pointer">
                  <div className="h-3 w-3 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-white">Global - UI/UX Design Tasks</div>
                  <div className="text-xs text-zinc-500 mt-1">Route to: Apex Digital Solutions</div>
                </div>
                <div className="h-4 w-8 bg-[#4C1D95] rounded-full relative cursor-pointer">
                  <div className="h-3 w-3 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>
            </div>
            <button className="mt-4 text-sm text-[#4C1D95] hover:text-[#7bc67e] font-medium">
              + Add Dispatch Rule
            </button>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 backdrop-blur-md">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
              Multi-party Escrow Splits
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              Manage automatic commission deductions and sub-contractor payout ratios from main agency escrow accounts.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white">Standard Agency Split</span>
                  <span className="text-xs text-zinc-400">Default</span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-[#4C1D95] w-[70%]" title="Sub-contractor 70%"></div>
                  <div className="bg-[#4C1D95] w-[20%]" title="Agency 20%"></div>
                  <div className="bg-zinc-600 w-[10%]" title="Platform 10%"></div>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#4C1D95]"></div> Worker (70%)</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#4C1D95]"></div> Agency (20%)</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-zinc-600"></div> ForteSpace (10%)</span>
                </div>
              </div>
              <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-lg transition-colors">
                Configure Split Templates
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}



