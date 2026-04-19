import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function NameForm({ onStart }) {
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
        errorMessage = 'Hardware Lock: Your mic is currently locked by another app.';
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
    <form onSubmit={handleStart} className="space-y-6">
      <motion.div
         initial={{ opacity: 0, x: -10 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isCheckingMic}
          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 text-slate-100 placeholder-slate-500 transition-all outline-none"
          placeholder="e.g. Aditi Sharma"
        />
      </motion.div>

      {status.message && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`p-3 rounded-lg text-sm ${
            status.error 
              ? 'text-red-400 bg-red-950/30 border border-red-900/50' 
              : 'text-cyan-400 bg-cyan-950/30 border border-cyan-900/50'
          }`}
        >
          {status.message}
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isCheckingMic}
        className="w-full py-3.5 font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-xl hover:from-cyan-300 hover:to-cyan-200 transition-all disabled:opacity-50 flex justify-center items-center shadow-[0_0_20px_rgba(34,211,238,0.2)]"
      >
        {isCheckingMic ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </span>
        ) : (
          "Start Interview"
        )}
      </motion.button>
    </form>
  );
}