// @ts-nocheck
import React from 'react';
import { Card } from './Card';
import clsx from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';


export const MetricCard = ({ title, value, icon, trend }: any) => {
  return (
    <Card hover className="h-full">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <h4 className="text-2xl font-bold text-[#222222]">{value}</h4>
          
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <span 
                className={clsx(
                  'flex items-center font-medium',
                  trend.isPositive ? 'text-success' : 'text-error'
                )}
              >
                {trend.isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {trend.value}%
              </span>
              <span className="text-text-secondary ml-2">vs last month</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-3 bg-light-gray rounded-lg text-[#e63946]">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;
