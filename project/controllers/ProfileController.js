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

const loadFollowsData = async (req, res, next) => {

  try {
    const followers = [
      { avatar: "/image/avatar_1.0.jpg", username: "user1", fullname: "username_1", status: "follow" },
      { avatar: "/image/avatar_1.0.jpg", username: "user2", fullname: "username_2", status: "following" },
      { avatar: "/image/avatar_1.0.jpg", username: "user1", fullname: "username_1", status: "follow" },
      { avatar: "/image/avatar_1.0.jpg", username: "user2", fullname: "username_2", status: "following" },
      { avatar: "/image/avatar_1.0.jpg", username: "user1", fullname: "username_1", status: "follow" },
      { avatar: "/image/avatar_1.0.jpg", username: "user2", fullname: "username_2", status: "following" },
    ];
    const followings = [
      { avatar: "/image/Obito.jpg", username: "TechSavvy", fullname: "Minh Tú", status: "follow" },
      { avatar: "/image/Obito.jpg", username: "Obito", fullname: "Hà My", status: "follow" },
      { avatar: "/image/avatar_1.0.jpg", username: "user1", fullname: "username_1", status: "follow" },
      { avatar: "/image/avatar_1.0.jpg", username: "user2", fullname: "username_2", status: "following" },
      { avatar: "/image/avatar_1.0.jpg", username: "user1", fullname: "username_1", status: "follow" },
      { avatar: "/image/avatar_1.0.jpg", username: "user2", fullname: "username_2", status: "following" },
    ];
    req.followers = followers;
    req.followings = followings;
    req.followerCount = followers.length;
    req.followingCount = followings.length;
    console.log("2");
    next();
  }
  catch (error) {
    console.error("Error loadFollowsData:", error);
    res.status(500).json({ message: "An error occurred while loadFollowsData" });
  }

};

const renderProfile = (req, res) => {
  console.log("3");
  res.render("Profile", {
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
  loadFollowsData: loadFollowsData,
  redirectToSettings: redirectToSettings,
  loadUserThreadData: loadUserThreadData,
  renderProfile: renderProfile
};

export default ProfileController;
