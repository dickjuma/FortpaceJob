import React from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, Network, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRegistrationStore } from '../../store/authStore';

const WORK_MODES = [
  {
    id: 'online',
    icon: Globe,
    title: 'Online Services',
    description: 'Work remotely from anywhere in the world. Ideal for digital services, remote collaboration, and global clients.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'onsite',
    icon: MapPin,
    title: 'Onsite / Field Work',
    description: 'Provide physical or location-based services. Perfect for technicians, local consulting, and field operations.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'hybrid',
    icon: Network,
    title: 'Hybrid Delivery',
    description: 'Offer both online and onsite services. A flexible workflow model connecting local presence with global opportunities.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800'
  }
];

export default function FreelancerWorkMode() {
  const { freelancerMode, setFreelancerMode, setStep } = useRegistrationStore();

  const handleNext = () => {
    if (freelancerMode) setStep(3);
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
        <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">How do you deliver your services?</h2>
        <p className="text-xl text-zinc-500 max-w-2xl">This helps us match you with the right clients and customize your project delivery tools.</p>
      </div>

      <div className="flex flex-col gap-6 mb-12">
        {WORK_MODES.map((mode) => {
          const Icon = mode.icon;
          const isSelected = freelancerMode === mode.id;
          
          return (
            <motion.div
              key={mode.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setFreelancerMode(mode.id)}
              className={`group relative overflow-hidden p-0 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex flex-col md:flex-row min-h-[160px] ${
                isSelected 
                  ? 'border-emerald-600 bg-white shadow-xl shadow-emerald-600/10' 
                  : 'border-zinc-200 bg-white hover:border-zinc-300 shadow-sm'
              }`}
            >
              <div className="w-full md:w-1/3 relative overflow-hidden h-48 md:h-auto">
                <img 
                  src={mode.image} 
                  alt={mode.title}
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
                  <h3 className="font-bold text-2xl text-zinc-900">{mode.title}</h3>
                </div>
                
                <p className="text-zinc-500 leading-relaxed max-w-xl text-lg pl-16">
                  {mode.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!freelancerMode}
          className={`px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 ${
            freelancerMode 
              ? 'bg-surface-dark text-white hover:scale-105 shadow-2xl shadow-zinc-900/30' 
              : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
