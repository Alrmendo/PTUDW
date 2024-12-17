import mongoose from "mongoose";


const sub_comment_db = new mongoose.Schema({
    comment: { type: String, required: true },
    comment_ID: { type: mongoose.Schema.Types.ObjectId, required: true },
    date: { type: Date, default: Date.now },
});


const sub_like_db = new mongoose.Schema({
    user_ID: { type: mongoose.Schema.Types.ObjectId, required: true },
});

// Main schema for threads
const thread_db = new mongoose.Schema({
    author: { type: String, required: true },
    author_ID: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    image: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    comments: { type: [sub_comment_db], default: [] }, //khác nhau so với sub_comment_db
    likes: { type: [sub_like_db], default: [] }, //tương tự
});

// Model for Thread
const ThreadModel = mongoose.model("Thread", thread_db);

export default ThreadModel;
