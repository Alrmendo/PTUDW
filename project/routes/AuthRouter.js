import express from 'express';
const router = express.Router();
import AuthController from '../controllers/AuthController.js';

router.get("/login", AuthController.showLogin);
router.post("/login", AuthController.login);
export default router;
