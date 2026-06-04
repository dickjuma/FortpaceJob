import React from 'react';
import { 
  Database, 
  BarChart4, 
  Box, 
  Layers, 
  RefreshCcw,
  Truck,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function ClientErpSystemsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Database className="w-8 h-8 text-[#2bb75c]" />
              ERP & Business Systems Hub
            </h1>
            <p className="text-zinc-400 mt-2 text-sm">
              Enterprise Resource Planning connected directly to your decentralized workforce operations.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg hover:bg-zinc-800 text-sm font-medium transition-colors">
              <RefreshCcw className="w-4 h-4" />
              Sync SAP/Oracle
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2bb75c] hover:bg-#2bb75c] text-white rounded-lg text-sm font-medium transition-colors">
              <BarChart4 className="w-4 h-4" />
              Generate ERP Report
            </button>
          </div>
        </div>

        {/* Global ERP KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Capital Allocated', val: '$2.4M', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Field Assets Deployed', val: '1,204', icon: Box, color: 'text-blue-400', bg: 'bg-#2bb75c]/10' },
            { label: 'Supply Chain Syncs', val: 'Daily', icon: Truck, color: 'text-orange-400', bg: 'bg-orange-500/10' },
            { label: 'AI Prediction Confidence', val: '94.2%', icon: Cpu, color: 'text-#2bb75c]', bg: 'bg-[#2bb75c]/10' },
          ].map((item, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 backdrop-blur-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm font-medium">{item.label}</span>
                <div className={`p-2 rounded-lg ${item.bg}`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{item.val}</div>
            </div>
          ))}
        </div>

        {/* Asset & Inventory Management */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl backdrop-blur-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#2bb75c]" />
              Field Asset & Equipment Ledger
            </h2>
            <span className="text-sm text-zinc-400">Last synced: 2 mins ago</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2 overflow-hidden rounded-lg border border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950/80 text-zinc-400">
                  <tr>
                    <th className="p-3 font-medium">Asset Category</th>
                    <th className="p-3 font-medium">Assigned To</th>
                    <th className="p-3 font-medium">Location</th>
                    <th className="p-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  <tr className="hover:bg-zinc-800/30">
                    <td className="p-3 text-white">Geospatial Drones (DJI M300)</td>
                    <td className="p-3 text-zinc-300">Survey Team Alpha</td>
                    <td className="p-3 text-zinc-300">Site B, Nairobi</td>
                    <td className="p-3 text-right text-emerald-400">Operational</td>
                  </tr>
                  <tr className="hover:bg-zinc-800/30">
                    <td className="p-3 text-white">Heavy Machinery Tools</td>
                    <td className="p-3 text-zinc-300">Construction Hub Y</td>
                    <td className="p-3 text-zinc-300">Mombasa Port</td>
                    <td className="p-3 text-right text-orange-400">Maintenance</td>
                  </tr>
                  <tr className="hover:bg-zinc-800/30">
                    <td className="p-3 text-white">MacBook Pro (M2) Fleet</td>
                    <td className="p-3 text-zinc-300">Remote Dev Agency</td>
                    <td className="p-3 text-zinc-300">Global Distributed</td>
                    <td className="p-3 text-right text-emerald-400">Operational</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-950/50 p-4 border border-zinc-800 rounded-lg">
                <h3 className="text-sm font-medium text-white mb-2">Automated Replenishment</h3>
                <p className="text-xs text-zinc-400 mb-3">
                  AI detects when consumable field assets drop below threshold and triggers automated procurement requests.
                </p>
                <button className="w-full py-2 bg-[#2bb75c]/20 text-[#2bb75c] hover:bg-[#2bb75c]/30 rounded text-sm font-medium transition-colors">
                  View Active Requisitions
                </button>
              </div>

              <div className="bg-zinc-950/50 p-4 border border-zinc-800 rounded-lg">
                <h3 className="text-sm font-medium text-white mb-2">Depreciation Analytics</h3>
                <p className="text-xs text-zinc-400 mb-3">
                  Link asset lifespan to specific ongoing gig contracts for granular project margin calculations.
                </p>
                <div className="h-2 w-full bg-zinc-800 rounded-full mt-2">
                  <div className="h-2 bg-gradient-to-r from-#2bb75c] to-[#1d8d38] rounded-full w-[65%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

