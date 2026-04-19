import React from 'react';
import { motion } from 'framer-motion';

export default function LiquidVisualizer({ status }) {
  // Define colors based on state
  const getTheme = () => {
    switch (status) {
      case 'idle':       return { color: '#3F3F46', glow: 'rgba(63, 63, 70, 0.4)' };
      case 'recording':  return { color: '#10B981', glow: 'rgba(16, 185, 129, 0.6)' }; // Emerald
      case 'processing': return { color: '#6366F1', glow: 'rgba(99, 102, 241, 0.6)' }; // Indigo
      case 'speaking':   return { color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.6)' }; // Blue
      default:           return { color: '#3F3F46', glow: 'rgba(63,63,70,0)' };
    }
  };

  const theme = getTheme();

  // --- LIQUID GOO CONFIGURATION ---
  // Drastically different animations based on the AI's current thought process
  const getGooConfig = () => {
    switch (status) {
      case 'idle':
        return { scale: 1, speed: 5, pulse: [1, 1.05, 1] }; // Slow, gentle breathing
      case 'processing':
        return { scale: 0.85, speed: 0.8, pulse: [0.85, 0.95, 0.85] }; // Fast, tight swirling
      case 'speaking':
        return { scale: 1.3, speed: 2.5, pulse: [1.1, 1.4, 1.2, 1.5, 1.1] }; // Large, rhythmic talking pulses
      default:
        return { scale: 1, speed: 4, pulse: [1, 1] };
    }
  };

  const goo = getGooConfig();

  const blobVariants = {
    animate: (custom) => ({
      rotate: [0, 360],
      x: [0, custom.x, -custom.x, 0],
      y: [0, -custom.y, custom.y, 0],
      transition: {
        rotate: { duration: goo.speed * 2, repeat: Infinity, ease: "linear" },
        x: { duration: goo.speed * 1.2, repeat: Infinity, ease: "easeInOut" },
        y: { duration: goo.speed * 1.8, repeat: Infinity, ease: "easeInOut" },
      }
    })
  };

  // --- SPECTRUM BARS CONFIGURATION ---
  // We simulate audio frequencies using an array of random-ish heights
  const spectrumBars = [
    { height: [20, 40, 20, 60, 20], duration: 0.8 },
    { height: [30, 70, 40, 90, 30], duration: 0.6 },
    { height: [20, 100, 30, 80, 20], duration: 0.7 },
    { height: [40, 120, 60, 140, 40], duration: 0.5 }, // Center peak
    { height: [20, 90, 40, 100, 20], duration: 0.65 },
    { height: [30, 60, 20, 70, 30], duration: 0.75 },
    { height: [20, 50, 20, 40, 20], duration: 0.9 },
  ];

  return (
    <div className="relative flex items-center justify-center w-80 h-80 md:w-[400px] md:h-[400px]">
      
      {/* Background Ambient Glow */}
      <motion.div 
        animate={{ 
          scale: status === 'recording' ? 1.2 : goo.pulse, 
          boxShadow: `0px 0px 60px ${theme.glow}` 
        }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-40 h-40 md:w-56 md:h-56 rounded-full blur-2xl z-0"
        style={{ backgroundColor: theme.color }}
      />

      {status === 'recording' ? (
        
        /* ----------------------------------
           STATE: RECORDING (SPECTRUM BARS)
           ---------------------------------- */
        <div className="relative z-10 flex items-center justify-center gap-2 md:gap-3 h-40">
          {spectrumBars.map((bar, i) => (
            <motion.div
              key={i}
              className="w-4 md:w-5 rounded-full"
              style={{ backgroundColor: theme.color, boxShadow: `0 0 15px ${theme.glow}` }}
              animate={{ height: bar.height }}
              transition={{
                duration: bar.duration,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
          {/* Centered Mic Icon overlayed on bars */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-overlay opacity-50">
             <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
             </svg>
          </div>
        </div>

      ) : (

        /* ----------------------------------
           STATE: IDLE / PROCESSING / SPEAKING (LIQUID GOO)
           ---------------------------------- */
        <>
          <svg className="hidden">
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
          </svg>

          <div 
            className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center z-10"
            style={{ filter: "url(#goo)" }}
          >
            {/* Core center orb */}
            <motion.div
              animate={{ scale: goo.pulse }}
              transition={{ duration: goo.speed, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full"
              style={{ backgroundColor: theme.color }}
            />
            
            {/* Orbiting orb 1 */}
            <motion.div
              custom={{ x: 40, y: 30 }}
              variants={blobVariants}
              animate="animate"
              className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full mix-blend-screen"
              style={{ backgroundColor: theme.color }}
            />

            {/* Orbiting orb 2 */}
            <motion.div
              custom={{ x: -30, y: 40 }}
              variants={blobVariants}
              animate="animate"
              className="absolute w-20 h-20 md:w-28 md:h-28 rounded-full mix-blend-screen"
              style={{ backgroundColor: theme.color }}
            />
          </div>

          {/* Center Icon */}
          <motion.div 
            animate={{ scale: goo.pulse[0] }}
            className="absolute z-20 pointer-events-none"
          >
            <svg className="w-10 h-10 md:w-12 md:h-12 text-white/90 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {status === 'processing' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              )}
            </svg>
          </motion.div>
        </>
      )}
    </div>
  );
}