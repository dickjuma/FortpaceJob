import React from 'react';
import StatWidget from './StatWidget';
import { cn } from '../../utils/cn';

const WidgetGrid = ({ widgets, data, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {widgets.map((widget, index) => {
        const spanClass = {
          sm: 'col-span-1',
          md: 'col-span-1',
          lg: 'col-span-1 lg:col-span-2',
          xl: 'col-span-1 lg:col-span-3',
          full: 'col-span-full',
        }[widget.size] || 'col-span-1';

        const value = data?.[widget.dataKey] ?? 0;

        return (
          <div 
            key={widget.id} 
            className={cn(
              spanClass, 
              "animate-in fade-in slide-up duration-500 fill-mode-both"
            )}
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <StatWidget 
              config={widget} 
              value={Number(value)} 
              loading={loading} 
            />
          </div>
        );
      })}
    </div>
  );
};

export default WidgetGrid;
