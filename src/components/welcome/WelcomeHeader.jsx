import React from 'react';
import { motion } from 'framer-motion';

export default function WelcomeHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 text-cyan-300 border border-cyan-500/20 mb-6 shadow-[0_0_15px_rgba(34,211,238,0.1)] relative">
        <svg className="w-7 h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-100 mb-3 relative">
        Cuemath
        <span className="block text-xl font-medium text-slate-400 mt-1">Tutor Screening</span>
      </h1>
      <p className="text-base text-slate-400 max-w-sm">
        Welcome! This short voice assessment helps us understand your communication style.
      </p>
    </motion.div>
  );
}