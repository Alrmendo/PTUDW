import threadModel from "../models/ThreadModel.js";
import userModel from "../models/UserModel.js";

const loadAllThread = async (req, res) => {
  const user = req.user; // Assuming middleware sets `req.user` if authenticated
  try {
    const threads = await threadModel
      .find({})
      .populate({
        path: "author",
        model: "Users",
        localField: "author",
        foreignField: "username",
        select: "username avatar",
      })
      .lean();

    if (!user) {
      res.render("Feed", { threads: threads, isLogin: false });
    } else {
      const updatedThreads = threads.map((thread) => {
        const isLike = thread.likes.some(
          (like) => like.userId.toString() === user._id.toString()
        );
        return { ...thread, isLike };
      });
      res.render("Feed", {
        threads: updatedThreads,
        avatar: user.avatar,
        isLogin: true,
      });
    }
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ message: "An error occurred while loading the feed" });
  }
};

const likeThread = async (req, res) => {
  const user = req.user; // Assuming middleware sets `req.user`
  if (!user) {
    res.redirect("/login");
    return;
  }

  try {
    const thread = await threadModel.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const userLiked = thread.likes.some(
      (like) => like.userId.toString() === user._id.toString()
    );

    if (userLiked) {
      thread.likes = thread.likes.filter(
        (like) => like.userId.toString() !== user._id.toString()
      );
    } else {
      thread.likes.push({ userId: user._id });
    }

    await thread.save();

    res.status(200).json({ message: "Thread updated successfully" });
  } catch (error) {
    console.error("Error liking thread:", error);
    res.status(500).json({ message: "An error occurred while liking the thread" });
  }
};

const addComment = async (req, res) => {
  const { content } = req.body;
  const user = req.user; // Assuming middleware sets `req.user`
  if (!user) {
    res.redirect("/login");
    return;
  }

  try {
    const thread = await threadModel.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    thread.comments.push({ commentId: user._id, comment: content });
    await thread.save();

    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "An error occurred while adding the comment" });
  }
};

const loadThread = async (req, res) => {
  const user = req.user; // Assuming middleware sets `req.user`
  if (!user) {
    res.redirect("/login");
    return;
  }

  try {
    const thread = await threadModel
      .findById(req.params.id)
      .populate({
        path: "author",
        model: "Users",
        localField: "author",
        foreignField: "username",
        select: "username avatar",
      })
      .populate({
        path: "comments.commentId",
        localField: "comments.commentId",
        foreignField: "_id",
        model: "Users",
        select: "username avatar",
      })
      .lean();

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const isLike = thread.likes.some(
      (like) => like.userId.toString() === user._id.toString()
    );

    const updatedThread = { ...thread, isLike };
    res.render("Post", {
      threads: [updatedThread],
      comments: updatedThread.comments,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Error fetching thread:", error);
    res.status(500).json({ message: "An error occurred while loading the thread" });
  }
};

const FeedController = {
  loadAllThread,
  likeThread,
  addComment,
  loadThread,
};

export default FeedController;
