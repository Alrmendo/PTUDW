import UserInfoModel from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";

const showLogin = async(req, res) =>{
    res.render('login', {message: req.message, layout:false});
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
  
      const isMatch = user.password === password;
  
      if (!isMatch) {
        console.log("Incorrect password.");
        req.message = "Incorrect password.";
        return showLogin(req, res);
      }
  
      const token = jwt.sign({ id: user._id }, "22127104_22127247", { expiresIn: "1d" });
      console.log("Generated token:", token);
  
      res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 });
      return res.redirect("/");
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "An error occurred during login." });
    }
  };
  
const AuthController = {
    showLogin: showLogin,
    login: login,
    // signup: signup,
}

export default AuthController;