// src/pages/Interview.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useVoiceManager from '../hooks/useVoiceManager';
import InterviewHeader from '../components/interview/InterviewHeader';
import InterviewControls from '../components/interview/InterviewControls';
import LiquidVisualizer from '../components/LiquidVisualizer';
import LiveCaption from '../components/LiveCaptions';

export default function Interview() {
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.name || "Candidate";

  // All logic is cleanly imported from our custom hook
  const { 
    status, setStatus, transcriptHistory, 
    startRecording, stopRecording, cancelRecording 
  } = useVoiceManager(name);

  const currentMessage = transcriptHistory[transcriptHistory.length - 1];

  return (
    <div className="h-[100dvh] flex flex-col items-center justify-between p-4 md:p-8 overflow-hidden">
      
      <InterviewHeader 
        name={name} 
        status={status} 
        setStatus={setStatus} 
        transcriptHistory={transcriptHistory} 
        navigate={navigate} 
      />

      {/* Center Stage: Decoupled Absolute Layout */}
      <main className="flex-1 flex flex-col items-center justify-end w-full relative z-10 py-4 min-h-0">
        
        {/* Background Layer: The Audio Visualizer */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] pointer-events-none z-0">
          <LiquidVisualizer status={status} />
        </div>

        {/* Foreground Layer: The Captions */}
        <div className="w-full max-w-3xl px-4 z-10 min-h-[160px] flex flex-col justify-end pb-8">
            <LiveCaption currentMessage={currentMessage} />
        </div>
        
      </main>

      <InterviewControls 
        status={status} 
        startRecording={startRecording} 
        stopRecording={stopRecording} 
        cancelRecording={cancelRecording} 
      />

    </div>
  );
}