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
    res.render("Profile", { threads: updatedThreads, comments: updatedThreads.comments, user, followers, followings, isLogin});
    
  } catch (error) {
    console.error("Error fetching thread:", error);
    res.status(500).json({ message: "An error occurred while loading the thread" });
  }
};
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage }).single('avatar');
const updateProfile = async (req, res) => {
  const token = req.cookies.token;
  if (!req.cookies.token)
    return res.redirect("/login");
  const decode = jwt.verify(token, "22127104_22127247");
  console.log("token");
  console.log(token);
  console.log(req.body);
  const user_Id = decode.id;
  const {username, quote} = req.body;

  try {

    const user = await UserModel.findById(user_Id);
    console.log("usernaame");
    if (!user)     console.log("fck");

    console.log(username);
    console.log(quote);
    if (username) 
      user.username = username;
    if (quote)
      user.quote = quote;
    const avatar = req.file; // Get the uploaded file from multer
    if (avatar) {
      // If an avatar is uploaded, you may want to handle it (e.g., save it to a path or cloud storage)
      user.avatar = avatar.buffer; // Example: store the image buffer directly (not recommended for production)
    }
    // if (avatar)
    //   user.avatar = imageUpload;
    await user.save();
    res.send("User has been updated!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Can not update user!");
  }
};

const ProfileController = {
  // redirectToSettings: redirectToSettings,
  // loadUserThreadData: loadUserThreadData,
  // renderProfile: renderProfile,
  showProfile: showProfile,
  updateProfile: updateProfile,
};

export default ProfileController;
