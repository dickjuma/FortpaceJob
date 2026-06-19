import React from 'react';
import { motion } from 'framer-motion';

const ActionItem = ({ icon: Icon, title, description, buttonText, onClick, isUrgent = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:border-[#4C1D95]/20 dark:hover:border-[#4C1D95]/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full flex-shrink-0 ${isUrgent ? 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 group-hover:bg-[#4C1D95]/5 group-hover:text-[#4C1D95] dark:group-hover:bg-[#4C1D95]/10 dark:group-hover:text-[#4C1D95]'} transition-colors`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            {title}
            {isUrgent && <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 text-[10px] uppercase font-bold tracking-wider">Urgent</span>}
          </h4>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">{description}</p>
        </div>
      </div>
      <button 
        onClick={onClick}
        className="ml-4 flex-shrink-0 px-4 py-2 text-sm font-semibold text-[#4C1D95] dark:text-[#4C1D95] bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10 rounded-xl hover:bg-[#4C1D95]/10 dark:hover:bg-[#4C1D95]/20 transition-colors"
      >
        {buttonText}
      </button>
    </motion.div>
  );
};

export default ActionItem;


