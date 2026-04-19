import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveCaption({ currentMessage }) {
  if (!currentMessage) return <div className="h-16" />; // Placeholder to prevent layout jump

  return (
    <div className="h-24 w-full max-w-lg flex items-center justify-center text-center px-4 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMessage.text}
          initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">
            {currentMessage.speaker}
          </span>
          <p className="text-lg md:text-xl font-medium text-text-primary leading-relaxed">
            "{currentMessage.text}"
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}