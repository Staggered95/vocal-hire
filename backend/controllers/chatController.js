import axios from 'axios';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const processChat = async (req, res) => {
  try {
    // 1. Verify Audio Exists
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const audioBuffer = req.file.buffer;
    const chatHistory = req.body.history ? JSON.parse(req.body.history) : [];
    const formattedHistory = chatHistory.map(msg => `${msg.speaker}: ${msg.text}`).join('\n');

    // ==========================================
    // STEP 1: Deepgram STT (Ears) using Axios
    // ==========================================
    console.log("1. Transcribing user audio...");
    const sttResponse = await axios.post(
      'https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true',
      audioBuffer,
      {
        headers: {
          'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
          'Content-Type': req.file.mimetype, // Typically 'audio/webm' from React
        },
      }
    );
    
    // Extract text safely
    const userText = sttResponse.data?.results?.channels[0]?.alternatives[0]?.transcript || "";
    if (!userText.trim()) throw new Error("Could not hear anything in the audio.");
    console.log(`User: "${userText}"`);

    // ==========================================
    // STEP 2: Gemini LLM (Brain)
    // ==========================================
    console.log("2. Generating AI response with context...");
    const prompt = `
      You are a warm, professional Cuemath recruiter conducting a short voice interview.
      Keep your response to a maximum of two short, conversational sentences.
      
      Here is the transcript of the interview so far:
      ${formattedHistory}

      Candidate just said: "${userText}"
      
      Respond directly to the candidate as the AI interviewer.
    `;

    const llmResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const aiText = llmResponse.text;
    console.log(`AI: "${aiText}"`);

    // ==========================================
    // STEP 3: Deepgram TTS (Mouth) using Axios
    // ==========================================
    console.log("3. Synthesizing AI voice...");
    const ttsResponse = await axios.post(
      'https://api.deepgram.com/v1/speak?model=aura-2-thalia-en',
      { text: aiText },
      {
        headers: {
          'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
          'Content-Type': 'application/json',
        },
        // CRITICAL: Tells Axios to not mess with the binary audio data
        responseType: 'arraybuffer', 
      }
    );

    // Convert the raw audio buffer into a Base64 string so we can send it safely inside JSON
    const audioBase64 = Buffer.from(ttsResponse.data).toString('base64');

    // ==========================================
    // STEP 4: Send JSON back to React
    // ==========================================
    res.json({
      userText: userText,
      aiText: aiText,
      aiAudioBase64: audioBase64
    });

    console.log("✅ Pipeline complete. Data sent to frontend.");

  } catch (error) {
    console.error("Chat Controller Error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to process audio pipeline.',
      details: error.message 
    });
  }
};





// --- THE FIX: Exponential Backoff Helper ---
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateWithRetry(prompt, isJson = false, maxRetries = 4) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const config = isJson ? { responseMimeType: "application/json" } : {};
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: config
      });
      return response;
    } catch (error) {
      attempt++;
      // Check if it's a 503 (Unavailable) or 429 (Rate Limit)
      if (error.status === 503 || error.status === 429) {
        if (attempt >= maxRetries) throw error; // Give up if we hit the limit
        
        const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`⚠️ Gemini busy (503). Retrying in ${waitTime/1000}s... (Attempt ${attempt}/${maxRetries})`);
        await delay(waitTime);
      } else {
        throw error; // If it's a different error (like a bad API key), crash immediately
      }
    }
  }
}

// ... [Keep your existing processChat function here, but you can swap its Gemini call to use generateWithRetry(prompt, false) if you want!] ...

export const evaluateInterview = async (req, res) => {
  try {
    const { history } = req.body;

    if (!history || !Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: 'No interview history provided.' });
    }

    console.log("📊 Starting final evaluation...");

    const formattedTranscript = history
      .map(msg => `${msg.speaker}: ${msg.text}`)
      .join('\n');

    const prompt = `
      You are an expert recruiter and communication evaluator for Cuemath.
      Analyze the following transcript of a voice interview with a tutor candidate.
      
      Transcript:
      ${formattedTranscript}

      Evaluate the candidate (the "User") based on these 5 soft skills: 
      Clarity, Warmth, Simplicity, Patience, and Fluency.
      
      For each skill:
      1. Give a score from 1 to 5.
      2. Write one short sentence of feedback.
      3. Provide a direct quote from the User in the transcript that justifies your score. If they didn't speak enough to judge, quote their shortest response and score accordingly.

      You must return ONLY a valid JSON object using this exact schema:
      {
        "scores": {
          "Clarity": { "score": 0, "feedback": "", "quote": "" },
          "Warmth": { "score": 0, "feedback": "", "quote": "" },
          "Simplicity": { "score": 0, "feedback": "", "quote": "" },
          "Patience": { "score": 0, "feedback": "", "quote": "" },
          "Fluency": { "score": 0, "feedback": "", "quote": "" }
        },
        "overall_recommendation": "Hire | Shortlist | Reject",
        "summary": "One sentence summary of their performance."
      }
    `;

    // Use our new robust retry function instead of calling Gemini directly
    const llmResponse = await generateWithRetry(prompt, true);

    const evaluationData = JSON.parse(llmResponse.text);
    
    console.log("✅ Evaluation complete.");
    res.json(evaluationData);

  } catch (error) {
    console.error("Evaluation Error:", error.message || error);
    res.status(500).json({ error: 'Failed to generate evaluation rubric after multiple retries.' });
  }
};