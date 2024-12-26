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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const showLogin = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/login.html"));
};

const showSignup = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/signup.html"));
};

const showForgotPassword = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/forgotPassword.html"));
};

const login = async (req, res) => {

    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username: username  });

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

        const token = jwt.sign({ userId: user._id }, "22127104_22127247", {expiresIn: "1d",});

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "Strict",
            maxAge: 60 * 60 * 1000,
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

        // Validate password length
        // if (password.length < 6 || password.length > 20) {
        //     return res.status(400).json({ message: "Password must be between 6 and 20 characters." });
        // }

        const usernameRegex = /^[a-zA-Z0-9._-]{1,30}$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({ 
                message: "Invalid username. Use only letters, numbers, dashes, underscores, or dots, with a maximum length of 30 characters." 
            });
        }

        const existingUser = await UserModel.findOne({$or: [{ username: username }, { email: email }]});

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
        const verificationExpires = Date.now() + 500000;

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
            return res.status(400).render("signup", { 
                message: "Invalid or expired token.", 
                layout: false 
            });
        }

        // Kiểm tra token có hết hạn không
        if (Date.now() > user.verificationExpires) {
            return res.status(400).render("signup", {
                message: "The verification token has expired. Please request a new verification email.",
                layout: false
            });
        }

        // Đánh dấu email đã xác thực
        user.isVerified = true;
        user.verificationToken = null; // Xóa token sau khi xác thực
        await user.save();

        return res.render("login", { 
            message: "Email verified successfully. You can now log in.", 
            layout: false 
        });
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).render("login", { 
            message: "Error verifying email. Please try again later.", 
            layout: false 
        });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).render("forgotPassword", { 
                message: "No account with this email found.", 
                layout: false 
            });
        }

        // Tạo token và thiết lập thời hạn
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetExpires = Date.now() + 3600000; // 1 giờ

        user.verificationToken = resetToken;
        user.verificationExpires = resetExpires;
        await user.save();

        // Tạo liên kết đặt lại mật khẩu
        const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;
        
        // Gửi email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: 'underwavecontact@gmail.com',
                pass: 'awrj ukks lynl sslx',
            },
        });

        await transporter.sendMail({
            from: 'underwavecontact@gmail.com',
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>Hello ${user.username},</p>
                   <p>Click the link below to reset your password:</p>
                   <a href="${resetUrl}">Reset Password</a>
                   <p>This link will expire in 1 hour.</p>
                   <p>If you did not request this, please ignore this email.</p>`,
        });

        return res.render("forgotPassword", { 
            message: "Password reset link has been sent to your email.", 
            layout: false 
        });
    } catch (error) {
        console.error("Error during forgotPassword:", error);
        res.status(500).render("forgotPassword", { 
            message: "An error occurred during the process. Please try again later.", 
            layout: false 
        });
    }
};

// const updatePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     const user = await UserModel.findById(req.user.id); // Assuming `req.user` contains the logged-in user's ID
//     if (!user) {
//       req.message = "User not found.";
//       return res.render("profile", { message: req.message, layout: false });
//     }

//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//       req.message = "Current password is incorrect.";
//       return res.render("profile", { message: req.message, layout: false });
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();

//     req.message = "Password updated successfully.";
//     return res.render("profile", { message: req.message, layout: false });
//   } catch (error) {
//     console.error("Error during updatePassword:", error);
//     res.status(500).json({ message: "An error occurred during the process." });
//   }
// };


const resetPassword = async (req, res) => {
    try {
        const { token } = req.params; // Lấy token từ params
        const { newPassword } = req.body; // Lấy mật khẩu mới từ body

        console.log("Received token:", token);
        console.log("Received newPassword:", newPassword);

        // Tìm user có token hợp lệ và còn hiệu lực
        const user = await UserModel.findOne({
            verificationToken: token,
            verificationExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).render("resetPassword", { 
                message: "Invalid or expired token.", 
                layout: false 
            });
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật thông tin người dùng
        user.password = hashedPassword;
        user.verificationToken = null; // Xóa token sau khi sử dụng
        user.verificationExpires = null; // Xóa thời hạn của token
        await user.save();

        return res.render("login", { 
            message: "Password reset successfully. You can now log in.", 
            layout: false 
        });
    } catch (error) {
        console.error("Error during resetPassword:", error);
        res.status(500).render("resetPassword", { 
            message: "An error occurred during the process. Please try again later.", 
            layout: false 
        });
    }
};


const isLoggedIn = (req, res) => {
    const token = req.cookies.token;
    if (!token)
        res.status(200).json({ isLoggedIn: false });
    else 
        res.status(200).json({ isLoggedIn: true });
}

const signout = async(req, res) => {
    res.clearCookie("token");
    return res.redirect("/");
  };
const AuthenticationController = {
    showLogin: showLogin,
    showSignup: showSignup,
    showForgotPassword: showForgotPassword,
    login: login,
    signup: signup,
    verifyEmail: verifyEmail,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    isLoggedIn: isLoggedIn,
    signout: signout,

}

export default AuthenticationController;