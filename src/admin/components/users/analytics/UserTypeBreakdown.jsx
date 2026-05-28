import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DATA = [
  { name: 'Admins', value: 8, color: '#6366f1' },
  { name: 'Freelancers', value: 25, color: '#10b981' },
  { name: 'Clients', value: 17, color: '#3b82f6' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface-dark border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{data.name}</p>
        <p className="text-sm font-black text-white">{data.value} users ({Math.round(data.value / 50 * 100)}%)</p>
      </div>
    );
  }
  return null;
};

/**
 * Donut chart visualizing the distribution of user types.
 */
const UserTypeBreakdown = () => {
  const total = DATA.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div className="bg-white dark:bg-surface-dark border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">User Distribution</h3>
      
      <div className="h-[240px] relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">{total}</span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total</span>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={DATA}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
            >
              {DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 mt-6">
        {DATA.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{item.name}</span>
            </div>
            <span className="text-xs font-black text-zinc-900 dark:text-white">
              {Math.round(item.value / total * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTypeBreakdown;
