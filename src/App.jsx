import React, { useState } from 'react';
import Welcome from './pages/Welcome';
import Interview from './pages/Interview';
import Results from './pages/Results';
import AnimatedBackgroundOrbs from './components/welcome/AnimatedBackgroundOrbs';

export default function App() {
  const [currentView, setCurrentView] = useState('welcome');
  const [candidateName, setCandidateName] = useState('');
  const [evaluationData, setEvaluationData] = useState(null);

  const handleStartInterview = (name) => {
    setCandidateName(name);
    setCurrentView('interview');
  };

  const handleInterviewComplete = (results) => {
    setEvaluationData(results);
    setCurrentView('results');
  };

  return (
    <div className="min-h-screen bg-background-primary text-text-primary selection:bg-accent-primary/30">
      <AnimatedBackgroundOrbs />
      
      {currentView === 'welcome' && (
        <Welcome onStart={handleStartInterview} />
      )}
      
      {currentView === 'interview' && (
        <Interview 
          name={candidateName} 
          onComplete={handleInterviewComplete} 
        />
      )}
      
      {currentView === 'results' && (
        <Results 
          data={evaluationData} 
          name={candidateName} 
        />
      )}
    </div>
  );
}