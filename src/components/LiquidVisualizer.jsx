import React from 'react';
import { motion } from 'framer-motion';

export default function LiquidVisualizer({ status }) {
  const getTheme = () => {
    switch (status) {
      case 'idle':       return { color: '#3F3F46', glow: 'rgba(63, 63, 70, 0.4)' };
      case 'recording':  return { color: '#10B981', glow: 'rgba(16, 185, 129, 0.6)' }; 
      case 'processing': return { color: '#6366F1', glow: 'rgba(99, 102, 241, 0.6)' }; 
      case 'speaking':   return { color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.6)' }; 
      default:           return { color: '#3F3F46', glow: 'rgba(63,63,70,0)' };
    }
  };

  const theme = getTheme();

  const getGooConfig = () => {
    switch (status) {
      case 'idle':       return { scale: 1, speed: 12, pulse: [1, 1.02, 1] }; 
      case 'processing': return { scale: 0.85, speed: 0.8, pulse: [0.85, 0.95, 0.85] };
      case 'speaking':   return { scale: 1.3, speed: 2.5, pulse: [1.1, 1.4, 1.2, 1.5, 1.1] };
      default:           return { scale: 1, speed: 12, pulse: [1, 1] };
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

  // SCALED DOWN: Heights reduced by ~30% so they don't overflow the new smaller container
  const spectrumBars = [
    { height: [15, 30, 15, 45, 15], duration: 0.8 },
    { height: [20, 50, 30, 65, 20], duration: 0.6 },
    { height: [15, 75, 20, 60, 15], duration: 0.7 },
    { height: [30, 90, 45, 100, 30], duration: 0.5 }, 
    { height: [15, 65, 30, 75, 15], duration: 0.65 },
    { height: [20, 45, 15, 50, 20], duration: 0.75 },
    { height: [15, 35, 15, 30, 15], duration: 0.9 },
  ];

  return (
    <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
      
      {/* Background Ambient Glow */}
      <motion.div 
        animate={{ 
          scale: status === 'recording' ? 1.2 : goo.pulse, 
          boxShadow: `0px 0px 60px ${theme.glow}` 
        }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full blur-2xl z-0"
        style={{ backgroundColor: theme.color }}
      />

      {status === 'recording' ? (
        
        /* STATE: RECORDING (SPECTRUM BARS) */
        <div className="relative z-10 flex items-center justify-center gap-2 md:gap-3 h-28 md:h-32">
          {spectrumBars.map((bar, i) => (
            <motion.div
              key={i}
              className="w-3 md:w-4 rounded-full"
              style={{ backgroundColor: theme.color, boxShadow: `0 0 15px ${theme.glow}` }}
              animate={{ height: bar.height }}
              transition={{
                duration: bar.duration,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-overlay opacity-50">
             <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
             </svg>
          </div>
        </div>

      ) : (

        /* STATE: IDLE / PROCESSING / SPEAKING (LIQUID GOO) */
        <>
          <svg className="hidden">
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
          </svg>

          {/* SCALED DOWN: Gooey wrapper */}
          <div 
            className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center z-10"
            style={{ filter: "url(#goo)" }}
          >
            {/* Core center orb */}
            <motion.div
              animate={{ scale: goo.pulse }}
              transition={{ duration: goo.speed, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full"
              style={{ backgroundColor: theme.color }}
            />
            
            {/* Orbiting orb 1 */}
            <motion.div
              custom={{ x: 30, y: 20 }}
              variants={blobVariants}
              animate="animate"
              className="absolute w-20 h-20 md:w-28 md:h-28 rounded-full mix-blend-screen"
              style={{ backgroundColor: theme.color }}
            />

            {/* Orbiting orb 2 */}
            <motion.div
              custom={{ x: -20, y: 30 }}
              variants={blobVariants}
              animate="animate"
              className="absolute w-16 h-16 md:w-24 md:h-24 rounded-full mix-blend-screen"
              style={{ backgroundColor: theme.color }}
            />
          </div>

          {/* Center Icon */}
          <motion.div 
            animate={{ scale: goo.pulse[0] }}
            className="absolute z-20 pointer-events-none"
          >
            <svg className="w-8 h-8 md:w-10 md:h-10 text-white/90 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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