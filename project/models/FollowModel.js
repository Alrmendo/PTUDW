import mongoose from "mongoose";

const UserFollow = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "/images/av1.jpg"
    },
});

const FollowSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    followers: {
        type: [UserFollow],
        default: []
    },
    followings: {
        type: [UserFollow],
        default: []
    },
});

const FollowModel = mongoose.model("Follows", FollowSchema);

export default FollowModel;
