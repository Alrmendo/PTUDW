import express from 'express';
const router = express.Router();
import AuthController from '../controllers/AuthController.js';

router.get('/login', AuthController.showLogin);
router.post('/api/login', AuthController.login);
router.get('/signup', AuthController.showSignup);
router.get('/resetpassword', AuthController.showForgotPassword);
router.post('/api/register', AuthController.signup);
router.get('/api/verify/:token', AuthController.verifyEmail);
router.post('/resetpassword', AuthController.forgotPassword);
router.get('/api/reset-password/:token', AuthController.resetPassword);
router.get('/api/islogin', AuthController.isLoggedIn);
export default router;