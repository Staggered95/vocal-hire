import React, { useState } from 'react';

export default function WelcomeScreen({ onStart }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState({ error: false, message: '' });
  const [isCheckingMic, setIsCheckingMic] = useState(false);

  const handleStart = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setStatus({ error: true, message: 'Please enter your name to begin.' });
      return;
    }

    setIsCheckingMic(true);
    setStatus({ error: false, message: 'Requesting microphone access...' });

    try {
      // The crucial "Pro" step: Request mic permission before moving to the interview
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // If we get here, they clicked "Allow". 
      // We immediately stop the stream since the InterviewScreen will handle the actual recording.
      stream.getTracks().forEach(track => track.stop());
      
      // Pass the name up to App.jsx to switch views
      onStart(name.trim());
      
    } catch (err) {
      console.error("Mic access error:", err);
      let errorMessage = 'Microphone access is required.';

      if (!navigator.mediaDevices) {
        errorMessage = 'Security Block: Browser requires HTTPS or strictly "localhost" for mic access.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'Hardware Error: No microphone detected on this device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Hardware Lock: Your mic is currently being used by another app.';
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Permission Error: Browser or OS is blocking access.';
      }

      setStatus({ 
        error: true, 
        message: `${errorMessage} (Code: ${err.name || 'Undefined'})` 
      });
      setIsCheckingMic(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 font-sans text-gray-100">
      
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            Cuemath Tutor Screening
          </h1>
          <p className="text-sm text-gray-400">
            A 5-minute interactive voice assessment to evaluate communication and clarity.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleStart} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isCheckingMic}
              className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-colors disabled:opacity-50"
              placeholder="e.g. Aditi Sharma"
              autoComplete="name"
            />
          </div>

          {/* Status/Error Message */}
          {status.message && (
            <div className={`p-3 rounded-lg text-sm ${status.error ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
              {status.message}
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isCheckingMic}
            className="w-full relative flex items-center justify-center px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
          >
            {isCheckingMic ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
            ) : (
              "Start Interview"
            )}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-gray-500">
          Find a quiet place. Ensure your microphone is working before proceeding.
        </p>

      </div>
    </div>
  );
}