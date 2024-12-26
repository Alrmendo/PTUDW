import express from 'express';
const router = express.Router();
import ProfileController from '../controllers/ProfileController.js';

router.get("/", ProfileController.loadUserThreadData)
router.get("/", ProfileController.loadFollowsData)
router.get("/", ProfileController.renderProfile)

export default router;