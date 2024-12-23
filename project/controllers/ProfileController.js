import UserInfoModel from "../models/UserModel.js"; // Import your UserInfoModel
import threadModel from '../models/ThreadModel.js';
import UserFollowModel from '../models/FollowModel.js';

const loadProfile = async (req, res) => {
    const firstUser = await UserInfoModel.findOne({});

    const threads = await threadModel.find({author: firstUser.username}).populate({
        path: "author", 
        model: "users",
        localField: "author",
        foreignField: "username",
        select: "username avatar",
    });

    const followData = await UserFollowModel.findOne({ userId: firstUser._id }).lean();

    console.log(followData);
    const followers = followData?.followers || [];
    const followings = followData?.followings || [];
    
    res.render("Profile", { user: firstUser, threads: threads, followers, followings});

}


const ProfileController = {
    loadProfile: loadProfile,
};

export default ProfileController;