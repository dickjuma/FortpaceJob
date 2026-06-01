import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, Globe2, ArrowRight, ArrowLeft } from 'lucide-react';
import useOnboardingStore from '../../../store/useOnboardingStore';

const structures = [
  {
    id: 'individual',
    title: 'Individual',
    description: 'For solo professionals and personal hiring.',
    icon: User,
    examples: ['Freelancer', 'Remote worker', 'Consultant']
  },
  {
    id: 'sme',
    title: 'SME / Small Business',
    description: 'For small teams, startups, agencies, and growing businesses.',
    icon: Users,
    examples: ['Design studio', 'Local workshop', 'Startup']
  },
  {
    id: 'corporate',
    title: 'Corporate / Enterprise',
    description: 'For larger organizations, managed teams, and enterprise hiring.',
    icon: Globe2,
    examples: ['Enterprise HR', 'Procurement team', 'Large agency']
  }
];

const Step2BusinessStructure = () => {
  const { businessStructure, setBusinessStructure, nextStep, prevStep } = useOnboardingStore();

  const handleContinue = () => {
    if (businessStructure) {
      nextStep();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-5xl mx-auto flex flex-col items-center mt-8"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
          How are you joining?
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Choose the structure that best fits your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
        {structures.map((struct) => (
          <motion.div
            key={struct.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setBusinessStructure(struct.id)}
            className={`relative cursor-pointer overflow-hidden rounded-3xl p-6 transition-all duration-300 border-2 flex flex-col ${
              businessStructure === struct.id 
                ? 'border-[#14a800] bg-[#14a800]/5/50 dark:bg-[#14a800]/10 shadow-xl shadow-[#14a800]/25' 
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#14a800]/50 dark:hover:border-[#14a800] hover:shadow-lg'
            }`}
          >
            {businessStructure === struct.id && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#14a800]/5 to-#14a800]/5 pointer-events-none" />
            )}
            <div className="relative z-10 flex flex-col h-full">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors ${
                businessStructure === struct.id ? 'bg-[#14a800] text-white shadow-md' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
              }`}>
                <struct.icon className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">{struct.title}</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 flex-grow">
                {struct.description}
              </p>
              <div>
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Examples</h3>
                <ul className="space-y-2">
                  {struct.examples.map((example, i) => (
                    <li key={i} className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg px-3 py-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${businessStructure === struct.id ? 'bg-[#14a800]' : 'bg-zinc-300 dark:bg-zinc-600'}`} />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
        <button
          onClick={prevStep}
          className="flex items-center justify-center px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!businessStructure}
          className={`group flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
            businessStructure 
              ? 'bg-gradient-to-r from-[#14a800] to-blue-600 text-white shadow-lg shadow-[#14a800]/25 hover:shadow-[#14a800]/25 hover:-tranzinc-y-1' 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight className={`ml-2 w-5 h-5 transition-transform duration-300 ${businessStructure ? 'group-hover:tranzinc-x-1' : ''}`} />
        </button>
      </div>
    </motion.div>
  );
};

export default Step2BusinessStructure;
