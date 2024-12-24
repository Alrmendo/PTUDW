import threadModel from '../models/ThreadModel.js';
import UserInfoModel from '../models/UserModel.js';
import jwt from "jsonwebtoken"
// const loadAllFeed = async (req, res) => {
//   const token = req.cookies?.token;
//   console.log(token);
//   if (token)
//   {
//     const decoded = jwt.verify(token, "22127104_22127247");
    
//     try {
//       const userId = decoded.userId;
//       console.log(userId);
//       const user = await UserInfoModel.findById(userId);
//       const threads = await threadModel.find({}).populate({
//         path: "author",
//         model: "users",
//         localField: "author",
//         foreignField: "username",
//         select: "username avatar",
//       });
//       console.log("islogin");
//       if (!user)
//         console.log("wrong");

//       res.render('index', {threads: threads, isLogin: true, user: user });
//     } catch (error) {
//         console.error('Error fetching threads:', error);
//         res.status(500).json({message: 'An error occurred while loading the feed'});
//     }
//   }
//   else 
//   {
//     try {
//       const threads = await threadModel.find({}).populate({
//         path: "author",
//         model: "users",
//         localField: "author",
//         foreignField: "username",
//         select: "username avatar",
//       });
//       res.render('index', {threads: threads, isLogin: false });
//     } catch (error) {
//         console.error('Error fetching threads:', error);
//         res.status(500).json({message: 'An error occurred while loading the feed'});
//     }
//   }

//   };
const loadAllFeed = async (req, res) => {
  const token = req.cookies?.token;
  console.log("Token:", token);
  
  if (token) {
    try {
      const decoded = jwt.verify(token, "22127104_22127247");
      console.log("Decoded token:", decoded);

      const userId = decoded.id; // Adjusted to match the token payload
      const user = await UserInfoModel.findById(userId);

      // if (!user) {
      //   console.log("User not found.");
      //   return res.render('index', { threads: [], isLogin: false });
      // }

      const threads = await threadModel.find({}).populate({
        path: "author",
        model: "users",
        localField: "author",
        foreignField: "username",
        select: "username avatar",
      });

      res.render('index', { threads, isLogin: true, user });
    } catch (error) {
      console.error("Error during token verification or data retrieval:", error);
      res.status(500).json({ message: "An error occurred while loading the feed." });
    }
  } else {
    try {
      const threads = await threadModel.find({}).populate({
        path: "author",
        model: "users",
        localField: "author",
        foreignField: "username",
        select: "username avatar",
      });

      res.render('index', { threads, isLogin: false });
    } catch (error) {
      console.error("Error fetching threads:", error);
      res.status(500).json({ message: "An error occurred while loading the feed." });
    }
  }
};

const likeThread = (req, res) => {
    const { userid, threadid } = req.body;
    console.log(`User ${userid} liked thread ${threadid}`);
    res.status(200).json({ message: 'Sucessfully receives message' });
}

const FeedController = {
    loadAllFeed: loadAllFeed,
    likeThread: likeThread,
};

export default FeedController;