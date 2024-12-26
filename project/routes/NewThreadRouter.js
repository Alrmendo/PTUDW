import express from 'express';
import NewThreadController from '../controllers/NewThreadController.js';

const router = express.Router();

router.get("/", NewThreadController.newThread);
router.post("/upload", NewThreadController.uploadThread);

export default router;