import React, { useState } from 'react';
import { 
  Terminal, ShieldCheck, Key, RefreshCw, Send, 
  Globe, DollarSign, Database, AlertCircle, Copy 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ClientDeveloperPage() {
  const [credentials, setCredentials] = useState({ clientKey: 'oauth_client_prod_442c', clientSecret: '••••••••••••••••••••••••••••••••' });
  const [webhookUrl, setWebhookUrl] = useState('https://api.acme.com/v1/workforce-callbacks');
  const [sandboxActive, setSandboxActive] = useState(true);

  const copyCred = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Credential token copied to clipboard.');
  };

  const handleSave = () => {
    toast.success('Developer API endpoint configurations saved.');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white bg-zinc-950/20 rounded-3xl animate-in fade-in duration-500">
      <Toaster position="top-right" />

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Developer API Credentials</h1>
          <p className="text-xs font-semibold text-light-gray/50 mt-1">Configure OAuth applications, define live webhook endpoint parameters, and retrieve platform secrets.</p>
        </div>

        <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-xl text-xs font-bold items-center gap-2">
          <span className="text-[10px] uppercase text-light-gray/50 font-black">Sandbox Mode:</span>
          <button 
            onClick={() => {
              setSandboxActive(!sandboxActive);
              toast.success(`Environment toggled to ${!sandboxActive ? 'Sandbox' : 'Production'}.`);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              sandboxActive ? 'bg-success text-zinc-950 font-black' : 'bg-white/10 text-light-gray/60'
            }`}
          >
            {sandboxActive ? 'Sandbox ACTIVE' : 'Production Mode'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: API secrets */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 border border-white/10 bg-white/5 rounded-3xl space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5"><Key className="w-4 h-4 text-success" /> OAuth Credentials</h3>
            
            <div className="space-y-4 pt-2">
              <div className="flex flex-col gap-1.5 text-xs font-bold text-light-gray/60">
                <label className="flex justify-between"><span>Client Application ID</span> <button onClick={() => copyCred(credentials.clientKey)} className="text-success font-bold">Copy</button></label>
                <input 
                  type="text" 
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 outline-none text-white/95 font-mono text-xs"
                  value={credentials.clientKey}
                  readOnly
                />
              </div>

              <div className="flex flex-col gap-1.5 text-xs font-bold text-light-gray/60">
                <label className="flex justify-between"><span>Client Secret Token</span> <button onClick={() => copyCred('oauth_client_prod_secret_token_key_xyz')} className="text-success font-bold">Copy</button></label>
                <input 
                  type="password" 
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 outline-none text-white/95 font-mono text-xs"
                  value={credentials.clientSecret}
                  readOnly
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Webhook URL config */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 border border-white/10 bg-white/5 rounded-3xl space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5"><Globe className="w-4 h-4 text-success" /> Webhook Integrations</h3>
            
            <div className="space-y-4 pt-2">
              <div className="flex flex-col gap-1.5 text-xs font-bold text-light-gray/60">
                <label>Callback Event URL</label>
                <input 
                  type="text" 
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-success text-white/95"
                  value={webhookUrl}
                  onChange={e => setWebhookUrl(e.target.value)}
                />
              </div>

              <Button onClick={handleSave} className="w-full bg-success border-none rounded-xl text-xs font-bold py-2.5">
                Save & Encrypt Developer Config
              </Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
