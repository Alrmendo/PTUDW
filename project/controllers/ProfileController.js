import FollowModel from '../models/FollowModel.js';
import UserModel from '../models/UserModel.js';
import threadModel from '../models/ThreadModel.js';
import UserFollowModel from '../models/FollowModel.js';
import jwt from "jsonwebtoken";
import multer from "multer";

// const loadUserThreadData = async (req, res, next) => {
//   try {
//     const threads = await threadModel.find({}).populate({
//       path: "author",
//       model: "Users",
//       localField: "author",
//       foreignField: "username",
//       select: "username avatar",
//     });
//     req.threads = threads;
//     next();
//   } catch (error) {
//     console.error("Error loadUserThreadData:", error);
//     res.status(500).json({ message: "An error occurred while loadUserThreadData" });
//   }
// };

// const renderProfile = (req, res) => {
//   console.log("3");
//   res.render("profile", {
//     threads: req.threads,
//     followers: req.followers,
//     followings: req.followings,
//     followerCount: req.followerCount,
//     followingCount: req.followingCount,
//   });
// };



const showProfile = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/login");
    return;
  }
  
  const decode = jwt.verify(token, "22127104_22127247");
  
  try {
    const user_Id = decode.id;
    const user = await UserModel.findById(user_Id);
    const isLogin = true;
    // Fetch the thread by ID (from the request parameter)
    const threads = await threadModel.find({author: user.username}).populate({
      path: "author", 
      model: "Users",
      localField: "author",
      foreignField: "username",
      select: "username avatar",
    }).lean();

    const updatedThreads = threads.map((thread) => {
      const isLike = thread.likes.some(
        (like) => like.user_Id?.toString() === user_Id
      );
      const isAuthor = thread.author_Id.toString() === user_Id;
      return { ...thread, isLike, isAuthor };
    });
    console.log(updatedThreads);
    const followData = await UserFollowModel.findOne({ user_Id: user._id }).lean();
    const followers = followData?.followers || [];
    const followings = followData?.followings || [];
    console.log(followers);
    console.log(followings);
    // Render the profile view with threads, comments, followers, and followings
    res.render("Profile", { threads: updatedThreads, comments: updatedThreads.comments, user,followers: followers,followings: followings, isLogin});
    
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
  const decode = jwt.verify(token, "22127104_22127247");
  const user_Id = decode.id;
  const { username, quote } = req.body;
  const avatar = req.file; // Get the uploaded file from multer

  try {
      const user = await UserModel.findById(user_Id);
      if (!user) {
          return res.status(404).send("User not found");
      }

      if (username) user.username = username;
      if (quote) user.quote = quote;
      if (avatar) {
          user.avatar = avatar.buffer; // Example: store the image buffer directly (not recommended for production)
      }

      await user.save();
      res.send("User has been updated!");
  } catch (error) {
      console.error(error);
      res.status(500).send("Can't update user!");
  }
};

// const unfollow = async (req, res) => {
//   const { followerId } = req.params;
//   const token = req.cookies.token;

//   if (!token) {
//     return res.redirect("/login");
//   }

//   try {
//     const decode = jwt.verify(token, "22127104_22127247");
//     const user_Id = decode.id;

//     const followData = await UserFollowModel.findOne({ user_Id });
//     console.log("follower");
//     console.log(followerId);
//     console.log(user_Id);
//     if (!followData) {
//       return res.status(404).json({ success: false, message: 'Follow data not found' });
//     }
//     console.log(followData.followings);
//     followData.followings = followData.followings.filter(
//       (user_Id) => user_Id.toString() !== followerId
//     );

//     // If you want to also remove the user from their own followers (bi-directional unfollow)
//     // const targetUserFollowData = await UserFollowModel.findOne({ user_Id: followerId });

//     // if (targetUserFollowData) {
//     //   targetUserFollowData.followers = targetUserFollowData.followers.filter(
//     //     (id) => id.toString() !== user_Id
//     //   );
//     //   await targetUserFollowData.save();
//     // }

//     console.log("after");
//     console.log(followData.followings);

//     await followData.save();

//     res.json({ success: true });
//   } catch (error) {
//     console.error("Error during unfollow:", error);
//     res.status(500).json({ success: false, message: 'An error occurred while unfollowing' });
//   }
// };
const unfollow = async (req, res) => {
  const { followerId } = req.params;
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decode = jwt.verify(token, "22127104_22127247");
    const user_Id = decode.id;

    const followData = await UserFollowModel.findOne({ userId: user_Id });

    if (!followData) {
      return res.status(404).json({ success: false, message: 'Follow data not found' });
    }

    // Filter out the followerId from the followings list
    followData.followings = followData.followings.filter(
      (id) => id.toString() !== followerId
    );

    // Save the updated follow data
    await followData.save();

    // Optionally, handle bi-directional unfollow
    const targetUserFollowData = await UserFollowModel.findOne({ userId: followerId });

    if (targetUserFollowData) {
      targetUserFollowData.followers = targetUserFollowData.followers.filter(
        (id) => id.toString() !== user_Id
      );
      await targetUserFollowData.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error during unfollow:", error);
    res.status(500).json({ success: false, message: 'An error occurred while unfollowing' });
  }
};

const ProfileController = {
  // redirectToSettings: redirectToSettings,
  // loadUserThreadData: loadUserThreadData,
  // renderProfile: renderProfile,
  showProfile: showProfile,
  updateProfile: updateProfile,
  unfollow: unfollow,
};

export default ProfileController;