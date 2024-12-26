import threadModel from "../models/ThreadModel.js";
import userModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";


const JWT_SECRET = "22127104_22127247";

const loadAllThread = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    const threads = await threadModel.find({}).populate({
      path: "author",
      model: "Users",
      localField: "author",
      foreignField: "username",
      select: "username avatar",
    }).lean();
    res.render("Home", { threads: threads, isLogin: false });
  } else {
    const decode = jwt.verify(
      token, JWT_SECRET
    );
    try {
      const userId = decode.userId;
      const user = await userModel.findById(userId);
      const threads = await threadModel
        .find({})
        .populate({
          path: "author",
          model: "Users",
          localField: "author",
          foreignField: "username",
          select: "username avatar",
        }).lean();
      threads.reverse();
      const updatedThreads = threads.map((thread) => {
        const isLike = thread.likes.some(
          (like) => like.userId.toString() === userId
        );
        return { ...thread, isLike };
      });
      res.render("Home", { threads: updatedThreads, avatar: user.avatar, isLogin: true });
    } catch (error) {
      console.error("Error fetching threads:", error);
      res.status(500).json({ message: "An error occurred while loading the feed" });
    }
  }
};


import NotificationController from "../controllers/NotificationController.js";

// const likeThread = async (req, res) => {
//   const token = req.cookies.token;
//   if (!token)
//     return res.redirect("/login");
//   const decode = jwt.verify(token, JWT_SECRET);
  
//   const thread = await threadModel.findById(req.params.id);
//   if (!thread) {
//     return res.status(404).json({ message: "Thread not found" });
//   }

//   const userLiked = thread.likes.some(
//     (like) => like.userId.toString() === decode.userId
//   );

//   if (userLiked) {
//     thread.likes = thread.likes.filter(
//       (like) => like.userId.toString() !== decode.userId
//     );
//   } else {
//     thread.likes.push({ userId: decode.userId });
//   }

//   await thread.save();

//   res.status(200).json({ message: "Thread updated successfully" });
// };
const likeThread = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");
  
  const decode = jwt.verify(token, JWT_SECRET);
  
  const thread = await threadModel.findById(req.params.id).populate('authorId');
  if (!thread) {
    return res.status(404).json({ message: "Thread not found" });
  }

  const userLiked = thread.likes.some(
    (like) => like.userId.toString() === decode.userId
  );

  if (userLiked) {
    thread.likes = thread.likes.filter(
      (like) => like.userId.toString() !== decode.userId
    );
  } else {
    thread.likes.push({ userId: decode.userId });

    // Notify the author when someone likes the thread
    const likingUser = await userModel.findById(decode.userId);
    if (thread.authorId && thread.authorId._id.toString() !== decode.userId) {
      NotificationController.addNotification(
        thread.authorId._id,
        `${likingUser.username} liked your thread`,
        likingUser.avatar,
        likingUser.username
      );
    }
  }

  await thread.save();
  res.status(200).json({ message: "Thread updated successfully" });
};
const addComment = async (req, res) => {
  const { content } = req.body;
  const token = req.cookies.token;
  if (!token)
    return res.redirect("/login");
  const decode = jwt.verify(token, JWT_SECRET);
  try {
    const thread = await threadModel.findById(req.params.id).populate('authorId');
    thread.comments.push({ commentId: decode.userId, comment: content });
    await thread.save();
    const commentingUser = await userModel.findById(decode.userId);
    if (thread.authorId && thread.authorId._id.toString() !== decode.userId) {
      NotificationController.addNotification(
        thread.authorId._id,
        `${commentingUser.username} commented on your thread`,
        commentingUser.avatar,
        commentingUser.username
      );
    }
    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "An error occurred while adding the comment" });
  }
}

const loadThread = async (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res.redirect("/login");
  const decode = jwt.verify(token,JWT_SECRET
  );
  try {
    const thread = await threadModel.findById(req.params.id).populate({
      path: "author",
      model: "Users",
      localField: "author",
      foreignField: "username",
      select: "username avatar",
    }).populate({
      path: "comments.commentId",
      localField: "comments.commentId",
      foreignField: "_id",
      model: "Users",
      select: "username avatar"
    }).lean();
    const isLike = thread.likes.some(
      (like) => like.userId.toString() === decode.userId
    );
    const user = await userModel.findById(decode.userId).lean();
    const updatedThread = { ...thread, isLike };
    res.render("Comment", { threads: [updatedThread], comments: updatedThread.comments, avatar: user.avatar, isLogin: true });
  } catch (error) {
    console.error("Error fetching thread:", error);
    res.status(500).json({ message: "An error occurred while loading the thread" });
  }
}

const FeedController = {
  loadAllThread: loadAllThread,
  likeThread: likeThread,
  addComment: addComment,
  loadThread: loadThread,
};

export default FeedController;
