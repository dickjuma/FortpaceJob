// @ts-nocheck
import React from 'react';
import { cn } from './Button';
import { motion } from 'framer-motion';

export default function SectionTitle({ 
  title, 
  subtitle, 
  centered = true, 
  badge,
  className 
}) {
  return (
    <div className={cn("mb-16", centered && "text-center", className)}>
      {badge && (
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            "inline-block px-3 py-1 text-sm font-semibold tracking-wide uppercase rounded-full mb-4",
            "bg-emerald-50 text-emerald-700 border border-emerald-100"
          )}
        >
          {badge}
        </motion.span>
      )}
      
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 mb-4"
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
