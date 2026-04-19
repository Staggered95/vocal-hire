// src/components/interview/InterviewControls.jsx
import React from 'react';

export default function InterviewControls({ status, startRecording, stopRecording, cancelRecording }) {
  return (
    <footer className="w-full max-w-md mb-8">
      {status === 'idle' || status === 'speaking' ? (
        <button
          onClick={startRecording}
          className="w-full py-4 bg-background-secondary border border-border hover:border-accent-primary text-text-primary rounded-full font-bold transition-all flex items-center justify-center gap-3 group"
        >
          <div className="w-3 h-3 rounded-full bg-accent-primary group-hover:animate-pulse" />
          Hold or Tap to Speak
        </button>
      ) : status === 'recording' ? (
        <div className="flex w-full gap-4">
          <button
            onClick={cancelRecording}
            className="w-1/3 py-4 bg-background-active text-text-muted hover:text-white hover:bg-error/80 rounded-full font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={stopRecording}
            className="w-2/3 py-4 bg-accent-secondary text-gray-900 rounded-full font-bold shadow-[0_0_20px_var(--acc-secondary)] transition-all flex items-center justify-center gap-3"
          >
            <div className="w-3 h-3 bg-gray-900 rounded-sm" />
            Done Speaking
          </button>
        </div>
      ) : (
        <button disabled className="w-full py-4 bg-background-active text-text-muted rounded-full font-bold cursor-not-allowed flex items-center justify-center gap-3">
          Processing...
        </button>
      )}
    </footer>
  );
}