import React, { useState } from 'react';
import { 
  Briefcase, ShieldCheck, Users, TrendingUp, Search, 
  Award, FileText, CheckCircle, Clock, Truck, ArrowRight 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ClientProcurementEcosystemPage() {
  const [rfqs, setRfqs] = useState([
    { id: 'RFQ-8821', title: 'Fiber Splicing Nairobi East', budget: 'KES 250,000', bidsCount: 3, status: 'Bidding Active' },
    { id: 'RFQ-7640', title: 'Pipeline Substation Concrete Auditing', budget: 'KES 180,000', bidsCount: 2, status: 'Awaiting Award' }
  ]);

  const [vendors, setVendors] = useState([
    { id: 1, name: 'Safaricom Telecomm Logistics', score: '98%', bids: 'KES 245,000', delivery: '5 Days', compliance: 'Verified KRA' },
    { id: 2, name: 'East Africa Infrastructure Ltd', score: '94%', bids: 'KES 260,000', delivery: '4 Days', compliance: 'Verified KRA' },
    { id: 3, name: 'Apex Surveyor Systems', score: '88%', bids: 'KES 230,000', delivery: '8 Days', compliance: 'Pending Audit' }
  ]);

  const [selectedRfq, setSelectedRfq] = useState('RFQ-8821');

  const handleAward = (vendorName, bidAmount) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1800)),
      {
        loading: `Awarding contract and generating purchase order for ${vendorName}...`,
        success: () => {
          setRfqs(prev => prev.map(r => r.id === selectedRfq ? { ...r, status: 'Awarded' } : r));
          return `Contract awarded successfully! Purchase order dispatched to ${vendorName}. 📜`;
        },
        error: 'Contract award sequence failed.'
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans text-white bg-zinc-950/20 rounded-3xl animate-in fade-in duration-500">
      <Toaster position="top-right" />

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Procurement & Vendor Command</h1>
          <p className="text-xs font-semibold text-light-gray/50 mt-1">Audit active requests for quotes (RFQs), analyze multi-vendor compliance matrices, and authorize purchase orders.</p>
        </div>

        <Button onClick={() => toast.success('New RFQ template generated.')} className="bg-success border-none rounded-xl text-xs font-bold py-2.5 flex items-center gap-1.5 shadow-lg shadow-[#14a800]/20">
          Create New RFQ
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: RFQs Listing */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 border border-white/10 bg-white/5 rounded-3xl space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-success" /> Active RFQ Postings</h3>
            
            <div className="space-y-3">
              {rfqs.map(rfq => (
                <div 
                  key={rfq.id}
                  onClick={() => setSelectedRfq(rfq.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedRfq === rfq.id 
                      ? 'border-success bg-success/10' 
                      : 'border-white/5 bg-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-success">{rfq.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      rfq.status === 'Awarded' ? 'bg-success/20 text-success' : 'bg-orange-400/20 text-orange-400'
                    }`}>{rfq.status}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-2">{rfq.title}</h4>
                  <div className="flex justify-between mt-4 text-[9px] font-bold text-light-gray/50 border-t border-white/5 pt-2">
                    <span>Target Budget: {rfq.budget}</span>
                    <span>{rfq.bidsCount} Bids Received</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side: Multi-Vendor Bidding & Comparison */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-white/10 bg-white/5 p-6 rounded-3xl">
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-success" /> Vendor Proposal Bid Matrix ({selectedRfq})</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead>
                  <tr className="border-b border-white/5 text-light-gray/40 text-[10px] uppercase tracking-wider font-black">
                    <th className="pb-3">Bidder Identity</th>
                    <th className="pb-3">KRA Compliance</th>
                    <th className="pb-3">Delivery Estimate</th>
                    <th className="pb-3">Quality Score</th>
                    <th className="pb-3">Financial Quote</th>
                    <th className="pb-3 text-right">Award Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {vendors.map(v => (
                    <tr key={v.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center font-bold text-xs"><Truck size={14} /></div>
                        <span>{v.name}</span>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                          v.compliance === 'Verified KRA' ? 'bg-success/20 text-success' : 'bg-orange-400/20 text-orange-400'
                        }`}>{v.compliance}</span>
                      </td>
                      <td className="py-4 font-mono text-light-gray">{v.delivery}</td>
                      <td className="py-4 font-bold text-success">{v.score}</td>
                      <td className="py-4 font-black text-white">{v.bids}</td>
                      <td className="py-4 text-right">
                        <Button 
                          onClick={() => handleAward(v.name, v.bids)}
                          className="bg-success hover:bg-success/90 border-none font-bold text-[9px] py-1.5 px-3 rounded-lg"
                        >
                          Award & Escrow
                        </Button>
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
