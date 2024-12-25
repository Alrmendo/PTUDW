import express from 'express';
const router = express.Router();
import ProfileController from '../controllers/ProfileController.js';

router.get("/", ProfileController.loadUserThreadData, 
                ProfileController.renderProfile);

router.get('/configProfile', ProfileController.redirectToSettings);

export default router;