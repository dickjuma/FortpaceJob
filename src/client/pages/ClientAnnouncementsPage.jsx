import React, { useState } from 'react';
import { 
  Megaphone, Plus, Bell, Send, 
  Terminal, ShieldCheck, Mail, Speaker, Play 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../platform/components/common/Card';
import Button from '../../platform/components/common/Button';

export default function ClientAnnouncementsPage() {
  const [broadcasts, setBroadcasts] = useState([
    { id: 'BC-901', title: 'System Migration Substation B Complete', group: 'All Operators', author: 'Alex Morgan (CFO)', date: 'Today, 10:14 AM', urgency: 'Normal' },
    { id: 'BC-884', title: 'URGENT: Geofencing Safety Protocol Update', group: 'Onsite Inspectors', author: 'Sarah Jenkins (Ops)', date: 'Today, 08:30 AM', urgency: 'High' }
  ]);

  const [simText, setSimText] = useState('Safety checklist mandatory for all checked-in pipeline operators.');
  const [urgency, setUrgency] = useState('Normal');

  const dispatchBroadcast = (e) => {
    e.preventDefault();
    if (!simText.trim()) return;

    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Encrypting and broadcasting alert to field workforce mobile units...',
        success: () => {
          setBroadcasts(prev => [
            {
              id: 'BC-' + Math.floor(100 + Math.random() * 900),
              title: simText,
              group: 'Active Crew Onsite',
              author: 'Corporate Command',
              date: 'Just Now',
              urgency: urgency
            },
            ...prev
          ]);
          setSimText('');
          return 'Broadcast successfully dispatched via Push, SMS, and Portal alert! 📣';
        },
        error: 'Dispatch failed.'
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white">
      <Toaster position="top-right" />

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Announcements & Broadcasts</h1>
          <p className="text-xs font-semibold text-light-gray/50 mt-1">Dispatch high-priority bulletins, stream live voice announcements to active field crews, and review alert read-receipt compliance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Create a Broadcast */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 border border-white/10 bg-white/5 rounded-3xl space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5"><Megaphone className="w-4 h-4 text-success" /> Dispatch Bulletin</h3>
            
            <form onSubmit={dispatchBroadcast} className="space-y-4 pt-2">
              <div className="flex flex-col gap-1.5 text-xs font-bold text-light-gray/60">
                <label>Announcement Text / Alert Message</label>
                <textarea 
                  rows="3"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-success text-white/95 placeholder-light-gray/40 resize-none text-xs"
                  placeholder="Type important bulletins here..."
                  value={simText}
                  onChange={e => setSimText(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5 text-xs font-bold text-light-gray/60">
                <label>Target Crew Urgency</label>
                <select 
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-success text-white/95"
                  value={urgency}
                  onChange={e => setUrgency(e.target.value)}
                >
                  <option value="Normal">Normal Urgency (Portal + Email)</option>
                  <option value="High">High Urgency (Portal + SMS + Push Alert)</option>
                </select>
              </div>

              <Button 
                type="submit"
                className="w-full bg-success border-none rounded-xl text-xs font-bold py-2.5 flex items-center justify-center gap-2"
              >
                <Send size={14} /> Dispatch Broadcast
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Side: Active Bulletins List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-white/10 bg-white/5 p-6 rounded-3xl">
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-success" /> Dispatched Live Bulletins ({broadcasts.length})</h3>
            
            <div className="space-y-4">
              {broadcasts.map(bc => (
                <div key={bc.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-success">{bc.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        bc.urgency === 'High' ? 'bg-[#e63946]/20 text-[#e63946] animate-pulse' : 'bg-white/10 text-light-gray/60'
                      }`}>{bc.urgency} Priority</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{bc.title}</h4>
                    
                    <div className="flex flex-wrap items-center gap-2 text-[9px] text-light-gray/40 mt-2 font-semibold">
                      <span>Sender: {bc.author}</span>
                      <span>•</span>
                      <span>Target: {bc.group}</span>
                      <span>•</span>
                      <span>{bc.date}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => toast.success('Dispatching audio read-receipt sequence...')}
                    className="text-light-gray/40 hover:text-white transition-colors flex items-center gap-1 font-bold text-[10px]"
                  >
                    <Speaker size={14} /> Read Receipts (100%)
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
