import express from 'express';
const router = express.Router();
import NewThreadController from '../controllers/ThreadController.js';

router.get("/", NewThreadController.newThread);
router.post("/upload", NewThreadController.uploadThread);

export default router;