import FollowModel from '../models/FollowModel.js';
import UserModel from '../models/UserModel.js';
import threadModel from '../models/ThreadModel.js';

const loadUserThreadData = async (req, res, next) => {
  try {
    const threads = await threadModel.find({}).populate({
      path: "author",
      model: "Users",
      localField: "author",
      foreignField: "username",
      select: "username avatar",
    });
    req.threads = threads;
    next();
  } catch (error) {
    console.error("Error loadUserThreadData:", error);
    res.status(500).json({ message: "An error occurred while loadUserThreadData" });
  }
};

const renderProfile = (req, res) => {
  console.log("3");
  res.render("profile", {
    threads: req.threads,
    followers: req.followers,
    followings: req.followings,
    followerCount: req.followerCount,
    followingCount: req.followingCount,
  });
};

const redirectToSettings = async (req, res) => {
  res.redirect('/setting/account');
};

const ProfileController = {
  redirectToSettings: redirectToSettings,
  loadUserThreadData: loadUserThreadData,
  renderProfile: renderProfile
};

export default ProfileController;
