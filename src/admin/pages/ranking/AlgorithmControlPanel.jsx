import React, { useState } from 'react';
import { Settings, Sliders, AlertTriangle, Shield, Activity, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AlgorithmControlPanel() {
  const [weights, setWeights] = useState({
    skillRelevance: 40,
    trustScore: 25,
    ratingInfluence: 20,
    responseRate: 15,
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 font-sans">
      <div className="mb-8 flex justify-between items-center border-b border-gray-200 dark:border-surface-dark-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-surface-dark dark:text-white flex items-center gap-3">
            <Sliders className="w-8 h-8 text-[#4C1D95]" /> AI Algorithm Weights Control
          </h1>
          <p className="text-sm text-gray-500 mt-1">Super Admin interface to tune the global ranking & matching engine coefficients.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-[#4C1D95]/20 text-[#4C1D95] bg-[#4C1D95]/5 rounded-lg text-sm font-bold flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" /> Run Simulation
          </button>
          <button className="px-6 py-2 bg-[#4C1D95] hover:bg-[#22C55E] text-white rounded-lg text-sm font-bold shadow-md">
            Deploy Live
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sliders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl shadow-card overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-surface-dark-border bg-surface-secondary dark:bg-surface-dark-secondary">
              <h2 className="text-lg font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-gray-500" /> Base Ranking Coefficients</h2>
            </div>
            
            <div className="p-6 space-y-8">
              {[
                { key: 'skillRelevance', label: 'Skill Match Relevance', desc: 'Weight of keyword/semantic skill matching', color: 'bg-[#4C1D95]' },
                { key: 'trustScore', label: 'Trust & Verification Score', desc: 'Impact of KYC, escrow history, and disputes', color: 'bg-success' },
                { key: 'ratingInfluence', label: 'Historical Rating Impact', desc: 'Weight of past 5-star ratings from clients', color: 'bg-warning' },
                { key: 'responseRate', label: 'Availability / Response Rate', desc: 'Boost for freelancers online and responsive', color: 'bg-accent' },
              ].map((item) => (
                <div key={item.key}>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h4 className="font-bold text-surface-dark dark:text-white">{item.label}</h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <span className="text-xl font-black text-surface-dark dark:text-white w-12 text-right">{weights[item.key]}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={weights[item.key]}
                    onChange={(e) => setWeights({...weights, [item.key]: parseInt(e.target.value)})}
                    className="w-full h-2 bg-surface-tertiary dark:bg-surface-dark-secondary rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
              
              {Object.values(weights).reduce((a, b) => a + b, 0) !== 100 && (
                <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-3 text-danger text-sm font-bold">
                  <AlertTriangle className="w-5 h-5" /> Total coefficients must exactly equal 100%. Current: {Object.values(weights).reduce((a, b) => a + b, 0)}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Real-time Simulator Stats */}
        <div className="space-y-6">
          <div className="bg-surface-dark text-white rounded-2xl p-6 shadow-card border border-surface-dark-border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-[#4C1D95]" /> Simulation Forecast</h3>
            <p className="text-sm text-gray-400 mb-6">Changing these weights will cause the following estimated shifts in marketplace distribution:</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span>Top 10% Talent Shift</span>
                <span className="font-bold text-danger">-2.4%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Newcomer Visibility</span>
                <span className="font-bold text-success">+5.1%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Enterprise Match Rate</span>
                <span className="font-bold text-[#4C1D95]">+1.2%</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-surface-dark-tertiary">
              <div className="flex items-start gap-3 p-3 bg-[#4C1D95]/30 rounded-xl border border-[#4C1D95]/20/50">
                <Shield className="w-5 h-5 text-[#4C1D95] shrink-0 mt-0.5" />
                <p className="text-xs text-[#4C1D95] leading-relaxed">
                  <strong>AI Guardrail:</strong> Trust Score weight dropped below 30%. This may increase exposure to high-risk accounts. Proceed with caution.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


