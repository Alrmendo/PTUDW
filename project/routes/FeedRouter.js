import express from 'express';
const router = express.Router();
import FeedController from '../controllers/FeedController.js';

router.get('/', FeedController.loadAllThread);
router.put('/like/:id', FeedController.likeThread);
router.get('/following', FeedController.loadFollowingThread);
router.post('/comment/:id', FeedController.addComment);
router.get('/:username/post/:id', FeedController.loadThread);
export default router;