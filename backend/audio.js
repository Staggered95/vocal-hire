import fs from "fs";
import { DeepgramClient } from "@deepgram/sdk";

// Initialize with your new, safe API key
const apiKey = "";
const client = new DeepgramClient({ apiKey });

// Helper to convert Web Stream to Node Buffer
const getAudioBuffer = async (stream) => {
  const reader = stream.getReader();
  const chunks = [];
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  
  return Buffer.concat(chunks);
};

async function testTTS() {
  console.log("Generating Helena's voice...");
  
  try {
    const response = await client.speak.v1.audio.generate({
      text: `It is completely natural to feel a little nervous, and your enthusiasm for teaching already shines through. We truly value that passion here at Cuemath, so please just relax and be yourself. 

What is it about teaching math to children that you find most rewarding?`,
      model: "aura-2-helena-en",
      encoding: "linear16",
      container: "wav",
    });

    // Safely grab the stream whether it is a method or a property
    const stream = typeof response.stream === "function" ? response.stream() : response.stream;
    
    if (stream) {
      const buffer = await getAudioBuffer(stream);
      fs.writeFileSync("output.wav", buffer);
      console.log("✅ Success! Audio saved to output.wav. Open your folder and play it.");
    } else {
      console.error("Error: Did not receive an audio stream from Deepgram.");
    }

  } catch (error) {
    console.error("Deepgram TTS Error:", error);
  }
}

testTTS();