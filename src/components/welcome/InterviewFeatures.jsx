import React from 'react';
import { motion } from 'framer-motion';

export default function InterviewFeatures() {
  const features = [
    {
      icon: "🗣️",
      title: "Conversational",
      desc: "This is a voice interview. Speak naturally, as you would in a real tutoring session."
    },
    {
      icon: "🧩",
      title: "Scenario-Based",
      desc: "We'll explore simple concepts or classroom scenarios like explaining fractions."
    },
    {
      icon: "⏱️",
      title: "Quick & Easy",
      desc: "This entire assessment will take less than 10 minutes."
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-200 mb-2">What to expect</h2>
        <p className="text-sm text-slate-400">Our AI focuses on your communication, warmth, and tutoring temperament.</p>
      </div>

      <div className="space-y-6">
        {features.map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            className="flex gap-4"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-lg border border-slate-700 shadow-inner">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-200">{feature.title}</h3>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}