import FollowModel from '../models/FollowModel.js';
import UserModel from '../models/UserModel.js';
import threadModel from '../models/ThreadModel.js';
import jwt from "jsonwebtoken";
import multer from 'multer';
import mongoose from 'mongoose';
const upload = multer({ dest: 'temp/' });
import database from '../database/db.js';

const loadUserThreadData = async (req, res, next) => {
    try {
      const token = req.cookies.token;
      // console.log("token");
      // console.log(token);
      if (!token) {
        res.redirect("/login");
        return;
      }
      
      const decode = jwt.verify(token, "22127104_22127247");
      const userId = decode.userId;
      const user = await UserModel.findById(userId);
      const threads = await threadModel.find({authorId: userId}).populate({
        path: "author", 
        model: "Users",
        localField: "author",
        foreignField: "username",
        select: "username avatar",
      });
      console.log(threads);
      const followData = await FollowModel.findOne({ userId: user._id }).lean();
      const followers = followData?.followers || [];
      const followings = followData?.followings || [];
      req.followers = followers;
      req.followings = followings;
      req.threads = threads;
      req.user = user;
      req.isLogin = true;
      next(); 
    } catch (error) {
      console.error("Error loadUserThreadData:", error);
      res.status(500).json({ message: "An error occurred while loadUserThreadData" });
    }
  };
const renderProfile = async (req, res) => {
  try {
    console.log(req.user.username); // Access user from req.user
    res.render("Profile", {
      user: req.user, // Pass req.user to the view
      isLogin: req.isLogin, // Ensure isLogin is also passed
      threads: req.threads,
      followers: req.followers,
      followings: req.followings,
      // followerCount: req.followerCount,
      // followingCount: req.followingCount,
    });
  } catch (error) {
    console.error("Error fetching thread:", error);
    res.status(500).json({ message: "An error occurred while loading the thread" });
  }
};
const updateProfile = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
      return res.redirect("/login");
  }
  try{
    const decode = jwt.verify(token, "22127104_22127247");
    const userId = decode.userId;
    const user = await UserModel.findById(userId);

  
    upload.single('file')(req, res, async (err) => {
      if (err) return res.status(400).json({ error: "File upload error" });
      const { username, quote } = req.body;    
      const existingUser = await UserModel.findOne({ username: username});
      console.log(existingUser._id);
      // console.log(userId);
      if (existingUser && existingUser._id.toString() !== userId) 
      {
        return res.status(500).json({ message: "username already exist" });
      }
      let imageUrl = "";
  
      if (req.file) {
        try {
          const result = await database.cloudinary.uploader.upload(req.file.path, {
            transformation: [
              { width: 50, height: 50, crop: "fill" } // Resize to 150x150 pixels
            ]
          });
          // const result = await database.cloudinary.uploader.upload(req.file.path);
          imageUrl = result.secure_url;
        } catch (uploadErr) {
          console.error("Cloudinary upload error:", uploadErr);
          return res.status(500).json({ error: "Failed to upload image" });
        }
        user.avatar = imageUrl;

      }
      user.username = username;
      user.quote = quote;
  
      try {
        await user.save();
        res.status(201).json({ message: "Update successfully" });
      } catch (saveErr) {
        console.error("Error update:", saveErr);
        res.status(500).json({ error: "Failed to update" });
      }
    });
  }
   catch (error) {
      console.error(error);
      res.status(500).send("Can't update user!");
  }
};
  
// Example using Express.js
const follow = async (req, res) => {
  const { username } = req.params;
  const token = req.cookies.token;
  console.log("token");
  console.log(token);
  if (!token) {
    res.redirect("/login");
    return;
  }
  
  const decode = jwt.verify(token, "22127104_22127247");
  const currentUserId = decode.userId;
  try {
    // Find the current user's follow data
    let currentUserFollowData = await FollowModel.findOne({ userId: currentUserId });
    if (!currentUserFollowData) {

      currentUserFollowData = new FollowModel({ userId: currentUserId, followings: [], followers: [] });
      console.log("khong tim thay current user");
    }
    // console.log(currentUserFollowData);
    else console.log("tim thay current user");

    // Find the target user's follow data
    let targetUser = await UserModel.findOne({username});
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "Target user not found" });
    }
    const targetUserId = targetUser._id.toString();
    console.log("targetUserId");
    console.log(targetUserId);


    let targetUserFollowData = await FollowModel.findOne({userId: targetUserId });
    if (!targetUserFollowData) {
      targetUserFollowData = new FollowModel({ userId: targetUserId, followings: [], followers: [] });
      console.log("khong tim thay target user");
    }
    else console.log("tim thay target user");


    // console.log(currentUserFollowData);
    // console.log(targetUserId);
    // console.log(targetUser.username);
    // console.log(targetUser.avatar);

    currentUserFollowData.followings.push({
      userId: targetUserId,
      username: targetUser.username,
      avatar: targetUser.avatar,
    });

    // Add current user to target user's followers
    const currentUser = await UserModel.findById(currentUserId);
    
    // console.log(targetUserFollowData);
    // console.log(currentUserId);
    // console.log(currentUser.username);
    // console.log(currentUser.avatar);

    targetUserFollowData.followers.push({
      userId: currentUserId,
      username: currentUser.username, // Assuming you have the username in the req.user
      avatar: currentUser.avatar, // Assuming you have the avatar in the req.user
    });

    await currentUserFollowData.save();
    await targetUserFollowData.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ success: false, message: "An error occurred while following the user" });
  }
};
const unfollow = async (req, res) => {
  const { username } = req.params;
  const token = req.cookies.token;
  console.log("token");
  console.log(token);
  if (!token) {
    res.redirect("/login");
    return;
  }
  
  const decode = jwt.verify(token, "22127104_22127247");
  const currentUserId = decode.userId;
  try {
    // Find the current user's follow data

    let currentUserFollowData = await FollowModel.findOne({ userId: currentUserId });
    if (!currentUserFollowData) {
      currentUserFollowData = new FollowModel({ userId: currentUserId, followings: [], followers: [] });
      console.log("khong  tim thay current user");
    }
    else console.log("tim thay current user");


    // console.log(currentUserFollowData);

    // Find the target user's follow data
    const targetUser = await UserModel.findOne({username});
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "Target user not found" });
    }
    const targetUserId = targetUser._id.toString();
    // console.log("targetUserId");
    // console.log(targetUserId);
    let targetUserFollowData = await FollowModel.findOne({userId: targetUserId });
    if (!targetUserFollowData) {
      console.log("khong tim thay target user");
      targetUserFollowData = new FollowModel({ userId: targetUserId, followings: [], followers: [] });
    }
    else console.log("tim thay target user");

    console.log(targetUserFollowData);
    currentUserFollowData.followings = currentUserFollowData.followings.filter(
      (user) => user.userId.toString() !== targetUserId
    );

    // Add current user to target user's followers
    const currentUser = await UserModel.findById(currentUserId);
    console.log(currentUser);
    console.log(currentUserId)
    console.log(targetUserFollowData);
    targetUserFollowData.followers = targetUserFollowData.followers.filter(
      (user) => user.userId.toString() !== currentUserId
    );

    await currentUserFollowData.save();
    await targetUserFollowData.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ success: false, message: "An error occurred while following the user" });
  }
};


const ProfileController = {
    // loadFollowsData: loadFollowsData,
    updateProfile: updateProfile,
    loadUserThreadData: loadUserThreadData,
    renderProfile: renderProfile,
    follow: follow,
    unfollow: unfollow,
};

export default ProfileController;
