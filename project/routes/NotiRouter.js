import express from 'express';
const router = express.Router();
import NotificationController from '../controllers/NotiController.js';

router.get("/", NotificationController.loadNotifications);

export default router;