import express from 'express';
import multer from 'multer';
import { processChat, evaluateInterview } from '../controllers/chatController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('audio'), processChat);

router.post('/evaluate', express.json(), evaluateInterview);

export default router;