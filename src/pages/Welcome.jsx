import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Welcome({ onStart }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState({ error: false, message: '' });
  const [isCheckingMic, setIsCheckingMic] = useState(false);

  const handleStart = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setStatus({ error: true, message: 'Please enter your name.' });

    setIsCheckingMic(true);
    setStatus({ error: false, message: 'Requesting microphone access...' });

    try {
      if (!navigator.mediaDevices) {
        throw new Error("MediaDevices API not available (Requires HTTPS or localhost)");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      onStart(name.trim());
      
    } catch (err) {
      console.error("Mic access error:", err);
      let errorMessage = 'Microphone access is required.';

      if (err.message.includes("MediaDevices API not available")) {
        errorMessage = 'Security Block: Browser requires HTTPS or strictly "localhost".';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'Hardware Error: No microphone detected on this device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Hardware Lock: Your mic is currently locked by another app (Zoom, Discord, etc).';
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Permission Error: Browser or OS is blocking access.';
      }

      setStatus({ 
        error: true, 
        message: `${errorMessage} (Code: ${err.name || 'Undefined'})` 
      });
      setIsCheckingMic(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-background-secondary border border-border rounded-2xl shadow-2xl p-8"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-primary/10 text-accent-primary mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Cuemath Tutor Screening</h1>
          <p className="text-sm text-text-secondary">A brief interactive voice assessment.</p>
        </motion.div>

        <form onSubmit={handleStart} className="space-y-6">
          <motion.div
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isCheckingMic}
              className="w-full px-4 py-3 bg-background-primary border border-border rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent text-text-primary placeholder-text-muted transition-all outline-none"
              placeholder="e.g. Aditi Sharma"
            />
          </motion.div>

          {status.message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`p-3 rounded-lg text-sm ${status.error ? 'text-error bg-error/10 border border-error/20' : 'text-accent-primary bg-accent-primary/10 border border-accent-primary/20'}`}
            >
              {status.message}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isCheckingMic}
            className="w-full py-3 font-semibold text-white bg-accent-primary rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {isCheckingMic ? "Connecting..." : "Start Interview"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}