import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { WidgetData } from '../types/role';

interface WidgetCardProps {
  data: WidgetData;
  loading?: boolean;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ data, loading }) => {
  const Icon = data.icon;
  const isPositive = data.trend >= 0;

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-[24px] border border-zinc-200 shadow-sm animate-pulse">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 bg-zinc-100 rounded-2xl"></div>
          <div className="w-12 h-6 bg-surface rounded-full"></div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="w-20 h-3 bg-zinc-100 rounded"></div>
          <div className="w-24 h-8 bg-zinc-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-[24px] border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-2xl transition-colors ${data.color}`}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-success' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {Math.abs(data.trend)}%
        </div>
      </div>
      <div className="mt-4">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{data.title}</p>
        <h3 className="text-2xl font-bold text-zinc-900 mt-1 tracking-tight group-hover:text-brand-600 transition-colors">
          {data.value}
        </h3>
      </div>
    </div>
  );
};

export default WidgetCard;
