import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Interview from './pages/Interview';
import Results from './pages/Results';
import AnimatedBackgroundOrbs from './components/AnimatedBackgroundOrbs';

export default function App() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary selection:bg-accent-primary/30">
      <AnimatedBackgroundOrbs />
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/results" element={<Results />} />
          {/* Catch-all route to send lost users back to the start */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}