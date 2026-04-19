import React from 'react';
import { motion } from 'framer-motion';

export default function QuickStartGuide() {
  const steps = [
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      ),
      title: "Audio Check",
      desc: "Ensure you are in a quiet environment. We'll briefly request microphone access when you start."
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
      title: "The Conversation",
      desc: "Speak naturally. The AI will ask you to explain simple concepts as if you were talking to a real student."
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      title: "Instant Results",
      desc: "Once you end the call, you'll receive an immediate breakdown of your clarity, warmth, and teaching style."
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">How it works</h2>
        <p className="text-sm text-slate-400">A quick, stress-free assessment of your tutoring temperament.</p>
      </div>

      <div className="relative relative-pl-4">
        {/* The Vertical Connecting Line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-cyan-500/50 via-purple-500/30 to-transparent z-0" />

        <div className="space-y-8 relative z-10">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="flex gap-5 group"
            >
              {/* SVG Node */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-cyan-400 group-hover:text-cyan-300 transition-colors shadow-lg relative">
                {step.icon}
                {/* Subtle glow behind the icon on hover */}
                <div className="absolute inset-0 rounded-full bg-cyan-400/0 group-hover:bg-cyan-400/20 blur-md transition-all z-[-1]" />
              </div>
              
              {/* Text Content */}
              <div className="pt-1.5">
                <h3 className="text-base font-semibold text-slate-200 group-hover:text-slate-100 transition-colors">{step.title}</h3>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed pr-4">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}