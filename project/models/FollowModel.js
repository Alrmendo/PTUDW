import mongoose from "mongoose";

const FollowDetailSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        default: "/images/av1.jpg"
    }
});

//Main Schema
const UserFollowSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    followings: {
        type: [FollowDetailSchema], 
        default: []
    },
    followers: {
        type: [FollowDetailSchema], 
        default: []
    }
});

const UserFollowModel = mongoose.model("UserFollow", UserFollowSchema);

export default UserFollowModel;
