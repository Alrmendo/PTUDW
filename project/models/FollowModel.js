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
        unique: true,
        ref: "users" 
    },
    followings: {
        type: [FollowDetailSchema], 
        default: [],
        ref: "users"
    },
    followers: {
        type: [FollowDetailSchema], 
        default: [],
        ref: "users"
    }
});

const UserFollowModel = mongoose.model("Follows", UserFollowSchema);

export default UserFollowModel;