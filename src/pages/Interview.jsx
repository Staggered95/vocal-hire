import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Interview({ name, onComplete }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'recording' | 'processing' | 'speaking'
  const [transcript, setTranscript] = useState([
    { speaker: 'AI', text: `Hi ${name}, I'm your Cuemath interviewer. Are you ready to begin?` }
  ]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const transcriptEndRef = useRef(null);

  // Auto-scroll transcript to the bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = handleRecordingStop;
      
      mediaRecorderRef.current.start();
      setStatus('recording');
    } catch (err) {
      console.error("Failed to start recording:", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setStatus('processing');
      // Stop the mic tracks to free up the hardware
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleRecordingStop = async () => {
    // 1. Create the Audio Blob
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    // Optimistically update the UI to show the user spoke (we don't have the text yet)
    setTranscript(prev => [...prev, { speaker: 'User', text: '...' }]);

    // 2. Prepare for Backend Transmission
    const formData = new FormData();
    formData.append('audio', audioBlob, 'user_audio.webm');

    try {
      // NOTE: This is pointing to the Express backend we will build next.
      // For now, it will fail until the server is running, which is expected.
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Backend processing failed");

      // We expect the backend to return the user's transcript, the AI's text, and an Audio Blob
      const data = await response.json();
      
      // Replace the '...' with actual transcribed text and add AI response
      setTranscript(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].text = data.userText; 
        newHistory.push({ speaker: 'AI', text: data.aiText });
        return newHistory;
      });

      // 3. Play the AI's voice response
      if (data.aiAudioBase64) {
        setStatus('speaking');
        const audio = new Audio(`data:audio/wav;base64,${data.aiAudioBase64}`);
        audio.onended = () => setStatus('idle');
        await audio.play();
      } else {
        setStatus('idle');
      }

    } catch (error) {
      console.error("API Error:", error);
      setTranscript(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].text = "[Audio capture successful. Waiting for backend connection...]";
        return newHistory;
      });
      setStatus('idle');
    }
  };

  // UI Helper for the visualizer orb
  const getOrbState = () => {
    switch (status) {
      case 'recording': return { scale: [1, 1.2, 1], shadow: "0px 0px 30px var(--acc-secondary)", borderColor: "var(--acc-secondary)" };
      case 'processing': return { rotate: 360, shadow: "0px 0px 20px var(--acc-tertiary)", borderColor: "var(--acc-tertiary)", borderRadius: ["50%", "30%", "50%"] };
      case 'speaking': return { scale: [1, 1.1, 1], shadow: "0px 0px 40px var(--acc-primary)", borderColor: "var(--acc-primary)" };
      default: return { scale: 1, shadow: "0px 0px 10px var(--bdr-hover)", borderColor: "var(--bdr)" };
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Live Interview</h1>
          <p className="text-sm text-text-muted">Candidate: {name}</p>
        </div>
        <button 
          onClick={() => onComplete({ score: "Pending Backend Integration" })}
          className="px-4 py-2 text-sm font-medium text-error bg-error/10 rounded-lg hover:bg-error/20 transition-colors"
        >
          End Interview
        </button>
      </header>

      {/* Main Arena */}
      <div className="flex-1 flex flex-col md:flex-row gap-8 min-h-0">
        
        {/* Left: The Visualizer & Controls */}
        <div className="flex-1 flex flex-col items-center justify-center bg-background-secondary rounded-2xl border border-border p-8 relative overflow-hidden">
          
          <div className="absolute top-4 left-4 text-xs font-mono uppercase tracking-widest text-text-muted">
            Status: <span className={
              status === 'recording' ? 'text-accent-secondary' : 
              status === 'processing' ? 'text-accent-tertiary' : 
              status === 'speaking' ? 'text-accent-primary' : 'text-text-muted'
            }>{status}</span>
          </div>

          {/* Glowing Orb */}
          <motion.div
            animate={getOrbState()}
            transition={{ 
              duration: status === 'processing' ? 2 : 1.5, 
              repeat: status !== 'idle' ? Infinity : 0,
              ease: "easeInOut"
            }}
            className="w-32 h-32 rounded-full border-4 bg-background-primary flex items-center justify-center mb-12 shadow-lg"
          >
            <svg className={`w-10 h-10 ${status === 'idle' ? 'text-text-muted' : 'text-text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </motion.div>

          {/* Action Button */}
          {status === 'idle' || status === 'speaking' ? (
            <button
              onClick={startRecording}
              className="px-8 py-4 bg-accent-primary hover:bg-accent-hover text-white rounded-full font-bold shadow-lg shadow-accent-primary/20 transition-all flex items-center gap-3"
            >
              <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
              Tap to Speak
            </button>
          ) : status === 'recording' ? (
            <button
              onClick={stopRecording}
              className="px-8 py-4 bg-accent-secondary hover:bg-emerald-400 text-gray-900 rounded-full font-bold shadow-lg shadow-accent-secondary/20 transition-all flex items-center gap-3"
            >
              <div className="w-3 h-3 bg-gray-900" />
              Done Speaking
            </button>
          ) : (
            <button disabled className="px-8 py-4 bg-background-active text-text-muted rounded-full font-bold cursor-not-allowed flex items-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Processing...
            </button>
          )}
        </div>

        {/* Right: Transcript Window */}
        <div className="flex-1 flex flex-col bg-background-secondary rounded-2xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border bg-background-primary/50">
            <h3 className="text-sm font-semibold text-text-secondary">Live Transcript</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {transcript.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.speaker === 'User' ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-xs text-text-muted mb-1 ml-1">{msg.speaker}</span>
                  <div className={`px-4 py-3 rounded-2xl max-w-[85%] ${
                    msg.speaker === 'User' 
                      ? 'bg-accent-primary text-white rounded-tr-sm' 
                      : 'bg-background-active text-text-primary rounded-tl-sm border border-border'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={transcriptEndRef} />
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}