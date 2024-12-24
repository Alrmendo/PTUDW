import UserInfoModel from '../models/UserModel.js';
import UserFollowModel from '../models/FollowModel.js';
import ThreadModel from '../models/ThreadModel.js';
import NotificationController from './NotiController.js';

import jwt from "jsonwebtoken";

const loadSearch = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  const decode = jwt.verify(
    token,
    "c8763fb94e2a4dc88263f70de16d72c34ff8f3f88f59bcefc9f3e05e3c3c0a7a9d8ab67d5e4131dc681f6bca7b6eb8c9213d2ffbd4cbf28a40a37d3ea7f6b05b"
  );

  try {
    const user_Id = decode.userId;
    const searchQuery = req.query.q || '';
    const users = await UserInfoModel.find({ _id: { $ne: user_Id } }).lean();
    const followData = await UserFollowModel.findOne({ user_Id }).lean();

    const followingUserIds = followData ? followData.followings : [];
    const filteredProfiles = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const result = await Promise.all(filteredProfiles.map(async user => {
      const userFollowData = await UserFollowModel.findOne({ user_Id: user._id }).lean();
      const isFollowing = followingUserIds.some(followingId => followingId.equals(user._id));

      return {
        id: user._id,
        avatar: user.avatar,
        username: user.username,
        bio: user.quote || '',
        status: isFollowing,
        followers: userFollowData ? userFollowData.followers.length : 0
      };
    }))
    res.render("Search", { infomations: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const SearchController = {
  loadSearch: loadSearch,
}

export default SearchController;