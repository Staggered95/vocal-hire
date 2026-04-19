import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveCaption({ currentMessage }) {
  if (!currentMessage) return <div className="h-16" />;

  const words = currentMessage.text.split(" ");
  
  // Is this the AI speaking? If so, trigger the Karaoke effect.
  const isAI = currentMessage.speaker === 'AI';

  // --- KARAOKE ANIMATION CONFIG ---
  // Deepgram Aura speaks at roughly 160 WPM (~375ms per word).
  // We use this to fake the exact timestamp syncing.
  const timePerWord = 0.37; 

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        // Start highlighting the words immediately as the audio starts
        staggerChildren: timePerWord, 
        delayChildren: 0.2
      },
    },
    exit: {
      opacity: 0,
      y: -15,
      filter: "blur(4px)",
      transition: { duration: 0.3 },
    },
  };

  const wordVariants = {
    // Start dim and muted
    hidden: { 
      color: "var(--text-muted, #71717A)", // Fallback to zinc-500
      opacity: 0.4,
      filter: "blur(2px)"
    },
    // Light up bright white when it's "spoken"
    visible: { 
      color: "var(--text-primary, #F4F4F5)", // Fallback to zinc-100
      opacity: 1, 
      filter: "blur(0px)",
      transition: { duration: 0.2 } 
    },
  };

  return (
    <div className="w-full flex flex-col items-center px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMessage.text}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col items-center w-full"
        >
          {/* Speaker Label */}
          <motion.span 
            className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3"
          >
            {currentMessage.speaker}
          </motion.span>
          
          {/* The Karaoke Text Container */}
          <motion.p 
            variants={containerVariants}
            className="text-xl md:text-2xl font-medium leading-relaxed flex flex-wrap justify-center text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
          >
            {words.map((word, index) => {
              // If it's the User speaking, we just show it normally without the slow karaoke sweep
              if (!isAI) {
                return (
                  <span key={index} className="mr-[0.25em] mb-1 inline-block text-text-primary">
                    {word}
                  </span>
                );
              }

              // If it's the AI, apply the Karaoke sweep
              return (
                <motion.span
                  key={index}
                  variants={wordVariants}
                  className="mr-[0.25em] mb-1 inline-block"
                >
                  {word}
                </motion.span>
              );
            })}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}