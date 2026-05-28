import React, { useState } from 'react';
import { 
  AlertOctagon, CheckCircle2, Clock, UploadCloud, MessageSquare, 
  Send, User, ShieldCheck, HelpCircle, FileText, ArrowRight, ShieldAlert, Sparkles
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';

export default function DisputesPage() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [disputes, setDisputes] = useState([
    { 
      id: 'DISP-492', 
      contractId: 'CON-8834', 
      type: 'Milestone Dispute', 
      reason: 'Late Delivery & Quality Complaint', 
      description: 'The React application features numerous frontend lint errors and the responsive CSS grids overlap on tablet devices.', 
      status: 'UNDER_REVIEW', 
      date: 'May 20, 2026', 
      escalationLevel: 'Level 2 Mediation',
      chatHistory: [
        { sender: 'Client', text: 'The navbar overlaps the main banner on iPad Pro viewport sizes.', time: '10:15 AM' },
        { sender: 'You', text: 'I am running local hotfixes to secure relative layout viewport units.', time: '10:30 AM' }
      ]
    },
    { 
      id: 'DISP-381', 
      contractId: 'CON-9923', 
      type: 'Offline Service Dispute', 
      reason: 'Travel Time Miscalculation', 
      description: 'Physical server installation delayed due to local transit delays, client requesting travel cost deduct.', 
      status: 'RESOLVED', 
      date: 'May 10, 2026', 
      escalationLevel: 'Auto Resolved',
      chatHistory: []
    }
  ]);

  const handleOpenDispute = () => {
    toast.loading('Initiating secure mediation file...', { id: 'disp' });
    setTimeout(() => {
      toast.success('Dispute ticket generated on decentralised escrow ledger!', { id: 'disp' });
    }, 1200);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const updatedCase = { ...selectedCase };
    updatedCase.chatHistory.push({
      sender: 'You',
      text: chatMessage,
      time: 'Just now'
    });

    setDisputes(prev => prev.map(d => d.id === selectedCase.id ? updatedCase : d));
    setSelectedCase(updatedCase);
    setChatMessage('');
    toast.success('Evidence response broadcasted.');
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setEvidenceFiles([...evidenceFiles, f]);
      toast.success(`Evidence document "${f.name}" uploaded successfully! 📁`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent-red/15 text-accent-red rounded-xl border border-accent-red/20 shadow-sm animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Mediation & Dispute Hub</h1>
          </div>
          <p className="text-sm text-text-secondary mt-1 font-semibold">
            Resolve milestone conflicts, escalate offline service issues, and request partial escrow releases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleOpenDispute}
            variant="primary" 
            className="bg-accent-red hover:bg-accent-red/95 font-bold text-xs rounded-xl border-none shadow-lg shadow-accent-red/10"
            icon={<AlertOctagon size={16} />}
          >
            Initiate Dispute Escalation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Cases List */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border border-border bg-white shadow-sm">
            <h3 className="font-black text-text-primary text-sm uppercase tracking-wider border-b border-border pb-3 mb-4">
              Mediation Ledgers
            </h3>
            
            <div className="space-y-3">
              {disputes.map(disp => (
                <button
                  key={disp.id}
                  onClick={() => setSelectedCase(disp)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all flex flex-col justify-between gap-2.5",
                    selectedCase?.id === disp.id 
                      ? "border-accent-red bg-accent-red/5 scale-[0.99] shadow-inner" 
                      : "border-border hover:bg-light-gray/60"
                  )}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] font-black uppercase text-accent-purple tracking-wider">
                      {disp.type}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                      disp.status === 'RESOLVED' ? "bg-success/15 text-success" : "bg-warning/15 text-warning animate-pulse"
                    )}>
                      {disp.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-text-primary text-xs">{disp.reason}</h4>
                    <p className="text-[9px] text-text-secondary font-black mt-1 uppercase">Case ID: {disp.id} • {disp.date}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side: Selected Case Details, Timeline & Chat */}
        <div className="lg:col-span-2">
          {selectedCase ? (
            <Card className="p-6 border border-border bg-white shadow-sm space-y-6 animate-in slide-in-from-right-4 duration-200">
              
              {/* Header stats */}
              <div className="flex justify-between items-start border-b border-border pb-4">
                <div>
                  <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest bg-light-gray px-2 py-1 rounded-md">
                    Mediation tier: {selectedCase.escalationLevel}
                  </span>
                  <h3 className="font-black text-lg text-text-primary mt-2">{selectedCase.reason}</h3>
                  <p className="text-xs text-text-secondary font-semibold">Associated Contract: {selectedCase.contractId}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.success('Escrow balance locked on ledger.')} className="text-accent-red hover:bg-accent-red/5">
                  Freeze Escrow
                </Button>
              </div>

              {/* Description */}
              <div className="text-xs font-semibold text-text-secondary leading-relaxed bg-light-gray/40 p-4 rounded-2xl border border-border">
                <p className="font-black uppercase tracking-wider text-[9px] text-text-primary mb-1">Dispute Statement</p>
                "{selectedCase.description}"
              </div>

              {/* AI Auto-Mediation Suggestion */}
              <Card className="p-4 bg-accent-purple/5 border border-accent-purple/20 rounded-2xl space-y-2">
                <h4 className="font-black text-xs text-accent-purple flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> AI Auto-Mediation Proposal
                </h4>
                <p className="text-[10px] font-semibold text-text-secondary leading-relaxed">
                  Based on repo commit intervals, standard resolution suggests releasing <strong className="text-text-primary">85% milestone value</strong> to Freelancer and issuing <strong className="text-text-primary">15% partial refund</strong> to Client for layout defects.
                </p>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" onClick={() => toast.success('AI compromise proposal accepted.')} className="text-xs py-1.5 px-3">Accept Proposal</Button>
                </div>
              </Card>

              {/* Evidence Upload */}
              <div className="space-y-3">
                <h4 className="font-black text-text-primary text-xs uppercase tracking-wider">Submit Evidence Log</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="border border-dashed border-border rounded-xl p-4 text-center hover:bg-light-gray hover:border-accent-purple cursor-pointer transition-all flex flex-col items-center justify-center min-h-[100px]">
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                    <UploadCloud className="w-6 h-6 text-accent-purple mb-1.5" />
                    <span className="text-[10px] font-bold text-text-primary">Upload supporting files</span>
                  </label>
                  
                  <div className="border border-border bg-light-gray/20 rounded-xl p-3.5 space-y-1.5 text-[10px] font-bold text-text-secondary overflow-y-auto max-h-[100px]">
                    <span className="uppercase text-[8px] tracking-wider text-text-primary block border-b border-border pb-1 mb-1">Uploaded Evidence</span>
                    {evidenceFiles.length === 0 ? (
                      <span className="italic font-normal">No logs uploaded yet.</span>
                    ) : (
                      evidenceFiles.map((f, i) => (
                        <div key={i} className="flex justify-between text-text-primary">
                          <span className="truncate max-w-[120px]">{f.name}</span>
                          <span className="text-success uppercase text-[8px]">Ready</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Chat Mediation Timeline */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="font-black text-text-primary text-xs uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-accent-purple" /> Live Mediation Stream
                </h4>
                
                <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                  {selectedCase.chatHistory.map((ch, idx) => (
                    <div key={idx} className={cn(
                      "p-3 rounded-2xl max-w-[80%] text-xs font-semibold leading-relaxed",
                      ch.sender === 'You' ? "bg-accent-purple/10 text-accent-purple ml-auto" : "bg-light-gray text-text-primary"
                    )}>
                      <span className="block text-[8px] uppercase tracking-wider font-black mb-1">{ch.sender} • {ch.time}</span>
                      {ch.text}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Broadcast evidence reply to mediator..." 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 rounded-xl border border-border bg-light-gray px-3.5 py-2.5 text-xs font-bold text-text-primary focus:bg-white focus:border-accent-purple outline-none"
                  />
                  <button type="submit" className="p-2.5 bg-accent-purple hover:bg-accent-purple/95 text-white rounded-xl shadow transition-all">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </Card>
          ) : (
            <Card className="p-8 border border-border bg-white shadow-md h-full flex flex-col items-center justify-center text-center min-h-[350px]">
              <ShieldAlert className="w-12 h-12 text-text-secondary mb-3 animate-pulse" />
              <h4 className="font-black text-text-primary text-base">Review Conflict Files</h4>
              <p className="text-xs text-text-secondary mt-1 max-w-[240px] leading-relaxed font-semibold">
                Select any ongoing dispute ticket from the mediation sidebar ledger to upload files, chat with resolvers, and approve compromise refunds.
              </p>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
