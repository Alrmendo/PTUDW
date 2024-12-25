import threadModel from "../models/ThreadModel.js";
import userModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";

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
        res.render("Thread", { threads: threads, isLogin: false });
    } else {
        const decode = jwt.verify(
            token,
            "22127104_22127247"
        );
        try {
            const user_Id = decode.user_Id;
            const user = await userModel.findById(user_Id);
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
            const updatedThreads = threads.map((thread) => {
                const isLike = thread.likes.some(
                    (like) => like.user_Id.toString() === user_Id
                );
                return { ...thread, isLike };
            });
            res.render("Thread", { threads: updatedThreads, avatar: user.avatar, isLogin: true });
        } catch (error) {
            console.error("Error fetching threads:", error);
            res
                .status(500)
                .json({ message: "An error occurred while loading the feed" });
        }
    }
};

const likeThread = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        res.redirect("/login");
        return;
    }
    const decode = jwt.verify(
        token,
        "22127104_22127247"
    );
    const thread = await threadModel.findById(req.params.id);

    if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
    }

    const userLiked = thread.likes.some(
        (like) => like.user_Id.toString() === decode.user_Id
    );

    if (userLiked) {
        thread.likes = thread.likes.filter(
            (like) => like.user_Id.toString() !== decode.user_Id
        );
    } else {
        thread.likes.push({ user_Id: decode.user_Id });
    }

    await thread.save();

    res.status(200).json({ message: "Thread updated successfully" });
};

const loadFollowingThread = async (req, res) => {
}

const addComment = async (req, res) => {
    const { content } = req.body;
    console.log(content);
    console.log(req.params.id);
    const token = req.cookies.token;
    if (!token) {
        res.redirect("/login");
        return;
    }
    const decode = jwt.verify(
        token,
        "22127104_22127247"
    );
    try {
        const thread = await threadModel.findById(req.params.id);
        thread.comments.push({ comment_Id: decode.user_Id, comment: content });
        await thread.save();
        res.status(200).json({ message: "Comment added successfully" });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "An error occurred while adding the comment" });
    }
}

const loadThread = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        res.redirect("/login");
        return;
    }
    const decode = jwt.verify(
        token,
        "22127104_22127247"
    );
    try {
        const thread = await threadModel.findById(req.params.id).populate({
            path: "author",
            model: "Users",
            localField: "author",
            foreignField: "username",
            select: "username avatar",
        }).populate({
            path: "comments.comment_Id",
            localField: "comments.comment_Id",
            foreignField: "_id",
            model: "Users",
            select: "username avatar"
        }).lean();
        const isLike = thread.likes.some(
            (like) => like.user_Id.toString() === decode.user_Id
        );
        const user = await userModel.findById(decode.user_Id).lean();
        const updatedThread = { ...thread, isLike };
        res.render("post", { threads: [updatedThread], comments: updatedThread.comments, avatar: user.avatar });
    } catch (error) {
        console.error("Error fetching thread:", error);
        res.status(500).json({ message: "An error occurred while loading the thread" });
    }
}

const FeedController = {
    loadAllThread: loadAllThread,
    likeThread: likeThread,
    loadFollowingThread: loadFollowingThread,
    addComment: addComment,
    loadThread: loadThread,
};

export default FeedController;
