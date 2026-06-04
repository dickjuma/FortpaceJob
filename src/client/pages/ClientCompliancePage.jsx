import React, { useState } from 'react';
import { 
  FileText, ShieldCheck, AlertTriangle, Download, 
  Plus, CheckCircle, Clock, Search, ChevronRight 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ClientCompliancePage() {
  const [documents, setDocuments] = useState([
    { id: 'DOC-001', name: 'Master Services Agreement (MSA)', type: 'Legal', status: 'Signed & Active', date: '2026-01-15' },
    { id: 'DOC-002', name: 'Standard Non-Disclosure Agreement (NDA)', type: 'Compliance', status: 'Signed & Active', date: '2026-02-10' },
    { id: 'DOC-003', name: 'KRA Tax pin certification (Acme Solutions)', type: 'Taxation', status: 'Pending Verification', date: '2026-05-20' },
    { id: 'DOC-004', name: 'Director ID verification payload', type: 'Verification', status: 'Signed & Active', date: '2026-03-01' }
  ]);

  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyKra = (docId) => {
    setIsVerifying(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1800)),
      {
        loading: 'Interrogating KRA iTax APIs and validating certificate signature...',
        success: () => {
          setDocuments(prev => prev.map(doc => doc.id === docId ? { ...doc, status: 'Signed & Active' } : doc));
          setIsVerifying(false);
          return 'KRA Tax Certificate successfully validated! Compliance status: GREEN. 🏢';
        },
        error: 'Verification failed.'
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Compliance & Legal Center</h1>
          <p className="text-xs font-semibold text-light-gray/50 mt-1">Audit company registrations, manage automated NDA contracts, and inspect KRA tax clearance certificates.</p>
        </div>

        <Button onClick={() => toast.success('New compliance template initialized.')} className="bg-success border-none rounded-xl text-xs font-bold py-2.5 flex items-center gap-1.5 shadow-lg shadow-[#2bb75c]/20">
          <Plus className="w-4 h-4" /> Add Compliance Doc
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Compliance Score Metrics */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 border border-white/10 bg-white/5 rounded-3xl space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-success" /> Audit Checklist</h3>
            
            <div className="space-y-4 text-xs font-bold text-light-gray/60">
              <div className="flex justify-between items-center">
                <span>MSA Signed:</span>
                <span className="text-success font-black">COMPLETED</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Director KYC:</span>
                <span className="text-success font-black">COMPLETED</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tax Clearance PIN:</span>
                <span className="text-orange-400 font-black animate-pulse">PENDING AUDIT</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-[#222222] to-zinc-900 border border-white/10 text-white rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/20 blur-[50px] rounded-full"></div>
            <h4 className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5 mb-3 text-orange-400">
              <AlertTriangle className="w-4 h-4" /> Tax Verification Warning
            </h4>
            <p className="text-[10px] font-semibold text-white/70 leading-relaxed">
              Your corporate wallet releases are currently locked to a KES 150,000 threshold limit until KRA tax PIN verification is verified.
            </p>
          </Card>
        </div>

        {/* Right Side: Active Document Manager Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-white/10 bg-white/5 p-6 rounded-3xl">
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-success" /> Legal Compliance Documents ({documents.length})</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead>
                  <tr className="border-b border-white/5 text-light-gray/40 text-[10px] uppercase tracking-wider font-black">
                    <th className="pb-3">Document Info</th>
                    <th className="pb-3">Classification</th>
                    <th className="pb-3">Last Modified</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {documents.map(doc => (
                    <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4">
                        <div className="font-bold text-white">{doc.name}</div>
                        <span className="text-[9px] font-mono text-light-gray/40 uppercase font-black">{doc.id}</span>
                      </td>
                      <td className="py-4 text-light-gray font-bold text-[10px]">{doc.type}</td>
                      <td className="py-4 text-light-gray font-mono">{doc.date}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          doc.status === 'Signed & Active' 
                            ? 'bg-success/20 text-success' 
                            : 'bg-orange-400/20 text-orange-400 animate-pulse'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {doc.status === 'Pending Verification' ? (
                          <Button 
                            disabled={isVerifying}
                            onClick={() => handleVerifyKra(doc.id)}
                            className="bg-success hover:bg-success/90 border-none font-bold text-[9px] py-1.5 px-3 rounded-lg"
                          >
                            Verify iTax Clearance
                          </Button>
                        ) : (
                          <button 
                            onClick={() => toast.success('Dispatching PDF template download...')}
                            className="text-light-gray/40 hover:text-white transition-colors flex items-center gap-1 font-bold text-[10px] justify-end ml-auto"
                          >
                            <Download size={12} /> Download PDF
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}

