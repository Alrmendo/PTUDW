import mongoose from "mongoose";

const UserFollowSchema = new mongoose.Schema({
    user_Id: {
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
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    followers: {
        type: [UserFollowSchema],
        default: []
    },
    followings: {
        type: [UserFollowSchema],
        default: []
    },
});

const FollowModel = mongoose.model("Follows", FollowSchema);

export default FollowModel;
