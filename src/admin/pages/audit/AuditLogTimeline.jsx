import React from 'react';
import { Clock, Shield, User, FileText, Activity, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuditLogTimeline() {
  const logs = [
    { id: 1, type: 'auth', title: 'Admin Login', user: 'superadmin@fortespace.com', ip: '192.168.1.1', time: '10:42 AM', icon: User, color: 'text-brand-600 bg-brand-50 dark:bg-brand-900/20' },
    { id: 2, type: 'contract', title: 'Contract CON-9921 Force Paused', user: 'Alex Moderation', ip: '10.0.0.5', time: '11:15 AM', icon: Shield, color: 'text-danger bg-danger/10' },
    { id: 3, type: 'system', title: 'Fraud Rule #4 Triggered', user: 'SYSTEM (AutoMod)', ip: 'N/A', time: '12:05 PM', icon: Activity, color: 'text-warning bg-warning/10' },
    { id: 4, type: 'escrow', title: 'Manual Escrow Refund', user: 'Finance Admin', ip: '10.0.0.8', time: '1:30 PM', icon: FileText, color: 'text-success bg-success/10' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-sans">
      <div className="mb-8 border-b border-gray-200 dark:border-surface-dark-border pb-6">
        <h1 className="text-2xl font-bold text-surface-dark dark:text-white">Audit Log & Activity</h1>
        <p className="text-sm text-gray-500 mt-1">Immutable record of all critical system actions, API calls, and administrative overrides.</p>
      </div>

      <div className="relative border-l-2 border-gray-200 dark:border-surface-dark-border ml-6 space-y-12 pb-12">
        {logs.map((log, idx) => {
          const Icon = log.icon;
          return (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={log.id} 
              className="relative pl-8"
            >
              {/* Timeline dot */}
              <div className={`absolute -left-[21px] top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-surface-tertiary dark:border-surface-dark ${log.color} shadow-sm z-10`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Content Card */}
              <div className="bg-white dark:bg-surface-dark-secondary border border-gray-200 dark:border-surface-dark-border rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-surface-dark dark:text-white">{log.title}</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1 flex items-center">
                      <User className="w-3 h-3 mr-1" /> {log.user}
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-bold text-gray-400 bg-surface dark:bg-surface-dark-tertiary px-3 py-1.5 rounded-badge">
                    <Clock className="w-3 h-3 mr-1" /> {log.time}
                  </div>
                </div>
                
                <div className="bg-surface-tertiary dark:bg-surface-dark p-4 rounded-xl text-sm font-mono text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-surface-dark-border">
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="flex items-center"><MapPin className="w-3 h-3 mr-2" /> IP: {log.ip}</div>
                    <div>Event ID: EVT-{log.id}8492</div>
                    <div className="col-span-2 mt-2 pt-2 border-t border-gray-200 dark:border-surface-dark-border text-brand-600 dark:text-brand-400 cursor-pointer hover:underline">
                      View Raw Payload JSON
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
