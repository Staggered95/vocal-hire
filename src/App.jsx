import React, { useState } from 'react';
import Welcome from './pages/Welcome';
// We will build these placeholders next, but we need them here so it doesn't crash
// import Interview from './pages/Interview';
// import Results from './pages/Results';

export default function App() {
  const [currentView, setCurrentView] = useState('welcome');
  const [candidateName, setCandidateName] = useState('');
  const [evaluationData, setEvaluationData] = useState(null);

  // This is the crucial function the Welcome page is looking for!
  const handleStartInterview = (name) => {
    setCandidateName(name);
    setCurrentView('interview');
  };

  const handleInterviewComplete = (results) => {
    setEvaluationData(results);
    setCurrentView('results');
  };

  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      {currentView === 'welcome' && (
        <Welcome onStart={handleStartInterview} />
      )}
      
      {currentView === 'interview' && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold mb-4">Interview Arena</h2>
          <p className="text-text-secondary">Welcome, {candidateName}!</p>
          <button 
            onClick={() => handleInterviewComplete({ score: 5 })}
            className="mt-8 px-6 py-2 bg-accent-primary rounded-lg"
          >
            Simulate End Interview
          </button>
        </div>
      )}
      
      {currentView === 'results' && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          <pre className="bg-background-secondary p-4 rounded text-stat-success">
            {JSON.stringify(evaluationData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}