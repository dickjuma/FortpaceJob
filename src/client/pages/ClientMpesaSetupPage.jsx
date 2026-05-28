import React, { useState } from 'react';
import { 
  Smartphone, ShieldCheck, Key, RefreshCw, Send, 
  Terminal, Globe, DollarSign, Database, AlertCircle 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ClientMpesaSetupPage() {
  const [credentials, setCredentials] = useState({ consumerKey: 'daraja_key_prod_898a', consumerSecret: '••••••••••••••••••••••••' });
  const [callbackUrl, setCallbackUrl] = useState('https://api.fortespace.com/v1/payments/mpesa-callback');
  const [simPhone, setSimPhone] = useState('254711002233');
  const [simAmount, setSimAmount] = useState('1500');
  const [logs, setLogs] = useState([
    { time: '13:40:02', event: 'Webhooks verification status: CONNECTED (200 OK)', type: 'system' },
    { time: '13:38:15', event: 'Daraja access_token refreshed successfully.', type: 'auth' }
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  const triggerStkSim = (e) => {
    e.preventDefault();
    if (!simPhone.startsWith('254') || simPhone.length !== 12) {
      toast.error('Please enter a valid phone number starting with 254 (e.g. 254711002233)');
      return;
    }

    setIsSimulating(true);
    const trackingId = 'REQ-' + Math.floor(100000 + Math.random() * 900000);

    setLogs(prev => [
      { time: new Date().toLocaleTimeString(), event: `[STK Push Request] Dispatched payload tracking ID: ${trackingId} to ${simPhone} amount KES ${simAmount}`, type: 'request' },
      ...prev
    ]);

    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      }),
      {
        loading: 'Dispatching Daraja M-Pesa STK Push sequence...',
        success: () => {
          setLogs(prev => [
            { time: new Date().toLocaleTimeString(), event: `[Daraja Callback Success] Payment received! MerchantRequestID: ${trackingId}. Status: Completed (ResultCode: 0)`, type: 'callback' },
            ...prev
          ]);
          setIsSimulating(false);
          return 'M-Pesa STK Callback triggered successfully! Transaction settled. 💳';
        },
        error: 'Simulation sequence failed.'
      }
    );
  };

  const handleSaveCreds = () => {
    toast.success('M-Pesa Daraja credentials encrypted and updated.');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white">
      <Toaster position="top-right" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">M-Pesa Daraja API Console</h1>
          <p className="text-xs font-semibold text-light-gray/50 mt-1">Configure Safaricom merchant integration credentials, validate callback hooks, and run local sandbox STK simulations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Hand: Setup credentials fields */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 border border-white/10 bg-white/5 rounded-3xl space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5"><Key className="w-4 h-4 text-accent-purple" /> Daraja Key Credentials</h3>
            
            <div className="space-y-4 pt-2">
              <div className="flex flex-col gap-1.5 text-xs font-bold text-light-gray/60">
                <label>Consumer Key API</label>
                <input 
                  type="text" 
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple text-white/95"
                  value={credentials.consumerKey}
                  onChange={e => setCredentials({ ...credentials, consumerKey: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5 text-xs font-bold text-light-gray/60">
                <label>Consumer Secret Key</label>
                <input 
                  type="password" 
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple text-white/95"
                  value={credentials.consumerSecret}
                  onChange={e => setCredentials({ ...credentials, consumerSecret: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5 text-xs font-bold text-light-gray/60">
                <label>Callback Endpoint URL</label>
                <input 
                  type="text" 
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple text-white/95"
                  value={callbackUrl}
                  onChange={e => setCallbackUrl(e.target.value)}
                />
              </div>

              <Button onClick={handleSaveCreds} className="w-full bg-accent-purple border-none rounded-xl text-xs font-bold py-2.5">
                Save & Encrypt Credentials
              </Button>
            </div>
          </Card>

          <Card className="p-5 border border-white/10 bg-white/5 rounded-3xl space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5 text-success">
              <ShieldCheck className="w-4 h-4" /> Gateway Environment Status
            </h4>
            <div className="space-y-2 text-[10px] font-bold text-light-gray/60">
              <div className="flex justify-between"><span>SSL Certification:</span> <span className="text-white">Active (Auto-Renew)</span></div>
              <div className="flex justify-between"><span>API Gateway URL:</span> <span className="text-white font-mono">api.safaricom.co.ke</span></div>
              <div className="flex justify-between"><span>Connection Ping:</span> <span className="text-success">14ms (Optimal)</span></div>
            </div>
          </Card>
        </div>

        {/* Right Side: STK Simulator and Terminal Event Logger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Simulation trigger console */}
            <Card className="p-5 border border-white/10 bg-white/5 rounded-3xl space-y-4">
              <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-accent-purple" /> STK Push Tester Tool</h3>
              
              <form onSubmit={triggerStkSim} className="space-y-4 pt-2">
                <div className="flex flex-col gap-1.5 text-xs font-bold text-light-gray/60">
                  <label>Simulator Mobile Number (254...)</label>
                  <input 
                    type="text" 
                    placeholder="254711002233"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple"
                    value={simPhone}
                    onChange={e => setSimPhone(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-bold text-light-gray/60">
                  <label>Test Transaction Amount (KES)</label>
                  <input 
                    type="text" 
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple"
                    value={simAmount}
                    onChange={e => setSimAmount(e.target.value)}
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isSimulating}
                  className="w-full bg-success hover:bg-success/90 border-none rounded-xl text-xs font-bold py-2.5 flex items-center justify-center gap-2"
                >
                  <Send size={14} /> {isSimulating ? 'Simulating Push...' : 'Simulate STK push'}
                </Button>
              </form>
            </Card>

            {/* Terminal Live logs output */}
            <Card className="p-5 border border-white/10 bg-black/40 rounded-3xl flex flex-col justify-between min-h-[280px]">
              <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                <h4 className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5 text-accent-purple"><Terminal className="w-4 h-4" /> Live Webhook Log Feed</h4>
                <button onClick={() => setLogs([])} className="text-[10px] font-bold text-light-gray/40 hover:text-white transition-colors">Clear</button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 font-mono text-[9px] text-light-gray pr-1 max-h-[220px]">
                {logs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-light-gray/30">Terminal listening for callback notifications...</div>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className="flex gap-2 items-start leading-relaxed border-l-2 pl-2 border-white/10">
                      <span className="text-light-gray/40 shrink-0">{log.time}</span>
                      <span className={
                        log.type === 'callback' ? 'text-success font-bold' : 
                        log.type === 'request' ? 'text-accent-purple' : 
                        log.type === 'auth' ? 'text-orange-400' : 'text-light-gray/60'
                      }>{log.event}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}
