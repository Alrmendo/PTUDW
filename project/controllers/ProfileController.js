import FollowModel from '../models/FollowModel.js';
import UserModel from '../models/UserModel.js';
import threadModel from '../models/ThreadModel.js';
import UserFollowModel from '../models/FollowModel.js';
import jwt from "jsonwebtoken";

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

// const showProfile = async (req, res) => {

  
  
//   const token = req.cookies.token;
//     if (!token) {
//       res.redirect("/login");
//       return;
//     }
//     const decode = jwt.verify(token,"22127104_22127247");
//     try{
//       const user_Id = decode.id;
//       const user = await UserModel.findById(user_Id);
//       const threads = await threadModel.findById(req.params.id).populate({
//         path: "author",
//         model: "Users",
//         localField: "author",
//         foreignField: "username",
//         select: "username avatar",
//       }).populate({
//         path: "comments.commentId",
//         localField: "comments.commentId",
//         foreignField: "_id",
//         model: "Users",
//         select: "username avatar"
//       }).lean();

//       const followData = await UserFollowModel.findOne({ userId: user._id }).lean();
//       const followers = followData?.followers || [];
//       const followings = followData?.followings || [];
//       const updatedThreads = threads.map((thread) => {
//         const isLike = thread.likes?.some(
//           (like) => like.user_Id && like.user_Id.toString() === user_Id
//         ) || false;
//         return { ...thread, isLike };
//       });
//       res.render("Post", { threads: updatedThreads, comments: updatedThreads.comments, user: user, followers, followings});
//   } catch (error) {
//     console.error("Error fetching thread:", error);
//     res.status(500).json({ message: "An error occurred while loading the thread" });
//   }
// }

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
        (like) => like.user_Id.toString() === idOfUser
      );
      const isAuthor = thread.author_Id.toString() === idOfUser;
      return { ...thread, isLike, isAuthor };
    });
    console.log(updatedThreads);
    const followData = await UserFollowModel.findOne({ userId: user._id }).lean();
    const followers = followData?.followers || [];
    const followings = followData?.followings || [];

    // Render the profile view with threads, comments, followers, and followings
    res.render("Profile", { threads: updatedThreads, comments: updatedThreads.comments, user, followers, followings });
    
  } catch (error) {
    console.error("Error fetching thread:", error);
    res.status(500).json({ message: "An error occurred while loading the thread" });
  }
};

// const redirectToSettings = async (req, res) => {
//   res.redirect('/setting/account');
// };

const ProfileController = {
  // redirectToSettings: redirectToSettings,
  // loadUserThreadData: loadUserThreadData,
  // renderProfile: renderProfile,
  showProfile: showProfile,
};

export default ProfileController;
