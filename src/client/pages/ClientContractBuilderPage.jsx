import React, { useState } from 'react';
import { 
  FileText, ShieldCheck, Download, Plus, 
  CheckCircle, Clock, Search, ChevronRight, Edit2 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ClientContractBuilderPage() {
  const [template, setTemplate] = useState('Standard NDA');
  const [vendorName, setVendorName] = useState('Sarah Jenkins');
  const [scopeOfWork, setScopeOfWork] = useState('Create premium interactive CSS animations and geofenced telemetry panels.');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!vendorName.trim() || !scopeOfWork.trim()) {
      toast.error('Please complete all credential fields.');
      return;
    }

    setIsGenerating(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Drafting digital contract with automated compliance protections...',
        success: () => {
          setIsGenerating(false);
          return 'Contract drafted successfully! Dispatched for signature center approval. ✍️';
        },
        error: 'Drafting sequence failed.'
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white bg-zinc-950/20 rounded-3xl animate-in fade-in duration-500">
      <Toaster position="top-right" />

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Contract Builder & NDA Generator</h1>
          <p className="text-xs font-semibold text-light-gray/50 mt-1">Draft legally compliant agreements, automatically append Standard NDA clauses, and dispatch documents for e-signatures.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Setup fields */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border border-white/10 bg-white/5 rounded-3xl space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5"><Edit2 className="w-4 h-4 text-accent-purple" /> Agreement Drafting Desk</h3>
            
            <form onSubmit={handleGenerate} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 text-xs font-bold text-light-gray/60">
                  <label>Document Agreement Template</label>
                  <select 
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple text-white/95"
                    value={template}
                    onChange={e => setTemplate(e.target.value)}
                  >
                    <option value="Standard NDA">Standard Non-Disclosure Agreement (NDA)</option>
                    <option value="MSA Contract">Master Services Agreement (MSA)</option>
                    <option value="Milestone Escrow">Milestone-Based Escrow Agreement</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-bold text-light-gray/60">
                  <label>Vendor Legal Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple text-white/95"
                    value={vendorName}
                    onChange={e => setVendorName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-xs font-bold text-light-gray/60">
                <label>Scope of Work (SOW) & Deliverables Details</label>
                <textarea 
                  rows="4"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple text-white/95 placeholder-light-gray/40 resize-none text-xs"
                  value={scopeOfWork}
                  onChange={e => setScopeOfWork(e.target.value)}
                />
              </div>

              <Button 
                type="submit"
                disabled={isGenerating}
                className="w-full bg-accent-purple border-none rounded-xl text-xs font-bold py-2.5 flex items-center justify-center gap-2"
              >
                {isGenerating ? 'Drafting Agreement...' : 'Generate Legal Agreement'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Side: Compliance Checklist */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 border border-white/10 bg-white/5 rounded-3xl space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5 text-success"><ShieldCheck className="w-4 h-4" /> Legal Clearance Checklist</h3>
            
            <div className="space-y-4 text-xs font-bold text-light-gray/60">
              <div className="flex justify-between items-center">
                <span>Standard NDA Annex:</span>
                <span className="text-success font-black">APPENDED</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Withholding tax VAT rules:</span>
                <span className="text-success font-black">RESOLVED</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Disputes arbitration state:</span>
                <span className="text-white font-mono">Nairobi / HSL-Secure</span>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
