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
    console.log("2. Generating AI response...");
    const prompt = `
      You are a warm, professional Cuemath recruiter conducting a short voice interview.
      Keep your response to a maximum of two short, conversational sentences.
      
      Candidate says: "${userText}"
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