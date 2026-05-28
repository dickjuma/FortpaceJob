import React, { useState } from 'react';
import { 
  ShieldCheck, User, Bell, CreditCard, Lock, Smartphone, 
  MapPin, XCircle, Key, Eye, Monitor, LogOut
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function ClientSecurityCenterPage() {
  const [activeTab, setActiveTab] = useState('Profile');

  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Security', icon: ShieldCheck },
    { name: 'Notifications', icon: Bell },
    { name: 'Payment Methods', icon: CreditCard },
  ];

  const sessions = [
    { id: 1, device: 'MacBook Pro 16', browser: 'Chrome', location: 'Nairobi, Kenya', ip: '197.248.82.10', active: true },
    { id: 2, device: 'iPhone 15 Pro Max', browser: 'Forte App', location: 'Mombasa, Kenya', ip: '102.222.140.8', active: false },
  ];

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleRevoke = (device) => {
    toast.success(`Revoked access for ${device}`);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white bg-zinc-950 min-h-screen">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
        }} 
      />

      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 mb-8">
        <h1 className="text-3xl font-black tracking-tight text-white">Settings & Preferences</h1>
        <p className="text-sm font-semibold text-zinc-400 mt-1">Manage your account profile, security protocols, and notification preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Vertical Tabs */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex flex-col gap-1 sticky top-6">
            {tabs.map(tab => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  activeTab === tab.name 
                    ? 'bg-vivid-lavender/10 text-vivid-lavender' 
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.name ? 'text-vivid-lavender' : 'text-zinc-500'}`} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Tab Content */}
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
          
          {activeTab === 'Profile' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Company Profile</h2>
                <p className="text-sm text-zinc-400">Update your public facing business information.</p>
              </div>

              <div className="flex items-center gap-6 pb-6 border-b border-zinc-800">
                <div className="w-24 h-24 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-3xl font-bold text-white shrink-0">
                  FS
                </div>
                <div>
                  <div className="flex gap-3">
                    <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-zinc-700">
                      Change Logo
                    </button>
                    <button className="text-red-400 hover:text-red-300 font-bold text-sm px-4 py-2 transition-colors">
                      Remove
                    </button>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Company Name</label>
                  <input type="text" defaultValue="ForteSpace HQ" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-vivid-lavender transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Industry</label>
                  <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-vivid-lavender transition-colors appearance-none">
                    <option>Technology & Software</option>
                    <option>Design & Creative</option>
                    <option>Construction</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Company Description</label>
                  <textarea rows="4" defaultValue="Leading tech innovator based in Nairobi." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-vivid-lavender transition-colors resize-none"></textarea>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-zinc-800">
                <button onClick={handleSave} className="bg-vivid-lavender hover:bg-dark-purple text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-vivid-lavender/20">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Security & Access</h2>
                <p className="text-sm text-zinc-400">Manage your password and secure your account.</p>
              </div>

              {/* Password Change */}
              <div className="space-y-4 pb-8 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-vivid-lavender" /> Change Password
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-vivid-lavender transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-vivid-lavender transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-vivid-lavender transition-colors" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={handleSave} className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors border border-zinc-700">
                    Update Password
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-vivid-lavender" /> Active Sessions
                </h3>
                <div className="space-y-3">
                  {sessions.map(s => (
                    <div key={s.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-vivid-lavender shrink-0">
                          {s.device.includes('iPhone') ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{s.device} <span className="text-zinc-500 font-normal">({s.browser})</span></h4>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-500 mt-1 font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {s.location}</span>
                            <span>•</span>
                            <span className="font-mono">{s.ip}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0">
                        {s.active ? (
                          <span className="text-[10px] font-black uppercase text-vivid-green px-2 py-1 bg-vivid-green/10 border border-vivid-green/20 rounded">Current Session</span>
                        ) : (
                          <button 
                            onClick={() => handleRevoke(s.device)}
                            className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 font-bold text-xs"
                          >
                            <XCircle className="w-4 h-4" /> Revoke
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Notification Preferences</h2>
                <p className="text-sm text-zinc-400">Control what alerts you receive and how.</p>
              </div>

              <div className="space-y-6 pt-4">
                
                <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">New Proposals</h4>
                    <p className="text-xs text-zinc-500">Get notified when a freelancer bids on your project.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vivid-lavender"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Direct Messages</h4>
                    <p className="text-xs text-zinc-500">Get notified for new messages from freelancers.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vivid-lavender"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Marketing & Promotions</h4>
                    <p className="text-xs text-zinc-500">Receive emails about new features and discounts.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vivid-lavender"></div>
                  </label>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'Payment Methods' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Payment Methods</h2>
                <p className="text-sm text-zinc-400">Manage your saved cards and escrow funding sources.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                
                {/* Saved Card */}
                <div className="bg-zinc-950 border border-vivid-lavender/50 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-vivid-lavender/10 blur-[30px] rounded-full"></div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-xs font-black uppercase tracking-widest text-vivid-lavender bg-vivid-lavender/10 px-2 py-1 rounded border border-vivid-lavender/20">Default</div>
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-lg font-mono tracking-widest text-white mb-1">•••• •••• •••• 4242</p>
                  <div className="flex justify-between text-xs text-zinc-500 font-bold uppercase tracking-wider">
                    <span>Expires 12/28</span>
                    <span>Visa</span>
                  </div>
                </div>

                {/* Add New */}
                <button className="bg-zinc-950 border-2 border-dashed border-zinc-800 hover:border-vivid-lavender hover:bg-zinc-900 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 transition-colors text-zinc-500 hover:text-vivid-lavender min-h-[140px]">
                  <CreditCard className="w-6 h-6" />
                  <span className="text-sm font-bold">Add New Method</span>
                </button>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
