import UserModel from '../models/UserModel.js';
import FollowModel from '../models/FollowModel.js';
import jwt from "jsonwebtoken";
import { query } from 'express';

const loadSearch = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/login");
    return;
  }
  const decode = jwt.verify(
    token,
    "22127104_22127247"
  );
  try {
    const user_Id = decode.user_Id;
    const searchQuery = req.query.q || '';
    const users = await UserModel.find({ _id: { $ne: user_Id } });

    const followData = await FollowModel.findOne({ user_Id });

    const followingUsernames = followData ? followData.followings.map(follow => follow.username) : [];

    const filteredProfiles = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const result = filteredProfiles.map(user => {
      const isFollowing = followingUsernames.includes(user.username);
      return {
        avatar: user.avatar,
        username: user.username,
        bio: user.quote || '',
        status: isFollowing,
        followers: followData ? followData.followers.length : 0
      };
    });
    res.render("Search", { infomations: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const SearchController = {
  loadSearch: loadSearch,
}

export default SearchController;