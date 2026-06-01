import React, { useState } from 'react';
import { 
  GitBranch, Play, Plus, Trash, CheckCircle, 
  Settings, AlertTriangle, RefreshCw, Zap, ArrowRight 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ClientWorkflowBuilderPage() {
  const [workflows, setWorkflows] = useState([
    { id: 'WF-1', name: 'On Site Check-In -> Fund Escrow', active: true, trigger: 'Site Check-In', action: 'Auto-Release Travel Allowance' },
    { id: 'WF-2', name: 'Geofence Breach -> Lock Payroll', active: true, trigger: 'Geofence Boundary breach', action: 'Dispatch Warning SMS & Lock Release' },
    { id: 'WF-3', name: 'M-Pesa STK Completed -> Generate Tax Receipt', active: false, trigger: 'M-Pesa STK Push Success', action: 'Send KRA Withholding Record' }
  ]);

  const toggleWorkflow = (id) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
    toast.success('Workflow configuration state toggled.');
  };

  const triggerTest = (name) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Simulating trigger node for "${name}"...`,
        success: 'Workflow triggered successfully! Actions dispatched. 🚀',
        error: 'Simulation failed.'
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white">
      <Toaster position="top-right" />

      {/* Header title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Automation & Workflow Builder</h1>
          <p className="text-xs font-semibold text-light-gray/50 mt-1">Design drag-n-drop automation sequences, connect field worker telemetry to fintech releases, and configure notification rules.</p>
        </div>

        <Button onClick={() => toast.success('New workflow node instantiated.')} className="bg-success border-none rounded-xl text-xs font-bold py-2.5 flex items-center gap-1.5 shadow-lg shadow-[#14a800]/20">
          <Plus className="w-4 h-4" /> Create Automation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Hand: Configured Rules list */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-white/10 bg-white/5 p-6 rounded-3xl">
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2"><GitBranch className="w-4 h-4 text-success" /> Configured Automation Sequences</h3>
            
            <div className="space-y-4">
              {workflows.map(wf => (
                <div key={wf.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-success">{wf.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        wf.active ? 'bg-success/20 text-success' : 'bg-white/10 text-light-gray/40'
                      }`}>{wf.active ? 'Active' : 'Disabled'}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{wf.name}</h4>
                    
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-light-gray/50 mt-2 font-semibold">
                      <span className="bg-white/5 px-2 py-0.5 rounded text-white font-mono">{wf.trigger}</span>
                      <ArrowRight size={10} />
                      <span className="bg-success/20 px-2 py-0.5 rounded text-success font-mono">{wf.action}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
                    <button 
                      onClick={() => toggleWorkflow(wf.id)}
                      className="text-xs font-bold text-light-gray/50 hover:text-white transition-colors"
                    >
                      {wf.active ? 'Disable' : 'Enable'}
                    </button>
                    
                    <Button 
                      onClick={() => triggerTest(wf.name)}
                      className="bg-success hover:bg-success/90 border-none font-bold text-[9px] py-1.5 px-3 rounded-lg flex items-center gap-1"
                    >
                      <Play size={10} /> Dry Run
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Hand: Visual Nodes Diagram simulation */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 border border-white/10 bg-white/5 rounded-3xl space-y-4 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 blur-[50px] rounded-full"></div>
            
            <div className="border-b border-white/5 pb-3">
              <h3 className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5 text-success"><Zap className="w-4 h-4" /> Live Execution Node Map</h3>
              <p className="text-[9px] text-light-gray/50 mt-1">Visual graph simulator for field triggers</p>
            </div>

            <div className="flex-1 py-4 flex flex-col items-center justify-center gap-4 relative z-10">
              <div className="w-48 p-3 bg-zinc-900 border border-success text-center rounded-xl font-bold text-[10px] tracking-wide text-success shadow">
                ⚡ Check-In QR Scanned
              </div>
              <div className="w-0.5 h-6 bg-white/20"></div>
              <div className="w-48 p-3 bg-zinc-900 border border-success text-center rounded-xl font-bold text-[10px] tracking-wide text-success shadow">
                ⚙️ Check GPS Centroid
              </div>
              <div className="w-0.5 h-6 bg-white/20"></div>
              <div className="w-48 p-3 bg-success text-zinc-950 text-center rounded-xl font-black text-[10px] tracking-wide shadow-lg">
                💸 Release Travel Escrow
              </div>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-[9px] font-bold text-light-gray/60 flex items-center justify-between">
              <span>Simulation Status:</span>
              <span className="text-success flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success animate-ping"></span> LISTENING</span>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
