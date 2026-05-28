import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { subDays, format } from 'date-fns';

const DATA = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 29 - i), 'MMM dd'),
  users: Math.floor(Math.random() * 50) + 20,
}));

/**
 * Compact sparkline chart for user registration trends.
 */
const UserGrowthMiniChart = ({ title = "New Registrations", color = "#6366f1" }) => {
  return (
    <div className="bg-white dark:bg-surface-dark border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <div>
           <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{title}</h4>
           <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">1,284</p>
        </div>
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-success dark:bg-emerald-950/20">
          +14.2%
        </span>
      </div>

      <div className="h-[120px] -mx-6 -mb-6 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-surface-dark border border-white/10 px-3 py-2 rounded-xl shadow-2xl">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{payload[0].payload.date}</p>
                      <p className="text-xs font-black text-white">{payload[0].value} New Users</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="users" 
              stroke={color} 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorUsers)" 
              className="transition-all duration-1000"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserGrowthMiniChart;
