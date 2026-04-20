import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
// Defaulting to 5001 to match our Docker setup
const PORT = process.env.PORT || 5001; 

// Middleware
app.use(cors({
  origin: [
    'https://vocal-hire-beta.vercel.app', // Your live production frontend
    'http://localhost:5173'               // Keep local dev working just in case!
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

// The root route so you don't get 'Cannot GET /' when checking the URL!
app.get('/', (req, res) => res.send('🎙️ VocalHire API is live and secured!'));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Loaded API Keys: Deepgram (${!!process.env.DEEPGRAM_API_KEY}), Groq (${!!process.env.GROQ_API_KEY})`);
});