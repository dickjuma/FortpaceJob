import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Users, CreditCard, Sparkles, Check, 
  ChevronRight, ArrowLeft, Upload, Grid, Bot, Plus, Trash 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../platform/components/common/Card';
import Button from '../../platform/components/common/Button';

export default function ClientSetupWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [companyInfo, setCompanyInfo] = useState({ name: '', industry: 'Technology', size: '1-10' });
  const [departments, setDepartments] = useState(['Engineering', 'Product Design', 'Operations']);
  const [newDept, setNewDept] = useState('');
  const [paymentOption, setPaymentOption] = useState('mpesa');

  const stepsList = [
    { num: 1, title: 'Company Details', desc: 'Identify company base', icon: Building2 },
    { num: 2, title: 'Departments', desc: 'Structure departments', icon: Grid },
    { num: 3, title: 'Billing Profile', desc: 'Setup wallet modes', icon: CreditCard },
    { num: 4, title: 'Finalize Workspace', desc: 'AI customization', icon: Sparkles }
  ];

  const setupMutation = useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    },
    onSuccess: () => {
      navigate('/client/dashboard');
    }
  });

  const handleNext = () => {
    if (step === 1 && !companyInfo.name) {
      toast.error('Company Name is required.');
      return;
    }
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      toast.promise(
        setupMutation.mutateAsync(),
        {
          loading: 'Provisioning cloud client workspace resources...',
          success: 'Provisioning completed successfully! ??',
          error: 'Provisioning failed.'
        }
      );
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const addDepartment = () => {
    if (!newDept.trim()) return;
    if (departments.includes(newDept)) {
      toast.error('Department already exists.');
      return;
    }
    setDepartments([...departments, newDept.trim()]);
    setNewDept('');
  };

  const removeDepartment = (dept) => {
    setDepartments(departments.filter(d => d !== dept));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-[#222222] to-zinc-900 font-sans text-white py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Logo and Greeting Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-success flex items-center justify-center font-black text-sm">F</div>
            <span className="text-sm font-bold tracking-tight text-white/90">ForteSpace Operations</span>
          </div>
          <span className="text-xs font-bold text-light-gray/40 uppercase tracking-widest">Enterprise setup</span>
        </div>

        {/* Stepper Progress bar visualizer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stepsList.map(s => {
            const ActiveIcon = s.icon;
            const isCompleted = s.num < step;
            const isActive = s.num === step;
            return (
              <div 
                key={s.num} 
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  isActive 
                    ? 'border-success bg-success/5' 
                    : isCompleted 
                      ? 'border-success/30 bg-success/5' 
                      : 'border-white/5 bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-success text-white shadow-lg shadow-[#4C1D95]/20' 
                      : isCompleted 
                        ? 'bg-success text-white' 
                        : 'bg-white/10 text-light-gray/40'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : <ActiveIcon className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{s.title}</h4>
                    <p className="text-[9px] font-semibold text-light-gray/50">{s.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Card Container wrapper with transition animations */}
        <Card className="p-8 border border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-success/10 blur-[50px] rounded-full"></div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-black">Configure Company Profile</h2>
                    <p className="text-xs font-semibold text-light-gray/50 mt-1">Specify basic industry credentials to unlock tailored AI freelancer matching pipelines.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 flex flex-col items-center justify-center p-6 border border-dashed border-white/15 rounded-2xl bg-white/5 relative group cursor-pointer hover:border-success transition-colors">
                      <Upload className="w-8 h-8 text-light-gray/40 group-hover:text-success transition-colors" />
                      <span className="text-[10px] font-bold text-light-gray/50 mt-2">Upload Brand Logo</span>
                      <span className="text-[8px] text-light-gray/30 mt-1">SVG, PNG up to 2MB</span>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-light-gray uppercase tracking-wider">Company Registered Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Acme Tech Solutions Ltd"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-success outline-none transition-all"
                          value={companyInfo.name}
                          onChange={e => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black text-light-gray uppercase tracking-wider">Industry Sector</label>
                          <select 
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-success outline-none text-white/95"
                            value={companyInfo.industry}
                            onChange={e => setCompanyInfo({ ...companyInfo, industry: e.target.value })}
                          >
                            <option value="Technology">Technology & SaaS</option>
                            <option value="Fintech">Fintech & Payments</option>
                            <option value="Logistics">Logistics & Supply Chain</option>
                            <option value="NGO">Non-Governmental / NGO</option>
                            <option value="OfflineWork">Offline Logistics / Construction</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black text-light-gray uppercase tracking-wider">Company Workforce Size</label>
                          <select 
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-success outline-none text-white/95"
                            value={companyInfo.size}
                            onChange={e => setCompanyInfo({ ...companyInfo, size: e.target.value })}
                          >
                            <option value="1-10">1 - 10 Operators</option>
                            <option value="11-50">11 - 50 Operators</option>
                            <option value="51-200">51 - 200 Operators</option>
                            <option value="201+">201+ Corporate Level</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-black">Define Operations Departments</h2>
                    <p className="text-xs font-semibold text-light-gray/50 mt-1">Departments allow segmenting contracts, shared workspaces, and dedicated budget limits.</p>
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. Quality Assurance / Security"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-success outline-none"
                      value={newDept}
                      onChange={e => setNewDept(e.target.value)}
                    />
                    <Button onClick={addDepartment} className="bg-success border-none rounded-xl text-xs px-4 font-bold flex items-center gap-1.5">
                      <Plus className="w-4 h-4" /> Add Dept
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {departments.map(dept => (
                      <div key={dept} className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-xl">
                        <span className="text-xs font-bold">{dept}</span>
                        <button onClick={() => removeDepartment(dept)} className="text-light-gray/40 hover:text-[#e63946] transition-colors">
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-black">Billing & Payment System Setup</h2>
                    <p className="text-xs font-semibold text-light-gray/50 mt-1">ForteSpace supports instant M-Pesa merchant settlement alongside card services.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setPaymentOption('mpesa')}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        paymentOption === 'mpesa' 
                          ? 'border-success bg-success/5 shadow-lg' 
                          : 'border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-success/20 text-success rounded-xl flex items-center justify-center font-black">M</div>
                        {paymentOption === 'mpesa' && <div className="w-4 h-4 rounded-full bg-success border border-white flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                      </div>
                      <h4 className="text-sm font-black mt-4">M-Pesa STK Daraja Push</h4>
                      <p className="text-[10px] font-semibold text-light-gray/50 mt-1">Direct Safaricom wallet billing, ideal for instant offline payment runs in Africa.</p>
                    </div>

                    <div 
                      onClick={() => setPaymentOption('card')}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        paymentOption === 'card' 
                          ? 'border-success bg-success/5 shadow-lg' 
                          : 'border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-success/20 text-success rounded-xl flex items-center justify-center font-black"><CreditCard className="w-5 h-5" /></div>
                        {paymentOption === 'card' && <div className="w-4 h-4 rounded-full bg-success border border-white flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                      </div>
                      <h4 className="text-sm font-black mt-4">Corporate Debit/Credit Card</h4>
                      <p className="text-[10px] font-semibold text-light-gray/50 mt-1">Secure Stripe authorization for international contractors and milestones protection.</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 text-center py-6">
                  <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-4 border border-success/30 shadow-lg animate-pulse">
                    <Bot className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">Ready to Provision Workspace!</h2>
                    <p className="text-xs font-semibold text-light-gray/50 max-w-md mx-auto mt-2 leading-relaxed">
                      Our custom Forte AI assistant will initialize your dashboards, create communication templates for your <strong className="text-success">{companyInfo.name || 'Enterprise'}</strong> workspace, and set up your billing rails.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-left max-w-md mx-auto space-y-2 text-xs font-bold text-light-gray/60">
                    <div className="flex justify-between"><span>Company:</span> <span className="text-white">{companyInfo.name}</span></div>
                    <div className="flex justify-between"><span>Departments configured:</span> <span className="text-white">{departments.length} Depts</span></div>
                    <div className="flex justify-between"><span>Default billing integration:</span> <span className="text-white uppercase">{paymentOption}</span></div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-8">
            <button 
              onClick={handlePrev}
              disabled={step === 1}
              className="flex items-center gap-1.5 font-bold text-xs text-light-gray/50 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Previous Step
            </button>

            <Button onClick={handleNext} className="bg-success border-none font-bold text-xs py-3 px-6 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-[#4C1D95]/20">
              {step === 4 ? 'Provision Workspace' : 'Continue Step'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}



