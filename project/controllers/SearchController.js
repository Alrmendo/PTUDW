import UserInfoModel from '../models/UserModel.js';

const loadSearch = async (req, res) => {
  const searchQuery = req.query.q || ""; 
  console.log(searchQuery);

  // Dữ liệu mẫu
  const profiles = [
    {
      avatar: '/image/av1.jpg',
      username: "user1",
      bio: "Freelancer.",
      status: "Theo dõi",
      followers: 120,
    },
    {
      avatar: '/image/av1.jpg',
      username: "user2",
      bio: "Freelancer.",
      status: "Theo dõi",
      followers: 80,
    },
    {
      avatar: '/image/av1.jpg',
      username: "user3",
      bio: "Freelancer.",
      status: "Đang theo dõi",
      followers: 45,
    },
  ];

  const filteredProfiles = profiles.filter(profile =>
    profile.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  res.render("Search", { infomations: filteredProfiles, searchQuery });
};


const SearchController = {
    loadSearch: loadSearch,
}

export default SearchController;