import UserModel from '../models/UserModel.js';
import FollowModel from '../models/FollowModel.js';
import jwt from "jsonwebtoken";

const SECRET_KEY = "22127104_22127247";

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
};

const loadSearch = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }

  const decode = verifyToken(token);
  if (!decode) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const userId = decode.userId;
    const searchQuery = req.query.q?.trim() || '';
    
    // Lấy danh sách người dùng ngoại trừ chính user hiện tại
    const users = await UserModel.find({ _id: { $ne: userId } });
    
    // Lấy thông tin follow của user hiện tại
    const followData = await FollowModel.findOne({ userId });
    const followingUsernames = followData?.followings.map(follow => follow.username) || [];

    // Lọc người dùng theo từ khóa tìm kiếm
    const filteredProfiles = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Chuẩn hóa kết quả trả về
    const result = filteredProfiles.map(user => ({
      avatar: user.avatar,
      username: user.username,
      bio: user.quote || '',
      status: followingUsernames.includes(user.username),
      followers: followData?.followers.length || 0
    }));

    res.render("Search", { infomations: result });
  } catch (error) {
    console.error("Error loading search:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const SearchController = {
  loadSearch,
};

export default SearchController;
