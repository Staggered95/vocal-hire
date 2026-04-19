import React from 'react';
import { motion } from 'framer-motion';
import WelcomeHeader from '../components/welcome/WelcomeHeader';
import InterviewFeatures from '../components/welcome/InterviewFeatures';
import NameAndAudioForm from '../components/welcome/NameAndAudioForm';

export default function Welcome({ onStart }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 w-full">
      
      

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10"
      >
        {/* Left Side: Form & Interaction (z-index ensures it's above orbs) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <WelcomeHeader />
          <NameAndAudioForm onStart={onStart} />
        </div>

        {/* Right Side: Information & Context */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-800/80 to-slate-900 p-8 md:p-12 border-t md:border-t-0 md:border-l border-slate-700 flex flex-col justify-center">
          <InterviewFeatures />
        </div>
      </motion.div>
    </div>
  );
}