import express from 'express';
import multer from 'multer';
import { processChat } from '../controllers/chatController.js';

const router = express.Router();

// Configure Multer to hold the audio file in memory (RAM) instead of writing to disk
const upload = multer({ storage: multer.memoryStorage() });

// The route expects a 'multipart/form-data' payload with a field named 'audio'
router.post('/', upload.single('audio'), processChat);

export default router;