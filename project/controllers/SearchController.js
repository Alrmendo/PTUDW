import UserInfoModel from '../models/UserModel.js';
import UserFollowModel from '../models/FollowModel.js';

const loadSearch = async (req, res) => {
  const searchQuery = req.query.q || ""; 
  console.log(searchQuery);

  // Dữ liệu mẫu
  // const profiles = [
  //   {
  //     avatar: '/images/av1.jpg',
  //     username: "user1",
  //     bio: "Freelancer.",
  //     status: "Theo dõi",
  //     followers: 120,
  //   },
  //   {
  //     avatar: '/images/av1.jpg',
  //     username: "user2",
  //     bio: "Freelancer.",
  //     status: "Theo dõi",
  //     followers: 80,
  //   },
  //   {
  //     avatar: '/images/av1.jpg',
  //     username: "user3",
  //     bio: "Freelancer.",
  //     status: "Đang theo dõi",
  //     followers: 45,
  //   },
  // ];
  
  const profiles = await UserInfoModel.find({});

  const enrichedProfiles = await Promise.all(profiles.map(async (profile) => {
    const userFollow = await UserFollowModel.findOne({ userId: profile._id });

    const followerCount = userFollow ? userFollow.followers.length : 0;

    return {
      avatar: profile.avatar,
      username: profile.username,
      bio: profile.bio || "", 
      status: userFollow && userFollow.followings.find(following => following.userId.toString() === profile._id.toString()) ? "Following" : "Not Following",
      followers: followerCount,
    };
  }));
  const filteredProfiles = enrichedProfiles.filter(profile =>
    profile.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  res.render("Search", { infomations: filteredProfiles, searchQuery });
};


const SearchController = {
    loadSearch: loadSearch,
}

export default SearchController;