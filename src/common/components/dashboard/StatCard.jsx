import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'indigo' }) => {
  const isPositive = trend === 'up';
  
  const colorMap = {
    indigo: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-500/10',
    emerald: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10',
    blue: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10',
    amber: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{title}</h3>
        {Icon && (
          <div className={`p-2 rounded-xl ${colorMap[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">{value}</span>
      </div>

      {trendValue && (
        <div className="mt-3 flex items-center text-sm font-medium">
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
            {trendValue}
          </span>
          <span className="text-zinc-400 ml-1">vs last month</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
