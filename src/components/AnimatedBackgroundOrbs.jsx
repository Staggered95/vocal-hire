import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackgroundOrbs() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      
      {/* Orb 1: Frosty Cyan */}
      <motion.div
        className="absolute rounded-full mix-blend-screen"
        style={{
          width: '450px', height: '450px',
          backgroundColor: '#06b6d4', 
          filter: 'blur(100px)',
          opacity: 0.35,
        }}
        initial={{ top: '-10%', left: '-10%' }}
        animate={{
          x: [0, 120, -50, 0],
          y: [0, 80, 150, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Orb 2: Deep Indigo */}
      <motion.div
        className="absolute rounded-full mix-blend-screen"
        style={{
          width: '500px', height: '500px',
          backgroundColor: '#4338ca', 
          filter: 'blur(120px)',
          opacity: 0.4,
        }}
        initial={{ top: '40%', left: '50%' }}
        animate={{
          x: [0, -150, -50, 0],
          y: [0, -100, -200, 0],
          scale: [1, 1.2, 1.1, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orb 3: Pale Lavender */}
      <motion.div
        className="absolute rounded-full mix-blend-screen"
        style={{
          width: '350px', height: '350px',
          backgroundColor: '#a855f7', 
          filter: 'blur(90px)',
          opacity: 0.3,
        }}
        initial={{ top: '20%', left: '15%' }}
        animate={{
          x: [0, 150, 80, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.05, 1.15, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orb 4: Icy Blue */}
      <motion.div
        className="absolute rounded-full mix-blend-screen"
        style={{
          width: '400px', height: '400px',
          backgroundColor: '#60a5fa', 
          filter: 'blur(100px)',
          opacity: 0.25,
        }}
        initial={{ top: '60%', left: '-5%' }}
        animate={{
          x: [0, 200, 100, 0],
          y: [0, -50, -150, 0],
          scale: [1, 1.2, 1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orb 5: Soft Cherry Blossom Pink (Accent) */}
      <motion.div
        className="absolute rounded-full mix-blend-screen"
        style={{
          width: '250px', height: '250px',
          backgroundColor: '#f472b6', 
          filter: 'blur(80px)',
          opacity: 0.2,
        }}
        initial={{ top: '10%', right: '10%' }}
        animate={{
          x: [0, -100, -150, 0],
          y: [0, 150, 50, 0],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orb 6: Dark Purple Base */}
      <motion.div
        className="absolute rounded-full mix-blend-screen"
        style={{
          width: '600px', height: '600px',
          backgroundColor: '#312e81', 
          filter: 'blur(140px)',
          opacity: 0.5,
        }}
        initial={{ bottom: '-20%', right: '-10%' }}
        animate={{
          x: [0, -50, 50, 0],
          y: [0, -100, -50, 0],
          scale: [1, 1.1, 1.05, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      
    </div>
  );
}