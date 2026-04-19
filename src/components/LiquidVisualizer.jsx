import React from 'react';
import { motion } from 'framer-motion';

export default function LiquidVisualizer({ status }) {
  // Define the colors and speeds based on state
  const getStateConfig = () => {
    switch (status) {
      case 'idle':
        return {
          color: '#3F3F46', // background-active
          scale: 1,
          speed: 4,
          glow: 'rgba(63, 63, 70, 0.4)'
        };
      case 'recording':
        return {
          color: '#10B981', // accent-secondary (Emerald)
          scale: 1.15,
          speed: 1.5,
          glow: 'rgba(16, 185, 129, 0.6)'
        };
      case 'processing':
        return {
          color: '#6366F1', // accent-tertiary (Indigo)
          scale: 0.9,
          speed: 1,
          glow: 'rgba(99, 102, 241, 0.6)'
        };
      case 'speaking':
        return {
          color: '#3B82F6', // accent-primary (Blue)
          scale: 1.2,
          speed: 2,
          glow: 'rgba(59, 130, 246, 0.6)'
        };
      default:
        return { color: '#3F3F46', scale: 1, speed: 4, glow: 'rgba(63,63,70,0)' };
    }
  };

  const config = getStateConfig();

  // Create 3 orbiting blobs that fuse together using the SVG filter
  const blobVariants = {
    animate: (custom) => ({
      rotate: [0, 360],
      scale: [1, 1.1, 0.9, 1],
      x: [0, custom.x, -custom.x, 0],
      y: [0, -custom.y, custom.y, 0],
      transition: {
        rotate: { duration: config.speed * 2, repeat: Infinity, ease: "linear" },
        scale: { duration: config.speed * 1.5, repeat: Infinity, ease: "easeInOut" },
        x: { duration: config.speed * 1.2, repeat: Infinity, ease: "easeInOut" },
        y: { duration: config.speed * 1.8, repeat: Infinity, ease: "easeInOut" },
      }
    })
  };

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      
      {/* 1. The hidden SVG Filter that creates the "Goo" effect */}
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* 2. The Background Glow */}
      <motion.div 
        animate={{ scale: config.scale, boxShadow: `0px 0px 40px ${config.glow}` }}
        transition={{ duration: 0.5 }}
        className="absolute w-32 h-32 rounded-full blur-xl z-0"
        style={{ backgroundColor: config.color }}
      />

      {/* 3. The Gooey Container */}
      <div 
        className="relative w-48 h-48 flex items-center justify-center z-10"
        style={{ filter: "url(#goo)" }}
      >
        {/* Core center orb */}
        <motion.div
          animate={{ scale: config.scale }}
          transition={{ duration: 0.5 }}
          className="absolute w-24 h-24 rounded-full"
          style={{ backgroundColor: config.color }}
        />
        
        {/* Orbiting orb 1 */}
        <motion.div
          custom={{ x: 20, y: 15 }}
          variants={blobVariants}
          animate="animate"
          className="absolute w-20 h-20 rounded-full mix-blend-screen"
          style={{ backgroundColor: config.color }}
        />

        {/* Orbiting orb 2 */}
        <motion.div
          custom={{ x: -15, y: 20 }}
          variants={blobVariants}
          animate="animate"
          className="absolute w-16 h-16 rounded-full mix-blend-screen"
          style={{ backgroundColor: config.color }}
        />
      </div>

      {/* 4. The Center Icon (Over the goo) */}
      <motion.div 
        animate={{ scale: config.scale }}
        className="absolute z-20 pointer-events-none"
      >
        <svg className="w-8 h-8 text-white/90 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {status === 'recording' ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          )}
        </svg>
      </motion.div>

    </div>
  );
}