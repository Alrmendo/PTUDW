import mongoose from "mongoose";

const Comment = new mongoose.Schema({
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

const Like = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
  },
});

const ThreadSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    ref: "Users"
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
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users"

  },
  comments: {
    type: [Comment],
    default: []
  },
  likes: {
    type: [Like],
    default: []
  },
});

const ThreadModel = mongoose.model("Threads", ThreadSchema);

export default ThreadModel;
