import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes.js';

// Tell dotenv to look ONE folder up (in the root directory)
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Loaded API Keys: Deepgram (${!!process.env.DEEPGRAM_API_KEY}), Gemini (${!!process.env.GEMINI_API_KEY})`);
});