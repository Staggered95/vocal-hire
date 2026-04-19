import express from 'express';
import multer from 'multer';
import { processChat, evaluateInterview } from '../controllers/chatController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Existing voice pipeline
router.post('/', upload.single('audio'), processChat);

// NEW: The Evaluation Endpoint
router.post('/evaluate', express.json(), evaluateInterview);

export default router;