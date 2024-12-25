import express from 'express';
const router = express.Router();
import ProfileController from '../controllers/ProfileController.js';

// router.get("/", ProfileController.loadUserThreadData, 
//                 ProfileController.renderProfile);

router.get('/', ProfileController.showProfile);

router.post('/updateProfile', ProfileController.updateProfile);

export default router;