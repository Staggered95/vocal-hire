import { GoogleGenAI } from "@google/genai";

// Initialize with your API key
const apiKey = "AIzaSyBddxherLUDfg9n33sYO52RJLqfvXTp-kE";
const ai = new GoogleGenAI({ apiKey: apiKey });

async function testGemini() {
  console.log("Waking up the Cuemath AI Recruiter...");

  try {
    // We are testing the exact persona you will need for the app
    const prompt = `
      You are a warm, professional, and patient recruiter for Cuemath. 
      You are conducting a short voice interview with a tutor candidate to assess their soft skills.
      
      The candidate just said: "Hi, I'm a bit nervous, but I really love teaching math to kids."
      
      Respond directly to the candidate in exactly two short, encouraging sentences. Ask one follow-up question.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: prompt,
    });

    console.log("\n✅ Success! Gemini says:");
    console.log(`"${response.text}"\n`);
    
  } catch (error) {
    console.error("Gemini API Error:", error);
  }
}

testGemini();