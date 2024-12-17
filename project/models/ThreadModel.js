import mongoose from "mongoose";


const comment_db = new mongoose.Schema({
    comment: { type: String, required: true },
    comment_ID: { type: mongoose.Schema.Types.ObjectId, required: true },
    date: { type: Date, default: Date.now },
});


const like_db = new mongoose.Schema({
    user_ID: { type: mongoose.Schema.Types.ObjectId, required: true },
});

// Main schema for threads
const thread_db = new mongoose.Schema({
    author: { type: String, required: true },
    author_ID: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    image: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    comments: { type: [comment_db], default: [] }, // Embedded comment sub-schema
    likes: { type: [like_db], default: [] },       // Embedded like sub-schema
});

// Model for Thread
const ThreadModel = mongoose.model("Thread", thread_db);

export default ThreadModel;
