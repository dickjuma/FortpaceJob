import React, { useState } from 'react';
import { 
  Navigation, Eye, AlertTriangle, CheckCircle, 
  Map, User, History, Compass, ShieldAlert 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ClientGpsTrackingPage() {
  const [activeTab, setActiveTab] = useState('live');

  const activeTracking = [
    { id: 1, name: 'Kiprotich Arap', site: 'Pipeline Site A', checkin: '08:14 AM', status: 'Inside Geofence', coordinates: '1.2921° S, 36.8219° E', battery: '82%' },
    { id: 2, name: 'Grace Mutua', site: 'Substation B', checkin: '09:30 AM', status: 'Out of Boundary', coordinates: '1.2990° S, 36.8902° E', battery: '95%' },
    { id: 3, name: 'Hassan Farah', site: 'Pipeline Site A', checkin: '08:02 AM', status: 'Inside Geofence', coordinates: '1.2925° S, 36.8210° E', battery: '41%' }
  ];

  const routeReplays = [
    { time: '12:30 PM', event: 'Grace Mutua checked out from Substation B', status: 'info' },
    { time: '11:15 AM', event: 'Kiprotich Arap reached Pipeline Site A centroid', status: 'success' },
    { time: '09:42 AM', event: 'Geofence Breach alert triggered by Operator #2 (Grace Mutua)', status: 'alert' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white">
      <Toaster position="top-right" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Active Field GPS Tracker</h1>
          <p className="text-xs font-semibold text-light-gray/50 mt-1">Real-time geo-location logs, safety boundaries checklists, and automated checked-in logs.</p>
        </div>

        <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-xl text-xs font-bold">
          <button 
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'live' ? 'bg-success text-white shadow' : 'text-light-gray/60 hover:text-white'}`}
          >
            Live Tracking
          </button>
          <button 
            onClick={() => setActiveTab('routes')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'routes' ? 'bg-success text-white shadow' : 'text-light-gray/60 hover:text-white'}`}
          >
            Route Replays
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Hand: Active worker list with stats */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'live' ? (
            <Card className="border border-white/10 bg-white/5 p-6 rounded-3xl">
              <h3 className="font-black text-sm uppercase tracking-wider mb-4">Checked-In Field Professionals</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium">
                  <thead>
                    <tr className="border-b border-white/5 text-light-gray/40 text-[10px] uppercase tracking-wider font-black">
                      <th className="pb-3">Field Operator</th>
                      <th className="pb-3">Assigned Site</th>
                      <th className="pb-3">Check-In Time</th>
                      <th className="pb-3">GPS Location</th>
                      <th className="pb-3">Battery</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {activeTracking.map(w => (
                      <tr key={w.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 font-bold text-white flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center font-bold text-xs"><User size={14} /></div>
                          <span>{w.name}</span>
                        </td>
                        <td className="py-4 text-light-gray">{w.site}</td>
                        <td className="py-4 font-mono text-light-gray/70">{w.checkin}</td>
                        <td className="py-4 font-mono text-light-gray/70">{w.coordinates}</td>
                        <td className="py-4 text-light-gray">{w.battery}</td>
                        <td className="py-4 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            w.status === 'Inside Geofence' 
                              ? 'bg-success/20 text-success' 
                              : 'bg-[#e63946]/20 text-[#e63946] animate-pulse'
                          }`}>
                            {w.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card className="border border-white/10 bg-white/5 p-6 rounded-3xl space-y-4">
              <h3 className="font-black text-sm uppercase tracking-wider mb-2">Live Route Callback Logs</h3>
              <div className="space-y-3 font-mono text-xs">
                {routeReplays.map((r, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3.5 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      {r.status === 'alert' ? <ShieldAlert className="w-4 h-4 text-[#e63946] shrink-0" /> : <Compass className="w-4 h-4 text-success shrink-0" />}
                      <span className={r.status === 'alert' ? 'text-[#e63946] font-bold' : 'text-light-gray'}>{r.event}</span>
                    </div>
                    <span className="text-[10px] text-light-gray/40 font-bold">{r.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Side: Geofence limits widgets */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border border-white/10 bg-white/5 rounded-3xl space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider border-b border-white/5 pb-3">Geofencing & Security Settings</h3>
            
            <div className="space-y-4 text-xs font-bold text-light-gray/60">
              <div className="flex justify-between items-center">
                <span>Auto-Checkin Alerts:</span>
                <span className="text-success font-black">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Radius Boundary Breach Triggers:</span>
                <span className="text-success font-black">SMS DISPATCH</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Battery Low Warning Limit:</span>
                <span className="text-white font-mono">20% Threshold</span>
              </div>
            </div>

            <Button onClick={() => toast.success('Boundary coordinates locked.')} className="w-full bg-success border-none rounded-xl text-xs font-bold py-2.5">
              Edit Boundaries Matrix
            </Button>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#222222] to-zinc-900 border border-white/10 text-white rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#e63946]/20 blur-[50px] rounded-full"></div>
            <h4 className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5 mb-3 text-[#e63946]">
              <AlertTriangle className="w-4 h-4" /> 1 active Geofence Breach
            </h4>
            <p className="text-[10px] font-semibold text-white/70 leading-relaxed mb-4">
              Grace Mutua has traveled beyond the structured coordinate limits of Nairobi Substation B radius (exceeded by 1.4 KM).
            </p>
            <Button onClick={() => toast.success('Dispatched coordinator alert.')} className="w-full bg-[#e63946] hover:bg-[#e63946]/90 border-none rounded-xl text-xs font-bold py-2">
              Dispatch Warning Alert
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
}
