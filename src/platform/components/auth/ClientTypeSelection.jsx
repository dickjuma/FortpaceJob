import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, Building, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRegistrationStore } from '../../store/authStore';

const CLIENT_TYPES = [
  {
    id: 'individual',
    icon: User,
    title: 'Individual Creator',
    description: 'For personal projects, quick fixes, and one-time hiring needs like logo design or personal websites.',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'sme',
    icon: Users,
    title: 'SME / Growing Business',
    description: 'For startups and agencies. Unlock team collaboration, recurring hiring workflows, and project management tools.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'corporate',
    icon: Building,
    title: 'Corporate Enterprise',
    description: 'For large organizations requiring enterprise-grade workforce management, compliance controls, and procurement workflows.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
  }
];

export default function ClientTypeSelection() {
  const { clientType, setClientType, setStep } = useRegistrationStore();

  const handleNext = () => {
    if (clientType) setStep(3);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-5xl mx-auto"
    >
      <button 
        onClick={() => setStep(1)}
        className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-10"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Role Selection
      </button>

      <div className="mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">What best describes your organization?</h2>
        <p className="text-xl text-zinc-500 max-w-2xl">We'll tailor the platform's features, compliance requirements, and dashboard layout based on your scale.</p>
      </div>

      <div className="flex flex-col gap-6 mb-12">
        {CLIENT_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = clientType === type.id;
          
          return (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setClientType(type.id)}
              className={`group relative overflow-hidden p-0 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex flex-col md:flex-row min-h-[160px] ${
                isSelected 
                  ? 'border-[#4C1D95]/20 bg-white shadow-xl shadow-[#4C1D95]/25' 
                  : 'border-zinc-200 bg-white hover:border-zinc-300 shadow-sm'
              }`}
            >
              {/* Visual Left Side */}
              <div className="w-full md:w-1/3 relative overflow-hidden h-48 md:h-auto">
                <img 
                  src={type.image} 
                  alt={type.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 transition-colors duration-300 ${isSelected ? 'bg-[#4C1D95]/40' : 'bg-surface-dark/20'}`} />
              </div>

              {/* Content Right Side */}
              <div className="w-full md:w-2/3 p-8 flex flex-col justify-center relative">
                {isSelected && (
                  <div className="absolute top-8 right-8 text-[#4C1D95]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                )}
                
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-[#4C1D95]/10 text-[#4C1D95]' : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-2xl text-zinc-900">{type.title}</h3>
                </div>
                
                <p className="text-zinc-500 leading-relaxed max-w-xl text-lg pl-16">
                  {type.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!clientType}
          className={`px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 ${
            clientType 
              ? 'bg-surface-dark text-white hover:scale-105 shadow-2xl shadow-zinc-900/30' 
              : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
          }`}
        >
          Continue Onboarding
        </button>
      </div>
    </motion.div>
  );
}


