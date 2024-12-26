import express from 'express';
const router = express.Router();
import AuthController from '../controllers/AuthController.js';

router.get('/login', AuthController.showLogin);
router.post('/api/login', AuthController.login);
router.get('/signup', AuthController.showSignup);
router.get('/resetpassword', AuthController.resetPassword);
router.post('/api/register', AuthController.signup);
router.get('/api/verify/:token', AuthController.verifyEmail);
router.post('/resetpassword', AuthController.requestPasswordReset);
router.post('/api/get-new-password', AuthController.getNewPassword);
router.get('/reset-password-form', AuthController.resetPasswordForm);
router.get('/api/islogin', AuthController.isLoggedIn);
router.get('/signout', AuthController.signout);

export default router;