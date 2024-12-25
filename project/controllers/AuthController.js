import UserInfoModel from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
const showLogin = async(req, res) =>{
    res.render('login', {message: req.message, layout:false});
}

const showSignup = async(req, res) =>{
  res.render('signup', {message: req.message, success:req.success, layout:false});
}

const showforgotPassword = async(req, res) =>{
  res.render('forgotPassword', {message: req.message, layout:false});
}

const showresetPassword = async(req, res) =>{
  const { token } = req.query;
  res.render('resetPassword', {token, message: req.message, layout: false});
}
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Username:", username);
    const user = await UserInfoModel.findOne({ username });

    if (!user) {
      console.log("User not found.");
      req.message = "User not found.";
      return showLogin(req, res);
    }

    if (!user.isVerified) {
      console.log("Account not verified.");
      req.message = "Account has not been verified. Please verify the account.";
      return showLogin(req, res);
    }

    // const isMatch = user.password === password;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Incorrect password.");
      req.message = "Incorrect password.";
      return showLogin(req, res);
    }

    const token = jwt.sign({ id: user._id }, "22127104_22127247", { expiresIn: "1d" });
    // res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 });

    // console.log("Generated token:", token);
    //const token = jwt.sign({ id: user._id }, "22127104_22127247");
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Strict" });

    return res.redirect("/");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
};

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(username);
    const userExists = await UserInfoModel.findOne({$or: [{ username: username }, { email: email }] });
    if (userExists) {
      if (userExists.username === username) 
      {
        req.message = "Username already exists";
        return showSignup(req, res);
        // return res.render("signup", { message: "Username already exists" });      
      }
      if (userExists.email === email) 
      {
        req.message = "Email already exists.";
        return showSignup(req, res);
        //return res.render("signup", { message: "Email already exists." });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await UserInfoModel.create({ username, email, password: hashedPassword, verificationToken});

    // Send verification email
    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: 'underwavecontact@gmail.com',
        pass: 'awrj ukks lynl sslx'
      },
    });
    await transporter.sendMail({
      from: 'underwavecontact@gmail.com',
      to: user.email,
      subject: "Verify Your Email",
      html: `<p>Click the link below to verify your email:</p>
             <a href="${verificationLink}">Verify Email</a>
             <p>Ignore this email if you did not sign up account on Threads</p>`,
    });

    // Display success message
    req.message = "Signup successful! Please verify your email.";
    req.success = "success"
    return showSignup(req, res);
    // return res.render("signup", { message: "Signup successful! Please verify your email.", layout: false });

  } catch (error) {

      res.status(500).json({ message: "Error signing up the user", error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await UserInfoModel.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).render("signup", { message: "Invalid or expired token.", layout: false });
    }

    user.isVerified = true;
    user.verificationToken = null; // Clear the token after verification
    await user.save();

    return res.render("login", { message: "Email verified successfully. You can now log in.", layout: false });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).render("login", { message: "Error verifying email. Please try again later.", layout: false });
  }
};

// const resendEmail = async (req, res) => {
//   try {
//     const { email } = req.query;
//     const user = await UserInfoModel.findOne({ email });

//     if (!user) {
//       return res.status(404).render("signup", { 
//         message: "User not found.", 
//         layout: false 
//       });
//     }

//     if (user.isVerified) {
//       return res.render("login", { 
//         message: "Email already verified. Please log in.", 
//         layout: false 
//       });
//     }

//     const verificationToken = user.verificationToken || crypto.randomBytes(32).toString("hex");
//     user.verificationToken = verificationToken;
//     await user.save();

//     const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: 'underwavecontact@gmail.com',
//         pass: 'awrj ukks lynl sslx'
//       },
//     });
//     await transporter.sendMail({
//       from: 'underwavecontact@gmail.com',
//       to: user.email,
//       subject: "Verify Your Email",
//       html: `<p>Click the link below to verify your email:</p>
//              <a href="${verificationLink}">Verify Email</a>
//              <p>Ignore this email if you did not sign up account on Threads</p>`,
//     });

//     return res.render("signup", { 
//       message: "Verification email resent successfully.", 
//       showSuccess: true, 
//       layout: false 
//     });
//   } catch (error) {
//     console.error("Error resending verification email:", error);
//     res.status(500).render("signup", { 
//       message: "Error resending verification email. Please try again later.", 
//       layout: false 
//     });
//   }
// };

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserInfoModel.findOne({ email });
    if (!user) {
      req.message = "No account with this email found.";
      return res.render("forgotPassword", { message: req.message, layout: false });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = Date.now() + 300000;
    user.verificationToken = verificationToken;
    user.verificationExpires = verificationExpires;
    await user.save();

    const resetLink = `http://localhost:3000/resetPassword?token=${verificationToken}`;
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
      subject: "Password Reset",
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetLink}">Reset Password</a>
             <p>If you did not request this, please ignore this email.</p>`,
    });

    req.message = "Password reset link sent to your email.";
    return res.render("forgotPassword", { message: req.message, layout: false });
  } catch (error) {
    console.error("Error during forgotPassword:", error);
    res.status(500).json({ message: "An error occurred during the process." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log("Received token:", token);
    console.log("Received newPassword:", newPassword);    
    const user = await UserInfoModel.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      req.message = "Invalid or expired token.";
      return res.render("resetPassword", { message: req.message, layout: false });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.verificationToken = null;
    // user.resetPasswordExpires = null;
    await user.save();

    req.message = "Password reset successfully.";
    return showLogin(req, res);
  } catch (error) {
    console.error("Error during resetPassword:", error);
    res.status(500).json({ message: "An error occurred during the process." });
  }
};

// const updatePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     const user = await UserInfoModel.findById(req.user.id); // Assuming `req.user` contains the logged-in user's ID
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

const signout = async(req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
};
const AuthController = {
    showLogin: showLogin,
    login: login,
    showSignup: showSignup,
    signup: signup,
    verifyEmail: verifyEmail,
    // resendEmail: resendEmail,
    showforgotPassword: showforgotPassword,
    forgotPassword: forgotPassword,
    showresetPassword: showresetPassword,
    resetPassword: resetPassword,
    signout: signout,
}

export default AuthController;