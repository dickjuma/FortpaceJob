import React, { useState } from 'react';
import { 
  Code, Key, Plus, RefreshCw, Eye, EyeOff, X, Globe, CheckCircle2, Trash2, ShieldCheck, PlayCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function ApiIntegrationsPage() {
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Live Production Key', key: 'fs_live_51Ny89H2kUvW9Z1y8x7w6v5u4t3s2r1q', revealed: false, date: 'Created 2 months ago' },
    { id: 2, name: 'Staging Sandbox Key', key: 'fs_test_90Jp12KlPo89Ii67Uu54Yy32Tt10Rr', revealed: false, date: 'Created 1 week ago' }
  ]);

  const [webhooks, setWebhooks] = useState([
    { id: 1, url: 'https://api.acme.io/webhooks/forte', events: ['contract.funded', 'contract.completed'], active: true }
  ]);

  const [activeModal, setActiveModal] = useState(null); // 'webhook'
  const [revealStates, setRevealStates] = useState({});
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvent, setWebhookEvent] = useState('contract.funded');

  const toggleReveal = (id) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, revealed: !k.revealed } : k));
  };

  const regenerateKey = (id, name) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: `Regenerating ${name}...`,
        success: `${name} has been refreshed! Please update your environment variables. 🔑`,
        error: 'Failed to refresh key.'
      }
    );
    setApiKeys(apiKeys.map(k => {
      if (k.id === id) {
        const type = k.key.startsWith('fs_live') ? 'fs_live_' : 'fs_test_';
        const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return { ...k, key: `${type}${randomString}`, revealed: false, date: 'Regenerated just now' };
      }
      return k;
    }));
  };

  const handleCreateWebhook = (e) => {
    e.preventDefault();
    if (!webhookUrl.trim()) return;

    const newWebhook = {
      id: Date.now(),
      url: webhookUrl.trim(),
      events: [webhookEvent],
      active: true
    };

    setWebhooks([...webhooks, newWebhook]);
    setWebhookUrl('');
    setActiveModal(null);
    toast.success('Webhook endpoint successfully configured!');
  };

  const deleteWebhook = (id, url) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
    toast.success(`Removed webhook: ${url}`);
  };

  const triggerTestPing = (url) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: `Sending mock test payload to ${url}...`,
        success: `Payload delivered successfully (HTTP 200 OK)! ⚡`,
        error: 'Failed to deliver payload.'
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Code className="w-8 h-8 text-success" />
            Developer Integrations
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Generate programmatic workspace API keys and configure HTTP webhooks for event-driven systems integration.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* API keys section */}
        <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="text-base font-black text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
            <Key className="w-5 h-5 text-success" />
            Programmatic API Keys
          </h3>

          <div className="space-y-6">
            {apiKeys.map(key => (
              <div key={key.id} className="p-4 border border-border/80 rounded-2xl bg-light-gray/25 hover:bg-white hover:shadow-sm transition-all space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-text-primary">{key.name}</h4>
                    <p className="text-[10px] text-text-secondary font-black uppercase tracking-wider">{key.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleReveal(key.id)} className="p-2 text-text-secondary hover:text-success hover:bg-light-gray rounded-xl transition-all">
                      {key.revealed ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button onClick={() => regenerateKey(key.id, key.name)} className="p-2 text-text-secondary hover:text-success hover:bg-light-gray rounded-xl transition-all" title="Regenerate credentials"><RefreshCw size={16} /></button>
                  </div>
                </div>

                <div className="bg-[#222222] rounded-xl p-3.5 border border-white/10 font-mono text-xs text-white/90 overflow-x-auto select-all flex items-center justify-between">
                  <span>{key.revealed ? key.key : `${key.key.substring(0, 12)}••••••••••••••••••••••••••••`}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Webhooks Section */}
        <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
            <h3 className="text-base font-black text-text-primary flex items-center gap-2">
              <Globe className="w-5 h-5 text-success animate-pulse" />
              Webhook Endpoints
            </h3>
            <Button 
              variant="outline" 
              icon={<Plus size={16} />}
              onClick={() => setActiveModal('webhook')}
            >
              Add Endpoint
            </Button>
          </div>

          <div className="space-y-4">
            {webhooks.map(wh => (
              <div key={wh.id} className="p-4 border border-border/80 rounded-2xl bg-light-gray/25 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-text-primary select-all">{wh.url}</h4>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {wh.events.map(ev => (
                      <span key={ev} className="text-[10px] px-2 py-0.5 rounded bg-success/10 border border-success/20 text-success font-black">{ev}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button onClick={() => triggerTestPing(wh.url)} className="px-3 py-1.5 bg-success/10 hover:bg-success text-success hover:text-white rounded-lg text-xs font-black transition-all flex items-center gap-1">
                    <PlayCircle size={14} /> Send Ping
                  </button>
                  <button onClick={() => deleteWebhook(wh.id, wh.url)} className="p-2 text-text-secondary hover:text-[#e63946] hover:bg-light-gray rounded-xl transition-all" title="Remove Webhook"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}

            {webhooks.length === 0 && (
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-text-secondary mx-auto mb-2" />
                <p className="text-xs text-text-secondary">No webhooks cataloged. Configure an endpoint URL to receive programmatic notifications.</p>
              </div>
            )}
          </div>
        </Card>

      </div>

      {/* --- ADD WEBHOOK MODAL --- */}
      {activeModal === 'webhook' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-md shadow-2xl relative bg-white border border-border p-6 rounded-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
              <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                <Plus className="w-5 h-5 text-success" />
                Configure Webhook
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-light-gray rounded-md transition-colors text-text-secondary"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleCreateWebhook} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Payload Destination URL</label>
                <input 
                  type="url" 
                  value={webhookUrl} 
                  onChange={(e) => setWebhookUrl(e.target.value)} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
                  placeholder="https://api.domain.io/webhooks"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Subscribed Event</label>
                <select
                  value={webhookEvent}
                  onChange={(e) => setWebhookEvent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary appearance-none"
                >
                  <option value="contract.funded">contract.funded (Escrow funded)</option>
                  <option value="contract.completed">contract.completed (Contract resolved)</option>
                  <option value="message.received">message.received (Offline chat received)</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="primary">Add Webhook</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
