import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    author: { 
        type: String, 
        required: true 
    },
    comment: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
});

const LikeSchema = new mongoose.Schema({
    author: { 
        type: String, 
        required: true 
    },
});

const ThreadSchema = new mongoose.Schema({
    author: { 
        type: String, 
        ref: "Users", 
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
    image: { 
        type: String, 
        default: "" 
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
