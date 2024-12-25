import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const LikeSchema = new mongoose.Schema({
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
});

const ThreadSchema = new mongoose.Schema({
    author: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        default: "" 
    },
    author_Id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    comments: { 
        type: [CommentSchema], 
        default: [] 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    content: { 
        type: String, 
        required: true 
    },
    likes: { 
        type: [LikeSchema], 
        default: [] 
    },
});

const ThreadModel = mongoose.model("Threads", ThreadSchema);

export default ThreadModel;
