// src/hooks/useVoiceManager.js
import { useState, useRef, useEffect } from 'react';

export default function useVoiceManager(candidateName) {
  const [status, setStatus] = useState('speaking');
  const [transcriptHistory, setTranscriptHistory] = useState([
    { speaker: 'AI', text: `Hi ${candidateName}, I'm your Cuemath interviewer. Are you ready to begin?` }
  ]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const silenceFrameRef = useRef(null);
  const currentAudioRef = useRef(null);

  // 1. Initial Greeting Effect
  useEffect(() => {
    const introAudio = new Audio('/helena-intro.wav');
    currentAudioRef.current = introAudio;

    introAudio.play().catch(() => setStatus('idle'));

    // introAudio.onended = () => {
    //   if (currentAudioRef.current === introAudio) {
    //     currentAudioRef.current = null;
    //     setStatus('idle');
    //     setTimeout(() => {
    //       if (mediaRecorderRef.current?.state !== 'recording') startRecording();
    //     }, 1000);
    //   }
    // };

    return () => {
      if (introAudio) {
        introAudio.pause();
        introAudio.currentTime = 0;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Start Recording & VAD
  const startRecording = async () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
      setStatus('idle');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false }
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = handleRecordingStop;
      mediaRecorderRef.current.start();
      setStatus('recording');

      // VAD Setup
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 512;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let lastSpokeTime = performance.now();
      const SILENCE_THRESHOLD = 15;
      const MAX_SILENCE_MS = 5000;

      const checkSilence = () => {
        if (mediaRecorderRef.current?.state !== 'recording') return;

        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const averageVolume = sum / bufferLength;

        if (averageVolume > SILENCE_THRESHOLD) {
          lastSpokeTime = performance.now();
        } else {
          if (performance.now() - lastSpokeTime > MAX_SILENCE_MS) {
            console.log("VAD: Silence detected. Auto-stopping recording.");
            stopRecording();
            return;
          }
        }
        silenceFrameRef.current = requestAnimationFrame(checkSilence);
      };

      checkSilence();

    } catch (err) {
      console.error("Mic error:", err);
      alert("Could not access microphone.");
    }
  };

  // 3. Stop & Cancel Actions
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      cancelAnimationFrame(silenceFrameRef.current);
      mediaRecorderRef.current.stop();
      setStatus('processing');
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      cancelAnimationFrame(silenceFrameRef.current);
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setStatus('idle');
    }
  };

  // 4. Handle API Communication
  const handleRecordingStop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    setTranscriptHistory(prev => [...prev, { speaker: 'User', text: '...' }]);

    const formData = new FormData();
    formData.append('audio', audioBlob, 'user_audio.webm');
    formData.append('history', JSON.stringify(transcriptHistory));

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error("Backend failed");

      const data = await response.json();

      setTranscriptHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].text = data.userText;
        newHistory.push({ speaker: 'AI', text: data.aiText });
        return newHistory;
      });

      const playAIResponse = async (audioSource) => {
        setStatus('speaking');
        const audioObj = new Audio(audioSource);
        currentAudioRef.current = audioObj;

        audioObj.onended = () => {
          if (currentAudioRef.current === audioObj) {
            currentAudioRef.current = null;
            setStatus('idle');
            setTimeout(() => {
              if (mediaRecorderRef.current?.state !== 'recording') startRecording();
            }, 1000);
          }
        };

        try {
          await audioObj.play();
        } catch (err) {
          setStatus('idle');
          setTimeout(() => startRecording(), 1000);
        }
      };

      if (data.isSilence) {
        playAIResponse('/helena-silence.wav');
      } else if (data.aiAudioBase64) {
        playAIResponse(`data:audio/wav;base64,${data.aiAudioBase64}`);
      } else {
        setStatus('idle');
        setTimeout(() => startRecording(), 1000);
      }

    } catch (error) {
      setTranscriptHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].text = "Connection error.";
        return newHistory;
      });
      setStatus('idle');
    }
  };

  return {
    status,
    setStatus,
    transcriptHistory,
    startRecording,
    stopRecording,
    cancelRecording
  };
}