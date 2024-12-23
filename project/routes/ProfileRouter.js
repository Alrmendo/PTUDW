import express from 'express';
const router = express.Router();
import ProfileController from '../controllers/ProfileController.js';

router.get("/", ProfileController.loadProfile);

export default router;