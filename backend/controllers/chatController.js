import axios from 'axios';


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
          'Content-Type': req.file.mimetype, 
        },
      }
    );
    
    // Extract text safely
    const userText = sttResponse.data?.results?.channels[0]?.alternatives[0]?.transcript || "";
    if (!userText.trim()) {
      console.log("User was silent.");
      return res.json({
        userText: "[Silence]",
        aiText: "I didn't quite catch that. Could you please repeat what you just said?",
        aiAudioBase64: null,
        isSilence: true 
      });
    }
    console.log(`User: "${userText}"`);

    // ==========================================
    // STEP 2: Groq LLM (Brain) - Ultra Fast
    // ==========================================
    console.log("2. Generating AI response with Groq...");
    
    // Map your React transcript history into Groq's required format
    const messages = [
      { 
        role: "system", 
        content: `You are a warm, professional Cuemath recruiter conducting a short voice interview. Keep your response to a maximum of two short, conversational sentences.
                  What reveals tutoring ability? You must question the candidate inorder to inorder to judge them properly. You may also give them some real world scenario and see how they would approach that.` 
      },
      ...chatHistory.map(msg => ({
        role: msg.speaker === 'AI' ? 'assistant' : 'user',
        content: msg.text
      })),
      { role: "user", content: userText }
    ];

    const llmResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.1-8b-instant", 
        messages: messages,
        temperature: 0.7,
        max_tokens: 150
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const aiText = llmResponse.data.choices[0].message.content;
    console.log(`AI: "${aiText}"`);

    // ==========================================
    // STEP 3: Deepgram TTS (Mouth) using Axios
    // ==========================================
    console.log("3. Synthesizing AI voice...");
    const ttsResponse = await axios.post(
      'https://api.deepgram.com/v1/speak?model=aura-2-helena-en',
      { text: aiText },
      {
        headers: {
          'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
          'Content-Type': 'application/json',
        },
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








export const evaluateInterview = async (req, res) => {
  try {
    const { history } = req.body;
    if (!history || history.length === 0) return res.status(400).json({ error: 'No history' });

    console.log("📊 Starting final evaluation with Groq...");

    const formattedTranscript = history.map(msg => `${msg.speaker}: ${msg.text}`).join('\n');

    const prompt = `
      You are an expert recruiter for Cuemath. You must judge critically. Analyze this transcript:
      ${formattedTranscript}

      Evaluate Clarity, Warmth, Simplicity, Patience, and Fluency out of 5.
      Do not evaluate recuiter/ai. only evaluate the user.
      You MUST output ONLY a valid JSON object using this exact schema:
      {
        "scores": {
          "Clarity": { "score": 0, "feedback": "", "quote": "" },
          "Warmth": { "score": 0, "feedback": "", "quote": "" },
          "Simplicity": { "score": 0, "feedback": "", "quote": "" },
          "Patience": { "score": 0, "feedback": "", "quote": "" },
          "Fluency": { "score": 0, "feedback": "", "quote": "" }
        },
        "overall_recommendation": "Hire | Shortlist | Reject",
        "summary": "One sentence summary."
      }
    `;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }, // Forces valid JSON!
        temperature: 0.1 // Keep it strict for grading
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const evaluationData = JSON.parse(response.data.choices[0].message.content);
    console.log("✅ Evaluation complete.");
    res.json(evaluationData);

  } catch (error) {
    console.error("Evaluation Error:", error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate rubric.' });
  }
};