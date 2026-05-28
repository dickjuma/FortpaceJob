import React, { useState } from 'react';
import { 
  Clock, Eye, Play, Trash, CheckCircle, 
  Settings, AlertTriangle, RefreshCw, Zap, ArrowRight, Camera 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ClientTimeTrackingPage() {
  const [logs, setLogs] = useState([
    { id: 'LOG-001', worker: 'Kiprotich Arap', task: 'Pipeline Site Alignment Survey', hours: 4.5, rate: 'KES 2,500/hr', amount: 11250, status: 'Approved', screenshot: 'N/A (GPS Verified Onsite Check-In)' },
    { id: 'LOG-002', worker: 'Sarah Jenkins', task: 'Interactive Framer Motion Dashboards', hours: 8.2, rate: 'KES 3,500/hr', amount: 28700, status: 'Pending Review', screenshot: 'screenshot_nairobi_flexbox.png' },
    { id: 'LOG-003', worker: 'Grace Mutua', task: 'Fiber Cable Splicing Audits', hours: 6.0, rate: 'KES 3,200/hr', amount: 19200, status: 'Approved', screenshot: 'N/A (GPS Verified Onsite Check-In)' }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleApproveLog = (logId, name, amount) => {
    setIsLoading(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Approving KES ${amount.toLocaleString()} work hours billing for ${name}...`,
        success: () => {
          setLogs(prev => prev.map(l => l.id === logId ? { ...l, status: 'Approved' } : l));
          setIsLoading(false);
          return `Time log approved! Milestone payment scheduled. 💳`;
        },
        error: 'Approval failed.'
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white bg-zinc-950/20 rounded-3xl animate-in fade-in duration-500">
      <Toaster position="top-right" />

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Time Logs & Activity Tracker</h1>
          <p className="text-xs font-semibold text-light-gray/50 mt-1">Audit active hourly billing sheets, review geo-tagged screenshot proofs, and approve completed work logs.</p>
        </div>

        <Button onClick={() => toast.success('Time log CSV spreadsheet downloaded.')} className="bg-accent-purple border-none rounded-xl text-xs font-bold py-2.5 flex items-center gap-1.5 shadow-lg shadow-accent-purple/20">
          Export Timesheets
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Hand: Configured Rules list */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-white/10 bg-white/5 p-6 rounded-3xl">
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-accent-purple" /> Logged Billing Sheets</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead>
                  <tr className="border-b border-white/5 text-light-gray/40 text-[10px] uppercase tracking-wider font-black">
                    <th className="pb-3">Field Operator</th>
                    <th className="pb-3">Logged Task</th>
                    <th className="pb-3">Hours</th>
                    <th className="pb-3">Billing Amount</th>
                    <th className="pb-3">Screenshot Proof</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 font-bold text-white flex items-center gap-2">
                        <span>{log.worker}</span>
                      </td>
                      <td className="py-4 text-light-gray">{log.task}</td>
                      <td className="py-4 font-mono text-light-gray">{log.hours} Hrs</td>
                      <td className="py-4 font-black text-white">KES {log.amount.toLocaleString()}</td>
                      <td className="py-4">
                        <span className="flex items-center gap-1 text-[10px] text-light-gray/60 font-mono">
                          <Camera className="w-3.5 h-3.5 text-accent-purple" /> {log.screenshot}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {log.status === 'Pending Review' ? (
                          <Button 
                            disabled={isLoading}
                            onClick={() => handleApproveLog(log.id, log.worker, log.amount)}
                            className="bg-success hover:bg-success/90 border-none font-bold text-[9px] py-1.5 px-3 rounded-lg"
                          >
                            Approve Time
                          </Button>
                        ) : (
                          <span className="text-[10px] text-light-gray/30 font-bold flex items-center justify-end gap-1"><CheckCircle className="w-3.5 h-3.5 text-success" /> Approved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Hand: Visual Nodes Diagram simulation */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 border border-white/10 bg-white/5 rounded-3xl space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider border-b border-white/5 pb-3">Active Hourly Summary</h3>
            
            <div className="space-y-4 text-xs font-bold text-light-gray/60">
              <div className="flex justify-between items-center">
                <span>Total Tracked This Week:</span>
                <span className="text-white font-mono">18.7 Hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Billing Total:</span>
                <span className="text-success font-mono">KES 59,150</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Pending Approvals Queue:</span>
                <span className="text-orange-400 font-mono animate-pulse">1 Log Pending</span>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
