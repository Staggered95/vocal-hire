// src/components/interview/InterviewHeader.jsx
import React from 'react';

export default function InterviewHeader({ name, status, setStatus, transcriptHistory, navigate }) {
  
  const handleEndInterview = async () => {
    if (status === 'processing') return; 
    try {
      setStatus('processing');
      const response = await fetch('http://localhost:5000/api/chat/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: transcriptHistory })
      });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      navigate('/results', { state: { data, name } });
    } catch (err) {
      alert("The AI evaluator is currently overloaded. Please try again.");
      setStatus('idle');
    }
  };

  return (
    <header className="flex justify-between items-center mb-8 border-b border-border pb-4 w-full max-w-3xl mx-auto">
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
    </header>
  );
}