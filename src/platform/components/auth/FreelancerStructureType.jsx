import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, Building, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRegistrationStore } from '../../store/authStore';

const STRUCTURE_TYPES = [
  {
    id: 'individual',
    icon: User,
    title: 'Individual Professional',
    description: 'Independent creator or consultant working personally directly with clients.',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'sme',
    icon: Users,
    title: 'SME / Creative Agency',
    description: 'Small freelance team or agency serving multiple clients. Access team delegation and shared portfolios.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'corporate',
    icon: Building,
    title: 'Corporate Service Provider',
    description: 'Large professional organization delivering enterprise-scale services, requiring procurement workflows.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
  }
];

export default function FreelancerStructureType() {
  const { freelancerType, setFreelancerType, setStep } = useRegistrationStore();

  const handleNext = () => {
    if (freelancerType) setStep(4);
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
        onClick={() => setStep(2)}
        className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-10"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Work Mode
      </button>

      <div className="mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">What best describes your structure?</h2>
        <p className="text-xl text-zinc-500 max-w-2xl">This sets up your portfolio type and unlocks specific agency or enterprise tools.</p>
      </div>

      <div className="flex flex-col gap-6 mb-12">
        {STRUCTURE_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = freelancerType === type.id;
          
          return (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setFreelancerType(type.id)}
              className={`group relative overflow-hidden p-0 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex flex-col md:flex-row min-h-[160px] ${
                isSelected 
                  ? 'border-emerald-600 bg-white shadow-xl shadow-emerald-600/10' 
                  : 'border-zinc-200 bg-white hover:border-zinc-300 shadow-sm'
              }`}
            >
              <div className="w-full md:w-1/3 relative overflow-hidden h-48 md:h-auto">
                <img 
                  src={type.image} 
                  alt={type.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 transition-colors duration-300 ${isSelected ? 'bg-emerald-900/40' : 'bg-surface-dark/20'}`} />
              </div>

              <div className="w-full md:w-2/3 p-8 flex flex-col justify-center relative">
                {isSelected && (
                  <div className="absolute top-8 right-8 text-success">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                )}
                
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
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
          disabled={!freelancerType}
          className={`px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 ${
            freelancerType 
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
