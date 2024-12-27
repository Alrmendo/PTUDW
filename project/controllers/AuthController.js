import UserModel from '../models/UserModel.js';
import NotificationController from './NotificationController.js';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import nodemailer from 'nodemailer';

dotenv.config();

const JWT_SECRET = "22127104_22127247";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hiển thị trang login
const showLogin = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/login.html"));
};

// Hiển thị trang signup
const showSignup = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/signup.html"));
};

const resetPasswordForm = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/ResetPassword.html"));
}

const resetPassword = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/forgotPassword.html"));
}

// Xử lý login
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // const user = await UserModel.findOne({ username: username });
        const user = await UserModel.findOne({
            $or: [{ username: username }, { email: username }]
        });
        if (!user) {
            return res.status(404).json({ message: "Incorrect username or password." });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Account not verified. Please check your email." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({ message: "Incorrect username or password." });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "System error! Please try again later." });
    }
};

const signup = async (req, res) => {
    try {
        const { username, password, email } = req.body;


        // Validate username
        const usernameRegex = /^[a-zA-Z0-9._-]{1,30}$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                message: "Invalid username. Use only letters, numbers, dashes, underscores, or dots, with a maximum length of 30 characters."
            });
        }

        const existingUser = await UserModel.findOne({
            $or: [{ username: username }, { email: email }]
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: "Username already exists." });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email already exists." });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;

        const newUser = new UserModel({
            username,
            password: hashedPassword,
            email,
            verificationToken,
            verificationExpires
        });

        await newUser.save();

        NotificationController.addNotification(newUser._id, "Don't forget to update your profile");

        const verificationLink = `http://localhost:3000/api/verify/${verificationToken}`;
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "underwavecontact@gmail.com",
                pass: "awrj ukks lynl sslx"
            }
        });

        await transporter.sendMail({
            from: "underwavecontact@gmail.com",
            to: email,
            subject: "Confirm your email",
            html: `<p>Hello ${username},</p>
                   <p>Click the link below to verify your email:</p>
                   <a href="${verificationLink}">Verify Email</a>
                   <p>If you did not sign up for an account, please ignore this email.</p>`
        });

        // Send success response
        return res.status(200).json({ message: "Registration successful! Please check your email to verify your account." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "System error! Please try again later.", error: error.message });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await UserModel.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).redirect("http://localhost:3000/login?message=Invalid+token");
        }

        if (Date.now() > user.verificationExpires) {
            // Tạo token mới
            const newVerificationToken = crypto.randomBytes(32).toString("hex");
            const newVerificationExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;

            user.verificationToken = newVerificationToken;
            user.verificationExpires = newVerificationExpires;
            await user.save();

            const verificationLink = `http://localhost:3000/api/verify/${newVerificationToken}`;
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "underwavecontact@gmail.com",
                    pass: "awrj ukks lynl sslx", // Hạn chế lưu mật khẩu trực tiếp trong code, hãy dùng biến môi trường.
                },
            });

            await transporter.sendMail({
                from: "underwavecontact@gmail.com",
                to: user.email,
                subject: "Confirm your email",
                html: `<p>Hello ${user.username},</p>
                       <p>Click the link below to verify your email:</p>
                       <a href="${verificationLink}">Verify Email</a>
                       <p>If you did not sign up for an account, please ignore this email.</p>`,
            });

            return res
                .status(400)
                .redirect("http://localhost:3000/login?message=Verification+token+expired.+Check+your+email+for+a+new+link");
        }

        // Cập nhật trạng thái xác thực
        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        // Chuyển hướng tới trang login
        return res.redirect("http://localhost:3000/login?message=Email+verified+successfully");
    } catch (error) {
        console.error("Error verifying email:", error);
        return res
            .status(500)
            .redirect("http://localhost:3000/login?message=Error+verifying+email.+Please+try+again+later");
    }
};


const ChangePasswordLink = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.status(404).render("forgotPassword", {
                message: "No account with this email found.",
            });
        }

        // Tạo token và thiết lập thời hạn
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;

        user.verificationToken = resetToken;
        user.verificationExpires = resetExpires;
        await user.save();

        // Tạo liên kết đặt lại mật khẩu
        const resetUrl = `http://localhost:3000/reset-password-form?token=${resetToken}`;

        // Gửi email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: 'underwavecontact@gmail.com',
                pass: 'awrj ukks lynl sslx',
            },
        });

        await transporter.sendMail({
            from: "underwavecontact@gmail.com",
            to: user.email,
            subject: "Confirm your email",
            html: `<p>Hello ${user.username},</p>
                   <p>Click the link below to verify your email:</p>
                   <a href="${resetUrl}">Verify Email</a>
                   <p>If you did not sign up for an account, please ignore this email.</p>`,
        });

        res.status(200).json({ success: true, message: "Password reset link has been sent to your email!" });
    } catch (error) {
        console.error("Error during forgotPassword:", error);
        res.status(500).json({ success: false, message: "An error occurred during the process. Please try again later." });
    }
};


const getNewPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const user = await UserModel.findOne({
            verificationToken: token,
            verificationExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.verificationToken = null;
        user.verificationExpires = null;
        await user.save();
        res.status(200).json({ message: "Your password has been successfully reset." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred during the process. Please try again later." });
    }
};


const isLoggedIn = (req, res) => {
    const token = req.cookies.token;
    if (!token)
        res.status(200).json({ isLoggedIn: false });
    else
        res.status(200).json({ isLoggedIn: true });
}

const signout = async (req, res) => {
    res.clearCookie("token");
    return res.redirect("/");
};

const AuthController = {
    showLogin: showLogin,
    showSignup: showSignup,
    resetPassword: resetPassword,
    login: login,
    signup: signup,
    verifyEmail: verifyEmail,
    ChangePasswordLink: ChangePasswordLink,
    getNewPassword: getNewPassword,
    resetPasswordForm: resetPasswordForm,
    isLoggedIn: isLoggedIn,
    signout: signout,
}

export default AuthController;