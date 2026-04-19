import React, { useState, useRef } from 'react';
import LiquidVisualizer from '../components/LiquidVisualizer';
import LiveCaption from '../components/LiveCaptions';

export default function Interview({ name, onComplete }) {
  const [status, setStatus] = useState('idle'); 
  const [transcriptHistory, setTranscriptHistory] = useState([
    { speaker: 'AI', text: `Hi ${name}, I'm your Cuemath interviewer. Are you ready to begin?` }
  ]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Get only the most recent message for the rolling text UI
  const currentMessage = transcriptHistory[transcriptHistory.length - 1];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = handleRecordingStop;
      mediaRecorderRef.current.start();
      setStatus('recording');
    } catch (err) {
      console.error("Mic error:", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setStatus('processing');
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  const handleRecordingStop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    // Update UI optimistically
    setTranscriptHistory(prev => [...prev, { speaker: 'User', text: 'Listening...' }]);

    const formData = new FormData();
    formData.append('audio', audioBlob, 'user_audio.webm');

    try {
      // Backend integration placeholder
      const response = await fetch('http://localhost:5000/api/chat', { method: 'POST', body: formData });
      if (!response.ok) throw new Error("Backend failed");

      const data = await response.json();
      
      setTranscriptHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].text = data.userText; 
        newHistory.push({ speaker: 'AI', text: data.aiText });
        return newHistory;
      });

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
      setTranscriptHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].text = "[Backend not connected yet. Waiting for Node.js...]";
        return newHistory;
      });
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8">
      
      {/* Top Header */}
      <header className="w-full max-w-3xl flex justify-between items-center text-sm">
        <div className="text-text-muted font-mono tracking-widest uppercase">
          Status <span className="text-accent-primary ml-2">{status}</span>
        </div>
        <button 
          onClick={() => onComplete({ score: "Pending" })}
          className="text-text-muted hover:text-error transition-colors"
        >
          End Interview
        </button>
      </header>

      {/* Center Stage: The Liquid Blob and Rolling Captions */}
      <main className="flex-1 flex flex-col items-center justify-center w-full gap-12 mt-12">
        <LiquidVisualizer status={status} />
        <LiveCaption currentMessage={currentMessage} />
      </main>

      {/* Bottom Controls */}
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
          <button
            onClick={stopRecording}
            className="w-full py-4 bg-accent-secondary text-gray-900 rounded-full font-bold shadow-[0_0_20px_var(--acc-secondary)] transition-all flex items-center justify-center gap-3"
          >
            <div className="w-3 h-3 bg-gray-900 rounded-sm" />
            Done Speaking
          </button>
        ) : (
          <button disabled className="w-full py-4 bg-background-active text-text-muted rounded-full font-bold cursor-not-allowed flex items-center justify-center gap-3">
            Processing...
          </button>
        )}
      </footer>

    </div>
  );
}