import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function SecurityBadge() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex items-center justify-center gap-2 mt-8 py-4 border-t border-zinc-100"
    >
      <ShieldCheck className="w-4 h-4 text-success" />
      <span className="text-xs text-zinc-500 font-medium">Your session is encrypted and protected.</span>
    </motion.div>
  );
}
