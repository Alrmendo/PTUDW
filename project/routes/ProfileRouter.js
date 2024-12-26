import express from 'express';
const router = express.Router();
import ProfileController from '../controllers/ProfileController.js';

import multer from 'multer';

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage }).single('avatar');
// router.get("/", ProfileController.loadUserThreadData, 
//                 ProfileController.renderProfile);

router.get('/', ProfileController.showProfile);

router.post('/updateProfile', upload, ProfileController.updateProfile);
router.post('/unfollow/:followerId', ProfileController.unfollow);
export default router;