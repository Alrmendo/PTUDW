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
				{ avatar: "/images/av1", username: "user1", fullname: "user1full", status: "Theo dõi lại" },
				{ avatar: "/images/av1", username: "user2", fullname: "user2full", status: "Đang Theo dõi" },
			];
			const followings = [
				{ avatar: "/images/av1", username: "user1", fullname: "user1full", status: "Theo dõi lại" },
				{ avatar: "/images/av1", username: "user2", fullname: "user2full", status: "Đang Theo dõi" },
			];
			req.followers = followers; 
			req.followings = followings; 
			req.followerCount = followers.length;
			req.followingCount = followings.length;
			next();
    }
		catch(error) {
			console.error("Error loadFollowsData:", error);
      res.status(500).json({ message: "An error occurred while loadFollowsData" });
		}

  };

  const renderProfile = (req, res) => {
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

const loadUserProfile = async(req, res) => {

};


const ProfileController = {
    loadFollowsData: loadFollowsData,
    redirectToSettings: redirectToSettings,
    loadUserThreadData: loadUserThreadData,
    renderProfile: renderProfile
};

export default ProfileController;
