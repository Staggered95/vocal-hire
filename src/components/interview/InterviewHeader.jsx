// src/components/interview/InterviewHeader.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InterviewHeader({ name, status, setStatus, transcriptHistory, navigate }) {
  // Add local state to manage our custom error messages
  const [error, setError] = useState(null);

  // Helper function to show an error and auto-dismiss it after 4 seconds
  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 4000);
  };

  const handleEndInterview = async () => {
    // Guard removed: Free access to the result screen for quick demos!
    
    if (status === 'processing') return; 

    try {
      setStatus('processing');
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: transcriptHistory })
      });
      
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      
      const data = await response.json();
      navigate('/results', { state: { data, name } });
      
    } catch (err) {
      showError("The AI evaluator is currently overloaded. Please try again.");
      setStatus('idle');
    }
  };

  return (
    <header className="w-full max-w-3xl mx-auto mb-8">
      {/* Main Header Content */}
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Live Interview</h1>
          <p className="text-sm text-text-muted">Candidate: {name}</p>
        </div>
        <button 
          onClick={handleEndInterview}
          className="px-4 py-2 text-sm font-medium text-error bg-error/10 rounded-lg hover:bg-error/20 transition-colors disabled:opacity-50"
          disabled={status === 'processing' || status === 'recording'}
        >
          {status === 'processing' ? 'Evaluating...' : 'Get Result'}
        </button>
      </div>

      {/* Sleek Animated Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="w-full overflow-hidden"
          >
            <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
              {/* Info Icon SVG */}
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}