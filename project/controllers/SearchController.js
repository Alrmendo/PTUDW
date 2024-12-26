import UserModel from '../models/UserModel.js';
import FollowModel from '../models/FollowModel.js';
import jwt from "jsonwebtoken";

const JWT_SECRET = "22127104_22127247";

const loadSearch = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/login");
    }

    try {
        // Decode JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        // Get search query
        const searchQuery = req.query.q || '';

        // Get users excluding the current user
        const users = await UserModel.find({ _id: { $ne: userId } });

        // Fetch follow data
        const followData = await FollowModel.findOne({ userId }).lean();
        const followingUsernames = followData ? followData.followings.map(follow => follow.username) : [];
        
        // Filter and map profiles
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

        // Render search results
        res.render("Search", { infomations: result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Controller
const SearchController = {
    loadSearch,
};

// Export
export default SearchController;
