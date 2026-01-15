// src/components/findWork/Gigs/CreateGig.jsx
import React, { useState } from "react";
import { 
  Check, ChevronRight, DollarSign, Clock, 
  Plus, X, Image as ImageIcon, MessageSquare, Rocket 
} from "lucide-react";

export default function CreateGig() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "Programming & Tech",
    tags: ["React", "SaaS"],
    packages: {
      basic: { desc: "", delivery: "3", price: "" },
      standard: { desc: "", delivery: "5", price: "" },
      premium: { desc: "", delivery: "7", price: "" },
    },
    requirements: [{ id: 1, question: "" }],
    images: []
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const steps = ["Overview", "Pricing", "Requirements", "Gallery"];

  return (
    <div className="w-full h-screen overflow-hidden bg-white text-[#4A312F] flex flex-col font-sans">
      
      {/* 1. Slim Progress Rail (Zero Scroll) */}
      <header className="h-20 border-b border-gray-100 px-8 flex items-center justify-between shrink-0 bg-white z-20">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#D34079] rounded-full" />
            <h1 className="text-[10px] font-black uppercase tracking-[0.2em]">New Gig</h1>
          </div>
          <nav className="flex items-center gap-8">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-black transition-all ${
                  currentStep >= idx + 1 ? "bg-[#4A312F] text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {currentStep > idx + 1 ? <Check size={10} strokeWidth={4} /> : idx + 1}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${currentStep >= idx + 1 ? "text-black" : "text-gray-300"}`}>
                  {step}
                </span>
              </div>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-[#B7E2BF]">
          <span className="w-2 h-2 rounded-full bg-[#B7E2BF] animate-pulse" /> System Sync Active
        </div>
      </header>

      {/* 2. Main Workspace (Flexible Layout) */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden">
        
        {/* Editor Area */}
        <div className="col-span-12 lg:col-span-8 p-12 flex flex-col justify-center overflow-hidden">
          <div className="max-w-3xl w-full mx-auto space-y-10">
            
            {/* STEP 1: OVERVIEW */}
            {currentStep === 1 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D34079]">The Headline</label>
                  <div className="relative border-b border-gray-100 focus-within:border-[#4A312F] transition-all pb-2">
                    <span className="absolute left-0 top-0 text-3xl font-black text-gray-200">I will</span>
                    <textarea 
                      className="w-full pl-24 py-0 bg-transparent text-3xl font-black text-[#4A312F] placeholder:text-gray-100 outline-none resize-none h-24"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="design your brand strategy..."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-12">
                  <FieldWrapper label="Category">
                    <select 
                      className="w-full py-2 bg-transparent border-b border-gray-100 font-bold text-xs text-[#4A312F] outline-none focus:border-[#B7E2BF]"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option>Programming & Tech</option>
                      <option>Graphics & Design</option>
                    </select>
                  </FieldWrapper>
                  <FieldWrapper label="Search Tags">
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.tags.map(tag => (
                        <span key={tag} className="bg-[#B7E2BF]/10 text-[#4A312F] border border-[#B7E2BF]/30 px-3 py-1 rounded text-[8px] font-black flex items-center gap-2">
                          {tag} <X size={10} className="cursor-pointer hover:text-[#D34079]" onClick={() => setFormData({...formData, tags: formData.tags.filter(t => t !== tag)})}/>
                        </span>
                      ))}
                      <input 
                        onKeyDown={(e) => {
                          if(e.key === 'Enter') {
                            setFormData({...formData, tags: [...formData.tags, e.target.value]});
                            e.target.value = '';
                          }
                        }}
                        className="bg-transparent border-none outline-none text-[10px] font-bold p-1 w-24" 
                        placeholder="+ New tag" 
                      />
                    </div>
                  </FieldWrapper>
                </div>
              </div>
            )}

            {/* STEP 2: PRICING (Rhyming Rows) */}
            {currentStep === 2 && (
              <div className="space-y-2 animate-in fade-in duration-300">
                {['basic', 'standard', 'premium'].map((tier) => (
                  <div key={tier} className="flex items-center gap-8 py-6 border-b border-gray-50 hover:bg-gray-50/50 transition-all px-4 rounded-xl group">
                    <span className="w-20 text-[9px] font-black uppercase tracking-[0.3em] text-[#D34079]">{tier}</span>
                    <input 
                      className="flex-1 bg-transparent text-xs font-bold text-[#4A312F] outline-none"
                      placeholder="What is included?"
                      value={formData.packages[tier].desc}
                      onChange={(e) => {
                        const p = {...formData.packages}; p[tier].desc = e.target.value; setFormData({...formData, packages: p});
                      }}
                    />
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#B7E2BF]" />
                        <input className="w-10 bg-transparent text-[10px] font-black text-[#4A312F] outline-none" placeholder="3d" />
                      </div>
                      <div className="flex items-center gap-1 border-l border-gray-100 pl-6">
                        <span className="text-[10px] font-black text-gray-300">$</span>
                        <input className="w-10 bg-transparent text-xl font-black text-[#4A312F] outline-none" placeholder="50" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 3 & 4: REQS & GALLERY */}
            {currentStep === 3 && (
               <div className="space-y-6 animate-in fade-in">
                 <div className="flex items-center gap-3 text-[#B7E2BF] mb-4">
                    <MessageSquare size={16} />
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Order Requirements</p>
                 </div>
                 {formData.requirements.map((req, idx) => (
                    <textarea 
                      key={req.id}
                      className="w-full p-6 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-[#4A312F] outline-none focus:border-[#4A312F] transition-all"
                      placeholder={`Question #${idx + 1}`}
                    />
                 ))}
               </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-in zoom-in-95 text-center">
                 <div className="border-2 border-dashed border-[#B7E2BF]/40 rounded-[2.5rem] p-16 bg-gray-50 flex flex-col items-center gap-4 hover:border-[#D34079] cursor-pointer transition-all">
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100"><ImageIcon size={32} className="text-[#4A312F]" /></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4A312F]">Drop Gallery Assets</p>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Dark Context Sidebar (Enterprise Look) */}
        <div className="hidden lg:flex col-span-4 bg-[#4A312F] p-16 flex-col justify-between text-white border-l border-white/5">
           <div className="space-y-12">
              <div className="space-y-2">
                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#B7E2BF]">Enterprise Logic</h4>
                <p className="text-xl font-black italic leading-tight">"Assigned Invoices depend on these parameters."</p>
              </div>
              <div className="p-8 border border-white/10 rounded-3xl bg-white/5">
                 <Rocket className="text-[#D34079] mb-4" size={24} />
                 <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Once published, the system will allow clients to purchase and trigger the automated invoice workflow.</p>
              </div>
           </div>
           <div className="space-y-3">
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-400">
                <span>Optimization</span>
                <span>{currentStep * 25}%</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#D34079] transition-all duration-700" style={{ width: `${currentStep * 25}%` }} />
              </div>
           </div>
        </div>
      </main>

      {/* 4. Footer (Fixed height, Zero Scroll) */}
      <footer className="h-24 border-t border-gray-100 px-8 flex items-center justify-between shrink-0 bg-white">
        <button 
          onClick={prevStep} 
          className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-black'}`}
        >
          &larr; Back
        </button>
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-gray-50 rounded-full text-[9px] font-black uppercase tracking-widest text-[#4A312F] hover:bg-gray-100 transition-all">Save Draft</button>
          <button 
            onClick={nextStep}
            className="bg-[#D34079] text-white px-16 py-3 rounded-full font-black text-[9px] uppercase tracking-[0.3em] shadow-2xl shadow-[#D34079]/20 hover:bg-[#4A312F] hover:scale-105 transition-all flex items-center gap-3"
          >
            {currentStep === 4 ? "Launch Gig" : "Continue"} <ChevronRight size={16} />
          </button>
        </div>
      </footer>
    </div>
  );
}

function FieldWrapper({ label, children }) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</label>
      {children}
    </div>
  );
}