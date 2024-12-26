import express from 'express';
const router = express.Router();
import ProfileController from '../controllers/ProfileController.js';

router.get("/", ProfileController.loadUserThreadData);
// router.get("/", ProfileController.loadFollowsData)
router.get("/", ProfileController.renderProfile);
router.post("/updateProfile", ProfileController.updateProfile);
router.post('/unfollow/:username', ProfileController.unfollow);
router.post('/follow/:username', ProfileController.follow);

export default router;