import React, { useState } from 'react';
import Card from '../../../platform/components/common/Card';
import Button from '../../../platform/components/common/Button';
import { 
  Download, Clock, CheckCircle2, AlertCircle, FileText, ArrowRight, Trash2, ShieldCheck, RefreshCw
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { cn } from '../../../admin/utils/cn';
import { useAgencyDownloads } from '../services/agencyHooks';

export default function DownloadsPage() {
  const { data: response, isLoading } = useAgencyDownloads();
  const downloadsData = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
  
  const fallbackDownloads = [
    { id: 1, name: 'acme_agency_payout_receipt_q1.pdf', type: 'Receipt', date: 'May 20, 2026', size: '180 KB', status: 'Completed' },
    { id: 2, name: 'figma_mockups_banking_final.zip', type: 'Design Asset', date: 'May 12, 2026', size: '128.4 MB', status: 'Completed' },
    { id: 3, name: 'freelance_collaborator_contract.pdf', type: 'Legal Contract', date: 'Apr 28, 2026', size: '2.4 MB', status: 'Expired' }
  ];

  const initialDownloads = downloadsData.length > 0 ? downloadsData : fallbackDownloads;
  const [downloads, setDownloads] = useState(initialDownloads);

  const handleDownloadSimulate = (name, status) => {
    if (status === 'Expired') {
      toast.error('This download link has expired. Please contact support or request a renewal.');
      return;
    }

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: `Re-downloading deliverable: ${name}...`,
        success: `Asset successfully saved to local directory! 💾`,
        error: 'Download failed.'
      }
    );
  };

  const deleteHistory = (id) => {
    setDownloads(downloads.filter(d => d.id !== id));
    toast.success('Download history entry deleted.');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Download className="w-8 h-8 text-success" />
            Downloads & Receipts
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Access your download history, financial receipts, tax statements, and past client deliverables.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: System Metrics info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-base font-black text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
              <ShieldCheck className="w-5 h-5 text-success" />
              Download Policy
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              Tax receipts and transaction invoices are stored indefinitely. Project zip files and media deliverables remain active for 30 days after milestone completion.
            </p>
            <div className="p-4 bg-light-gray/40 border border-border rounded-xl space-y-2 text-xs font-bold text-text-primary mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Indefinite Financial Ledger</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Secure SSL Connections</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Ledger Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border border-border p-6 rounded-2xl shadow-md overflow-hidden">
            <h3 className="text-base font-black text-text-primary mb-6 border-b border-border pb-3">
              <span>Historical Downloads Ledger</span>
            </h3>

            <div className="space-y-4">
              {downloads.map((item) => (
                <div key={item.id} className="p-4 border border-border rounded-2xl bg-light-gray/25 hover:bg-white hover:shadow-sm transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-success/10 text-success rounded-xl shrink-0">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-text-primary line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-text-secondary font-black uppercase tracking-wider mt-0.5">{item.type} • {item.size}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <span className="text-xs text-text-secondary font-bold flex items-center gap-1"><Clock size={12} /> {item.date}</span>
                    <button 
                      onClick={() => handleDownloadSimulate(item.name, item.status)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1",
                        item.status === 'Expired' 
                          ? 'bg-light-gray border border-border text-text-secondary cursor-not-allowed' 
                          : 'bg-success/15 text-success hover:bg-success hover:text-white'
                      )}
                    >
                      <Download size={14} /> {item.status}
                    </button>
                    <button 
                      onClick={() => deleteHistory(item.id)}
                      className="p-2 text-text-secondary hover:text-[#e63946] hover:bg-light-gray rounded-xl transition-all"
                      title="Clear History Entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
