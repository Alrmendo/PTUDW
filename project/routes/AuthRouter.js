import express from 'express';
const router = express.Router();
import AuthController from '../controllers/AuthController.js';

router.get("/login", AuthController.showLogin);
router.post("/login", AuthController.login);
router.get("/signup",AuthController.showSignup);
router.post("/signup",AuthController.signup);
router.get("/verify-email", AuthController.verifyEmail);
// router.get("/resendEmail", AuthController.resendEmail);
router.get("/signout", AuthController.signout);
export default router;
