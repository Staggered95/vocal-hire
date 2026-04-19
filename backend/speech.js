import { DeepgramClient } from "@deepgram/sdk";

// Initialize Deepgram with your new key
const apiKey = "d158b9173d18a409e4f745e6feeffc7e13225fa9";
// The new SDK takes an object for configuration
const client = new DeepgramClient({ apiKey }); 

async function testDeepgram() {
  console.log("Connecting to Deepgram...");
  
  // Public test audio URL
  const audioUrl = "https://dpgr.am/spacewalk.wav";

  try {
    // Using the new listen.v1.media syntax
    const response = await client.listen.v1.media.transcribeUrl(
      { url: audioUrl },
      { model: "nova-3", smart_format: true }
    );

    // Navigate the JSON response to grab the text
    const transcript = response.results.channels[0].alternatives[0].transcript;
    
    console.log("\n✅ Success! Here is the transcript:");
    console.log(`"${transcript}"\n`);

  } catch (error) {
    console.error("Deepgram Error:", error);
  }
}

testDeepgram();