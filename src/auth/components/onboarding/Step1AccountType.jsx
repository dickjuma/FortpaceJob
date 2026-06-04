import React from 'react';
import { motion } from 'framer-motion';
import { Building2, User, ArrowRight } from 'lucide-react';
import useOnboardingStore from '../../../store/useOnboardingStore';

const Step1AccountType = () => {
  const { accountType, setAccountType, nextStep } = useOnboardingStore();

  const handleSelect = (type) => {
    setAccountType(type);
  };

  const handleContinue = () => {
    if (accountType) {
      nextStep();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-4xl mx-auto flex flex-col items-center mt-12"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
          Join the Future of Work
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Hire top talent or offer your professional services worldwide. Choose how you want to use Forte.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
        {/* Client Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect('client')}
          className={`relative cursor-pointer overflow-hidden rounded-3xl p-8 transition-all duration-300 border-2 ${
            accountType === 'client' 
              ? 'border-[#2bb75c] bg-[#2bb75c]/5/50 dark:bg-[#2bb75c]/10 shadow-xl shadow-[#2bb75c]/25' 
              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#2bb75c]/50 dark:hover:border-[#2bb75c] hover:shadow-lg'
          }`}
        >
          {accountType === 'client' && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2bb75c]/5 to-#2bb75c]/5 pointer-events-none" />
          )}
          <div className="relative z-10 flex flex-col h-full">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
              accountType === 'client' ? 'bg-[#2bb75c] text-white shadow-md' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
            }`}>
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">Client Account</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 flex-grow">
              Hire freelancers, agencies, SMEs, and onsite professionals.
            </p>
            <ul className="space-y-3 mt-auto">
              {['Post jobs', 'Hire talent', 'Manage contracts', 'Build teams'].map((feature, i) => (
                <li key={i} className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  <div className={`w-1.5 h-1.5 rounded-full mr-3 ${accountType === 'client' ? 'bg-[#2bb75c]' : 'bg-zinc-300 dark:bg-zinc-600'}`} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Freelancer Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect('freelancer')}
          className={`relative cursor-pointer overflow-hidden rounded-3xl p-8 transition-all duration-300 border-2 ${
            accountType === 'freelancer' 
              ? 'border-[#2bb75c] bg-[#2bb75c]/5/50 dark:bg-[#2bb75c]/10 shadow-xl shadow-[#2bb75c]/25' 
              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#2bb75c]/50 dark:hover:border-[#2bb75c] hover:shadow-lg'
          }`}
        >
          {accountType === 'freelancer' && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2bb75c]/5 to-#2bb75c]/5 pointer-events-none" />
          )}
          <div className="relative z-10 flex flex-col h-full">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
              accountType === 'freelancer' ? 'bg-[#2bb75c] text-white shadow-md' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
            }`}>
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">Freelancer Account</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 flex-grow">
              Offer services, build your reputation, and grow your business.
            </p>
            <ul className="space-y-3 mt-auto">
              {['Find work', 'Create gigs', 'Get paid', 'Build portfolio'].map((feature, i) => (
                <li key={i} className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  <div className={`w-1.5 h-1.5 rounded-full mr-3 ${accountType === 'freelancer' ? 'bg-[#2bb75c]' : 'bg-zinc-300 dark:bg-zinc-600'}`} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end w-full sm:w-auto sm:ml-auto">
        <button
          onClick={handleContinue}
          disabled={!accountType}
          className={`group flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
            accountType 
              ? 'bg-gradient-to-r from-[#2bb75c] to-blue-600 text-white shadow-lg shadow-[#2bb75c]/25 hover:shadow-[#2bb75c]/25 hover:-tranzinc-y-1' 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight className={`ml-2 w-5 h-5 transition-transform duration-300 ${accountType ? 'group-hover:tranzinc-x-1' : ''}`} />
        </button>
      </div>
    </motion.div>
  );
};

export default Step1AccountType;

