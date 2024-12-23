import mongoose from "mongoose";

const ThreadCommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    comment_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const ThreadLikeSchema = new mongoose.Schema({
    user_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
});

//Main Schema
const ThreadSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        ref: 'users' ,
    },
    author_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: {
        type: [ThreadCommentSchema], 
        default: []
    },
    likes: {
        type: [ThreadLikeSchema], 
        default: []
    }
});

const ThreadModel = mongoose.model("threads", ThreadSchema);

export default ThreadModel;
